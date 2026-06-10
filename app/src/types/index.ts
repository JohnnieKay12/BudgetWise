export interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;

  currency: string;

  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    budgetAlerts: boolean;
    savingsReminders: boolean;
    theme: 'light' | 'dark';
    language: 'en' | 'yo' | 'ig' | 'ha';
  };

  subscriptionStatus:
    | 'active'
    | 'expired'
    | 'pending'
    | 'cancelled';

  subscriptionPlan: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  lastPaymentDate: string;
  createdAt: string;
}


export interface Expense {
  _id: string;
  user: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  note?: string;
  createdAt: string;
}

export interface Budget {
  _id: string;
  user: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface SavingsGoal {
  _id: string;
  user: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export interface Reminder {
  _id: string;
  user: string;
  title: string;
  description?: string;
  dueDate: string;
  category: string;
  amount?: number;
  isActive: boolean;
  createdAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'subscription';
  isRead: boolean;
  createdAt: string;
}

export interface Payment {
  _id: string;
  user: string;
  reference: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  paymentMethod: string;
  transactionDate: string;
  createdAt: string;
}

export interface FinancialInsight {
  _id: string;
  user: string;
  title: string;
  description: string;
  category: string;
  impact: 'positive' | 'negative' | 'neutral';
  createdAt: string;
}

export interface SavingsChallenge {
  _id: string;
  name: string;
  description: string;
  targetAmount: number;
  participants: number;
  startDate: string;
  endDate: string;
  category: string;
  status: 'active' | 'completed';
  createdAt: string;
}

export interface DashboardStats {
  totalExpenses: number;
  monthlySpending: number;
  budgetRemaining: number;
  savingsProgress: number;
  expenseChange: number;
  spendingChange: number;
  budgetChange: number;
  savingsChange: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  amount: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
}
