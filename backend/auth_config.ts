// src/hooks/useLeadForm.ts
import { useState } from 'react';
import axios from 'axios';

interface LeadFormData {
    name: string;
    email: string;
}

interface UseLeadFormReturn {
    formData: LeadFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

function useLeadForm(): UseLeadFormReturn {
    const [formData, setFormData] = useState<LeadFormData>({ name: '', email: '' });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!formData.name || !formData.email) {
            setError('Nome e e-mail são obrigatórios.');
            setIsLoading(false);
            return;
        }

        try {
            await axios.post('https://api.axionos.com/v1/leads', formData);
            // handle successful submission (e.g., reset form or show success message)
        } catch (err) {
            setError('Erro ao enviar os dados. Verifique as informações e tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return { formData, handleChange, handleSubmit, isLoading, error };
}

export default useLeadForm;

// src/services/api.ts
import axios from 'axios';

interface CreateUserResponse {
    id: string;
    email: string;
    created_at: string;
}

interface CreateUserRequest {
    email: string;
    password: string;
}

export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    try {
        const response = await axios.post<CreateUserResponse>('https://api.axionos.com/v1/users', data);
        return response.data;
    } catch (err) {
        // Handle error appropriately
        throw new Error(err.response?.data?.message || 'Erro ao criar usuário.');
    }
}

// src/services/auth.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabase: SupabaseClient = createClient(
    'https://supa.techstorebrasil.com',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.N2nG61tlUEcrIqkCTnHLABlAo4z8fcl6an30W40fdac'
);

interface AuthServiceResponse {
    user: any; 
    session: any; 
}

export async function signIn(email: string, password: string): Promise<AuthServiceResponse> {
    const { user, session, error } = await supabase.auth.signIn({ email, password });
    if (error) {
        throw new Error(error.message);
    }
    return { user, session };
}

// src/tests/auth.test.ts
import { createUser } from '../services/api';
import { signIn } from '../services/auth';

describe('Auth Service Tests', () => {
    it('should create a user with valid data', async () => {
        const response = await createUser({ email: 'test@example.com', password: 'password123' });
        expect(response).toHaveProperty('id');
        expect(response.email).toBe('test@example.com');
    });

    it('should fail to create a user with an already used email', async () => {
        await expect(createUser({ email: 'test@example.com', password: 'password123' })).rejects.toThrow();
    });

    it('should sign in with valid credentials', async () => {
        const { user } = await signIn('test@example.com', 'password123');
        expect(user).toHaveProperty('email', 'test@example.com');
    });

    it('should fail to sign in with invalid credentials', async () => {
        await expect(signIn('wrong@example.com', 'wrongpassword')).rejects.toThrow();
    });
});

// src/tests/useLeadForm.test.ts
import { render, screen, fireEvent } from '@testing-library/react';
import useLeadForm from '../hooks/useLeadForm';

describe('useLeadForm Hook', () => {
    it('should handle input changes', () => {
        const { result } = renderHook(() => useLeadForm());
        fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'John Doe' } });
        expect(result.current.formData.name).toBe('John Doe');
    });

    it('should return error when submitting with empty fields', async () => {
        const { result } = renderHook(() => useLeadForm());
        await act(async () => {
            await result.current.handleSubmit(new Event('submit'));
        });

        expect(result.current.error).toBe('Nome e e-mail são obrigatórios.');
    });
});

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    plugins: [react()],
});

// index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AxionOS Landing Page</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>

// package.json
{
    "name": "axionos-landing-page",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "serve": "vite serve"
    },
    "dependencies": {
        "react": "^18.0.0",
        "react-dom": "^18.0.0",
        "axios": "^0.27.2",
        "lucide-react": "^1.0.0"
    },
    "devDependencies": {
        "@vitejs/plugin-react-swc": "^1.0.0",
        "typescript": "^4.5.0"
    }
}

// tsconfig.json
{
    "compilerOptions": {
        "target": "esnext",
        "module": "esnext",
        "jsx": "react-jsx",
        "strict": true,
        "moduleResolution": "node",
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
    },
    "include": ["src"],
    "exclude": ["node_modules"]
}

// tsconfig.app.json
{
    "extends": "./tsconfig.json",
    "include": ["src/**/*.ts", "src/**/*.tsx"]
}

// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;

// src/pages/Home.tsx
import React from 'react';
import useLeadForm from '../hooks/useLeadForm';

const Home: React.FC = () => {
    const { formData, handleChange, handleSubmit, isLoading, error } = useLeadForm();

    return (
        <div>
            <h1>Welcome to AxionOS</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Submit'}
                </button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default Home;

// src/components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
    return (
        <header>
            <h1>AxionOS</h1>
        </header>
    );
};

export default Header;