import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, SignupData } from '@/types';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

// Normalize varying backend user shapes into our User type
const normalizeUser = (u: unknown): import('@/types').User => {
  const user = u as Record<string, unknown>;
  return {
    id: user?.id as number ?? 0,
    email: user?.email as string ?? '',
    // Accept multiple shapes: is_admin, isAdmin, role === 'admin'
    is_admin: Boolean(user?.is_admin ?? user?.isAdmin ?? (typeof user?.role === 'string' && user.role.toLowerCase() === 'admin')),
    organization_id: user?.organization_id as number ?? user?.organizationId as number ?? user?.org_id as number ?? 0,
    organization_name: user?.organization_name as string ?? user?.organizationName as string,
    created_at: user?.created_at as string ?? user?.createdAt as string ?? new Date().toISOString(),
    status: (user?.status as 'active' | 'pending' | 'inactive') ?? 'active',
  };
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  signupEmployee: (data: { invite_token: string; full_name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiService.auth.login(credentials);
          
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          
          set({
            user: normalizeUser(response.user),
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          toast({
            title: "Welcome back!",
            description: "You have been successfully logged in."
          });
        } catch (error: unknown) {
          const err = error as { response?: { data?: { detail?: string } } };
          const errorMessage = err.response?.data?.detail || 'Login failed';
          set({ 
            error: errorMessage, 
            isLoading: false,
            isAuthenticated: false 
          });
          
          toast({
            title: "Login failed",
            description: errorMessage,
            variant: "destructive"
          });
          throw error;
        }
      },

      signup: async (data: SignupData) => {
        set({ isLoading: true, error: null });
        try {
          let response;
          
          // Check if this is an employee signup (has invite_token) or admin signup
          if (data.invite_token) {
            // Employee signup
            response = await apiService.auth.employeeSignup({
              invite_token: data.invite_token,
              full_name: data.full_name || '',
              email: data.email,
              password: data.password
            });
          } else {
            // Admin signup - requires organization_name
            if (!data.organization_name) {
              throw new Error('Organization name is required for admin signup');
            }
            response = await apiService.auth.adminSignup(data);
          }
          
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          
          set({
            user: normalizeUser(response.user),
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          toast({
            title: data.invite_token ? "Welcome to the team!" : "Account created!",
            description: data.invite_token ? "You have successfully joined the organization." : "Welcome to DataFlow AI."
          });
        } catch (error: unknown) {
          const err = error as { response?: { data?: { detail?: string } }; message?: string };
          const errorMessage = err.response?.data?.detail || err.message || 'Signup failed';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          
          toast({
            title: "Signup failed",
            description: errorMessage,
            variant: "destructive"
          });
          throw error;
        }
      },

      signupEmployee: async (data: { invite_token: string; full_name: string; email: string; password: string }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiService.auth.employeeSignup(data);
          
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          
          set({
            user: normalizeUser(response.user),
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          toast({
            title: "Welcome to the team!",
            description: "Your account has been created successfully."
          });
        } catch (error: unknown) {
          const err = error as { response?: { data?: { detail?: string } }; message?: string };
          const errorMessage = err.response?.data?.detail || err.message || 'Employee signup failed';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          
          toast({
            title: "Signup failed",
            description: errorMessage,
            variant: "destructive"
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });

        toast({
          title: "Logged out",
          description: "You have been successfully logged out."
        });
      },

      getCurrentUser: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await apiService.auth.getCurrentUser();
          set({
            user: normalizeUser(user),
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired'
          });
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);