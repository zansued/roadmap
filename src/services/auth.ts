import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  createdAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface ErrorResponse {
  status: number;
  message: string;
}

class AuthService {
  private static supabase: SupabaseClient;

  public static initializeSupabase(): SupabaseClient {
    if (!this.supabase) {
      this.supabase = createClient('https://supa.techstorebrasil.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.N2nG61tlUEcrIqkCTnHLABlAo4z8fcl6an30W40fdac');
    }
    return this.supabase;
  }

  public static async signUp(email: string, password: string): Promise<AuthResponse | ErrorResponse> {
    if (!this.validateEmail(email) || password.length < 6) {
      return { status: 422, message: 'Email inválido ou senha muito curta.' };
    }

    const { user, session, error } = await this.initializeSupabase().auth.signUp({ email, password });

    if (error) {
      return { status: error.status || 400, message: error.message };
    }

    return { user: { id: user!.id, email: user!.email, createdAt: user!.created_at }, token: session!.access_token };
  }

  public static async signIn(email: string, password: string): Promise<AuthResponse | ErrorResponse> {
    const { user, session, error } = await this.initializeSupabase().auth.signIn({ email, password });

    if (error) {
      return { status: error.status || 400, message: error.message };
    }

    return { user: { id: user!.id, email: user!.email, createdAt: user!.created_at }, token: session!.access_token };
  }

  public static async signOut(): Promise<void | ErrorResponse> {
    const { error } = await this.initializeSupabase().auth.signOut();

    if (error) {
      return { status: error.status || 400, message: error.message };
    }
  }

  private static validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

export default AuthService;