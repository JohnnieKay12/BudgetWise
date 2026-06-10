import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';

// Landing Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
import PaymentFailedPage from '@/pages/PaymentFailedPage';
import SubscriptionExpiredPage from '@/pages/SubscriptionExpiredPage';
import RenewSubscriptionPage from '@/pages/RenewSubscriptionPage';

// Dashboard Pages
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ExpensesPage from '@/pages/dashboard/ExpensesPage';
import BudgetsPage from '@/pages/dashboard/BudgetsPage';
import SavingsPage from '@/pages/dashboard/SavingsPage';
import RemindersPage from '@/pages/dashboard/RemindersPage';
import NotificationsPage from '@/pages/dashboard/NotificationsPage';
// import Insights from '@/pages/dashboard/Insights';
// import Challenges from '@/pages/dashboard/Challenges';
// import SettingsPage from '@/pages/dashboard/SettingsPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';
import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    checkSubscription 
  } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-muted font-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    user?.subscriptionStatus === 'expired'
  ){
    return (
      <Navigate
        to="/subscription-expired"
        replace
      />
    );
  }
  
  if (
    user?.subscriptionStatus === 'pending'
  ) {
    return (
      <Navigate
        to="/renew-subscription"
        replace
      />
    );
  }

  if (!checkSubscription()) {
    return (
      <Navigate 
        to="/subscription-expired" 
        replace 
      />
    );
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-muted font-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/payment-failed" element={<PaymentFailedPage />} />
        <Route path="/subscription-expired" element={<SubscriptionExpiredPage />} />
        <Route path="/renew-subscription" element={<RenewSubscriptionPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="savings" element={<SavingsPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          {/* <Route path="insights" element={<Insights />} /> */}
          {/* <Route path="challenges" element={<Challenges />} /> */}
          {/* <Route path="settings" element={<SettingsPage />} /> */}
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const { user } = useAuth();

  useEffect(() => {
    if (
      user?.settings?.theme === 'dark'
    ) {
      document.documentElement.classList.add(
        'dark'
      );
    } else {
      document.documentElement.classList.remove(
        'dark'
      );
    }
  }, [user]);
  return (
      <>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </>
  );
}

export default App;
