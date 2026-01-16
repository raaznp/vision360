import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import { AuthProvider } from '@/contexts/AuthContext';
import * as SupabaseLib from '@/lib/supabase';

// Mock the supabase client
const mockSignInWithPassword = vi.fn();
const mockResetPasswordForEmail = vi.fn();
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: any[]) => mockSignInWithPassword(...args),
      resetPasswordForEmail: (...args: any[]) => mockResetPasswordForEmail(...args),
      getSession: (...args: any[]) => mockGetSession(...args),
      onAuthStateChange: (...args: any[]) => mockOnAuthStateChange(...args),
    }
  }
}));

// Wrapper
const renderWithAuth = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
};

describe('Auth Workflows', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
  });

  describe('Login Page', () => {
    it('should render login form', () => {
      renderWithAuth(<Login />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should call supabase signInWithPassword on submit', async () => {
      mockSignInWithPassword.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
      
      renderWithAuth(<Login />);
      
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockSignInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should display error message on failure', async () => {
      mockSignInWithPassword.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid credentials' } });
      
      renderWithAuth(<Login />);
      
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });
  });

  describe('Forgot Password Page', () => {
    it('should call resetPasswordForEmail on submit', async () => {
      mockResetPasswordForEmail.mockResolvedValue({ data: {}, error: null });

      renderWithAuth(<ForgotPassword />);
      
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'reset@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

      await waitFor(() => {
        expect(mockResetPasswordForEmail).toHaveBeenCalledWith('reset@example.com', expect.any(Object));
      });
    });

    it('should show success message after submission', async () => {
      mockResetPasswordForEmail.mockResolvedValue({ data: {}, error: null });

      renderWithAuth(<ForgotPassword />);
      
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'reset@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

      await waitFor(() => {
        expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      });
    });
  });

});
