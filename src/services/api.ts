import axios, { AxiosError } from 'axios';

interface UserCreationRequest {
    email: string; 
    password: string; 
}

interface User {
    id: string; 
    email: string; 
    created_at: string; 
}

interface ApiResponse<T> {
    data: T; 
    error?: string; 
}

type CreateUserResponse = ApiResponse<User>;

async function createUser(userData: UserCreationRequest): Promise<CreateUserResponse> {
    if (!isValidEmail(userData.email) || !isValidPassword(userData.password)) {
        return {
            data: null,
            error: 'Email ou senha inválidos',
        };
    }

    try {
        const response = await axios.post<CreateUserResponse>('https://api.axionos.com/v1/users', userData);
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
}

function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isValidPassword(password: string): boolean {
    return password.length >= 6; 
}

function handleAxiosError(error: unknown): CreateUserResponse {
    const err = error as AxiosError;
    return {
        data: null,
        error: err.response?.data?.error || 'Erro desconhecido ao criar usuário',
    };
}

export { createUser, UserCreationRequest, CreateUserResponse };