import { useState } from 'react';
import axios from 'axios';
import { createLead } from '../services/api';

interface LeadFormData {
  name: string;
  email: string;
}

interface UseLeadFormReturn {
  formData: LeadFormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const validateLeadFormInputs = ({ name, email }: LeadFormData): boolean => {
  return name !== '' && email !== '' && /\S+@\S+\.\S+/.test(email);
};

export const useLeadForm = (): UseLeadFormReturn => {
  const [formData, setFormData] = useState<LeadFormData>({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value.trim() }));
  };

  const submitLeadForm = async (leadData: LeadFormData) => {
    try {
      const response = await createLead(leadData.name, leadData.email);
      return response;
    } catch (err) {
      setError('An unexpected error occurred.');
      throw err;
    }
  };

  const handleValidation = () => {
    if (!validateLeadFormInputs(formData)) {
      setError('Name and email are required, and email must be valid.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!handleValidation()) {
      setIsLoading(false);
      return;
    }

    try {
      await submitLeadForm(formData);
    } catch {
      setError('Failed to submit the form.');
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, handleChange, handleSubmit, isLoading, error };
};

const baseUrl = 'https://api.axionos.com/v1';

interface CreateUserResponse {
  id: string;
  email: string;
  created_at: string;
}

interface CreateLeadResponse {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export const createUser = async (email: string, password: string): Promise<CreateUserResponse> => {
  const response = await axios.post<CreateUserResponse>(`${baseUrl}/users`, { email, password });
  return response.data;
};

export const createLead = async (name: string, email: string): Promise<CreateLeadResponse> => {
  const response = await axios.post<CreateLeadResponse>(`${baseUrl}/leads`, { name, email });
  return response.data;
};

describe('Auth Service', () => {
  it('should create a new user', async () => {
    const user = await createUser('test@example.com', 'password123');
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email', 'test@example.com');
  });

  it('should throw an error if the email is already in use', async () => {
    await expect(createUser('test@example.com', 'password123')).rejects.toThrow();
  });
});

import { fireEvent, waitFor, screen } from '@testing-library/react';
import { useLeadForm } from '../hooks/useLeadForm';

it('should handle lead form submission', async () => {
  const { formData, handleChange, handleSubmit, isLoading, error } = useLeadForm();

  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });

  await waitFor(() => handleSubmit(new Event('submit')));

  expect(formData.name).toBe('John Doe');
  expect(formData.email).toBe('john@example.com');
  expect(isLoading).toBe(false);
  expect(error).toBe(null);
});

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

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

{
  "name": "axionos-landing-page",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"
  },
  "dependencies": {
    "axios": "^0.21.1",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "lucide-react": "^0.0.100"
  },
  "devDependencies": {
    "vite": "^3.0.0",
    "@vitejs/plugin-react-swc": "^2.0.0"
  }
}

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
    <Footer />
  </Router>
);

export default App;

import React from 'react';
import { useLeadForm } from '../hooks/useLeadForm';

const Home = () => {
  const { formData, handleChange, handleSubmit, isLoading, error } = useLeadForm();

  return (
    <div className="max-w-lg mx-auto mt-10">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default Home;