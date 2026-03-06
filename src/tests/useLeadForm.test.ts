import { render, screen, fireEvent } from '@testing-library/react';
import LeadForm from '../components/LeadForm';
import { CreateLeadInput } from '../types/api';

test('submits the lead form', async () => {
    const mockOnSubmit = jest.fn();
    render(<LeadForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByText(/submit/i));

    expect(mockOnSubmit).toHaveBeenCalledWith({
        user_id: expect.any(String), // Assume user_id será fornecido de alguma forma
        name: 'John Doe',
        email: 'john@example.com'
    });
});