import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const currentPath = window.location.pathname;

    // DON'T FORCE LOGOUT ON AUTH CHECK
    if (
      error.response?.status === 401 &&
      currentPath !== '/login'
    ) {
      console.warn('Unauthorized request');
    }

    // SUBSCRIPTION EXPIRED
    if (
      error.response?.status === 403 &&
      error.response?.data?.subscriptionStatus
    ) {
      window.location.href =
        '/subscription-expired';
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },
  me: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },
};

// Payment APIs
export const paymentAPI = {
  initialize: async (email: string): Promise<{ authorization_url: string; reference: string }> => {
    const response = await api.post('/payments/initialize', { email, amount: 2000 });
    return response.data;
  },
  verify: async (reference: string): Promise<{ success: boolean; user: User; token: string }> => {
    const response = await api.post(`/payments/verify/${reference}`);
    return response.data;
  },
  renew: async (): Promise<{ authorization_url: string; reference: string }> => {
    const response = await api.post('/payments/renew', { amount: 2000 });
    return response.data;
  },
  getHistory: async (): Promise<any[]> => {
    const response = await api.get('/payments/history');
    return response.data;
  },
};

// Expense APIs
export const expenseAPI = {
  getAll: async (params?: { month?: string; category?: string }): Promise<any[]> => {
    const response = await api.get('/expenses', { params });
    return response.data;
  },
  create: async (data: any): Promise<any> => {
    const response = await api.post('/expenses', data);
    return response.data;
  },
  update: async (id: string, data: any): Promise<any> => {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },
};

// Budget APIs
export const budgetAPI = {
  getAll: async (
    month?: string
  ): Promise<any[]> => {
    const response = await api.get(
      '/budgets',
      {
        params: { month },
      }
    );

    return response.data;
  },

  create: async (
    data: any
  ): Promise<any> => {
    const response = await api.post(
      '/budgets',
      data
    );

    return response.data;
  },

  update: async (
    id: string,
    data: any
  ): Promise<any> => {
    const response = await api.put(
      `/budgets/${id}`,
      data
    );

    return response.data;
  },
};

// Savings APIs
export const savingsAPI = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get('/savings');
    return response.data;
  },
  create: async (data: any): Promise<any> => {
    const response = await api.post('/savings', data);
    return response.data;
  },
  update: async (id: string, data: any): Promise<any> => {
    const response = await api.put(`/savings/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/savings/${id}`);
  },
};

// Reminder APIs
export const reminderAPI = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get('/reminders');
    return response.data;
  },
  create: async (data: any): Promise<any> => {
    const response = await api.post('/reminders', data);
    return response.data;
  },
  update: async (id: string, data: any): Promise<any> => {
    const response = await api.put(`/reminders/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/reminders/${id}`);
  },
};

// Notification APIs
export const notificationAPI = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get('/notifications');
    return response.data;
  },
  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },
  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  },
};

// insightsAPI
export const insightsAPI = {
  getAll: async () => {
    const response = await api.get('/insights');
    return response.data;
  },

  generate: async () => {
    const response = await api.post('/insights/generate');
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.patch(`/insights/${id}/read`);
    return response.data;
  },
};

// challengesAPI
export const challengesAPI = {
  getAll: async () => {
    const response = await api.get('/challenges');
    return response.data;
  },
};

// User APIs
export const userAPI = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (data: any): Promise<User> => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  getSettings: async () => {
    const response =
      await api.get(
        '/users/settings'
      );

    return response.data;
  },

  updateSettings: async (
    data: any
  ) => {
    const response =
      await api.put(
        '/users/settings',
        data
      );

    return response.data;
  },

  changePassword: async (
    data: {
      currentPassword: string;
      newPassword: string;
    }
  ) => {
    const response =
      await api.put(
        '/users/change-password',
        data
      );

    return response.data;
  },

};

// Dashboard APIs
export const dashboardAPI = {
  getStats: async (
    month?: string
  ): Promise<any> => {
    const response = await api.get(
      '/dashboard/stats',
      {
        params: { month },
      }
    );

    return response.data;
  },

  getInsights: async (
    month?: string
  ): Promise<any[]> => {
    const response = await api.get(
      '/dashboard/insights',
      {
        params: { month },
      }
    );

    return response.data;
  },

  getSoftLifeScore: async (
    month?: string
  ): Promise<any> => {
    const response = await api.get(
      '/dashboard/soft-life-score',
      {
        params: { month },
      }
    );

    return response.data;
  },

  getChallenges: async (): Promise<any[]> => {
    const response = await api.get(
      '/dashboard/challenges'
    );

    return response.data;
  },
};

export default api;
