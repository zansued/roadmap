import { useState } from 'react';
import axios from 'axios';

// Interface para os dados do lead
interface LeadFormData {
    name: string;
    email: string;
}

// Resultado da submissão do formulário
interface LeadFormResponse {
    success: boolean;
    message: string;
}

// Error handling para validação
interface LeadFormError {
    field: string;
    message: string;
}

// Função principal do hook para gerenciar o formulário de leads
function useLeadForm(): {
    data: LeadFormData; 
    errors: LeadFormError[]; 
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void; 
    isSubmitting: boolean; 
} {
    const [data, setData] = useState<LeadFormData>({ name: '', email: '' });
    const [errors, setErrors] = useState<LeadFormError[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors: LeadFormError[] = [];
        if (!data.name || data.name.length > 50) {
            newErrors.push({ field: 'name', message: 'Nome é obrigatório e deve ter no máximo 50 caracteres.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
        if (!emailRegex.test(data.email)) {
            newErrors.push({ field: 'email', message: 'Email inválido.' });
        }
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors([]);
        const validationErrors = validate();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post<LeadFormResponse>('https://api.axionos.com/v1/leads', data);
            if (!response.data.success) {
                setErrors([{ field: 'submit', message: response.data.message }]);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrors([{ field: 'submit', message: error.response.data.message || 'Erro ao enviar o lead.' }]);
            } else {
                setErrors([{ field: 'submit', message: 'Erro de comunicação com a API.' }]);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return { data, errors, handleChange, handleSubmit, isSubmitting };
}

export default useLeadForm;