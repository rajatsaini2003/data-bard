import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  User,
  Dataset,
  DataMapping,
  DataPreview,
  LoginCredentials,
  SignupData,
  AuthResponse,
  InviteRequest,
  InviteResponse,
  PaginatedResponse,
  ListParams,
  Organization,
  AuditLog,
  NotificationData
} from '@/types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await axios.post('/auth/refresh', {
                refresh_token: refreshToken
              });
              
              const { access_token } = response.data;
              localStorage.setItem('access_token', access_token);
              
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/auth';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  auth = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await this.client.post('/auth/login', credentials);
      return response.data;
    },

    adminSignup: async (data: SignupData): Promise<AuthResponse> => {
      const response = await this.client.post('/auth/admin/signup', data);
      return response.data;
    },

    employeeSignup: async (data: { invite_token: string; full_name: string; email: string; password: string }): Promise<AuthResponse> => {
      const response = await this.client.post('/auth/employee/signup', data);
      return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
      const response = await this.client.get('/auth/me');
      return response.data;
    },

    logout: async (): Promise<void> => {
      await this.client.post('/auth/logout');
    },

    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
      const response = await this.client.post('/auth/refresh', {
        refresh_token: refreshToken
      });
      return response.data;
    }
  };

  // Dataset endpoints
  datasets = {
    upload: async (
      file: File, 
      metadata: { name: string; description?: string; tags?: string[] },
      onProgress?: (progress: number) => void
    ): Promise<Dataset> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', metadata.name);
      if (metadata.description) {
        formData.append('description', metadata.description);
      }
      if (metadata.tags) {
        formData.append('tags', JSON.stringify(metadata.tags));
      }

      const response = await this.client.post('/datasets/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        }
      });
      return response.data;
    },

    list: async (params: ListParams = {}): Promise<PaginatedResponse<Dataset>> => {
      const response = await this.client.get('/datasets', { params });
      return response.data;
    },

    get: async (id: number): Promise<Dataset> => {
      const response = await this.client.get(`/datasets/${id}`);
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await this.client.delete(`/datasets/${id}`);
    },

    bulkDelete: async (ids: number[]): Promise<void> => {
      await this.client.post('/datasets/bulk-delete', { ids });
    },

    getPreview: async (id: number, page = 1, pageSize = 50): Promise<DataPreview> => {
      const response = await this.client.get(`/datasets/${id}/preview`, {
        params: { page, page_size: pageSize }
      });
      return response.data;
    },

    download: async (id: number): Promise<Blob> => {
      const response = await this.client.get(`/datasets/${id}/download`, {
        responseType: 'blob'
      });
      return response.data;
    },

    getMapping: async (id: number): Promise<DataMapping> => {
      const response = await this.client.get(`/datasets/${id}/mapping`);
      return response.data;
    },

    updateMapping: async (id: number, relationships: any[]): Promise<DataMapping> => {
      const response = await this.client.put(`/datasets/${id}/mapping`, {
        relationships
      });
      return response.data;
    }
  };

  // Admin endpoints
  admin = {
    inviteUser: async (data: InviteRequest): Promise<InviteResponse> => {
      const response = await this.client.post('/admin/invite', data);
      return response.data;
    },

    getTeamMembers: async (params: ListParams = {}): Promise<PaginatedResponse<User>> => {
      const response = await this.client.get('/admin/team', { params });
      return response.data;
    },

    getPendingInvites: async (): Promise<InviteResponse[]> => {
      const response = await this.client.get('/admin/invites');
      return response.data;
    },

    resendInvite: async (inviteId: number): Promise<void> => {
      await this.client.post(`/admin/invites/${inviteId}/resend`);
    },

    cancelInvite: async (inviteId: number): Promise<void> => {
      await this.client.delete(`/admin/invites/${inviteId}`);
    },

    updateUserRole: async (userId: number, role: 'admin' | 'user'): Promise<User> => {
      const response = await this.client.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    },

    deactivateUser: async (userId: number): Promise<void> => {
      await this.client.put(`/admin/users/${userId}/deactivate`);
    },

    getAuditLogs: async (params: ListParams = {}): Promise<PaginatedResponse<AuditLog>> => {
      const response = await this.client.get('/admin/audit-logs', { params });
      return response.data;
    }
  };

  // Organization endpoints
  organization = {
    get: async (): Promise<Organization> => {
      const response = await this.client.get('/organization');
      return response.data;
    },

    update: async (data: Partial<Organization>): Promise<Organization> => {
      const response = await this.client.put('/organization', data);
      return response.data;
    },

    getSettings: async (): Promise<Organization['settings']> => {
      const response = await this.client.get('/organization/settings');
      return response.data;
    },

    updateSettings: async (settings: Partial<Organization['settings']>): Promise<Organization['settings']> => {
      const response = await this.client.put('/organization/settings', settings);
      return response.data;
    }
  };

  // Notifications endpoints
  notifications = {
    list: async (params: ListParams = {}): Promise<PaginatedResponse<NotificationData>> => {
      const response = await this.client.get('/notifications', { params });
      return response.data;
    },

    markAsRead: async (notificationId: string): Promise<void> => {
      await this.client.put(`/notifications/${notificationId}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
      await this.client.put('/notifications/read-all');
    }
  };
}

export const apiService = new ApiService();
export default apiService;