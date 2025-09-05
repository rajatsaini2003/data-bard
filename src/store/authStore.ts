import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, SignupData } from '@/types';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

// Normalize varying backend user shapes into our User type
const normalizeUser = (u: any): import('@/types').User => ({
  id: u?.id ?? 0,
  email: u?.email ?? '',
  // Accept multiple shapes: is_admin, isAdmin, role === 'admin'
  is_admin: Boolean(u?.is_admin ?? u?.isAdmin ?? (typeof u?.role === 'string' && u.role.toLowerCase() === 'admin')),
  organization_id: u?.organization_id ?? u?.organizationId ?? u?.org_id ?? 0,
  organization_name: u?.organization_name ?? u?.organizationName,
  created_at: u?.created_at ?? u?.createdAt ?? new Date().toISOString(),
  status: (u?.status as any) ?? 'active',
});

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
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
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Login failed';
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
          const response = await apiService.auth.adminSignup(data);
          
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          
          set({
            user: normalizeUser(response.user),
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          toast({
            title: "Account created!",
            description: "Welcome to DataFlow AI."
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Signup failed';
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