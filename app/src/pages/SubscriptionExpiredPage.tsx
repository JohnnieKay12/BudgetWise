import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { paymentAPI } from '@/services/api';
import { toast } from 'sonner';

export default function SubscriptionExpiredPage() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (user?.subscriptionEndDate) {
      const end = new Date(user.subscriptionEndDate).getTime();
      const now = Date.now();
      if (end > now) {
        const diff = end - now;
        setTimeLeft(Math.floor(diff / 1000));
      }
    }
  }, [user]);

  const handleRenew = async () => {
    setIsLoading(true);
    try {
      const result = await paymentAPI.renew();
      if (result.authorization_url) {
        window.location.href = result.authorization_url;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initialize renewal');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50/50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-card text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertTriangle className="w-8 h-8 text-brand-yellow" />
          </motion.div>

          <h1 className="text-2xl font-display text-brand-black mb-3">
            Subscription Expired
          </h1>
          <p className="text-brand-muted mb-6">
            Your premium access has expired. Renew your subscription to continue 
            tracking expenses and accessing all premium features.
          </p>

          {timeLeft > 0 && (
            <div className="flex items-center justify-center gap-2 mb-6 px-4 py-3 bg-brand-yellow/10 rounded-xl">
              <Clock className="w-4 h-4 text-brand-yellow" />
              <span className="text-sm text-brand-yellow font-medium">
                Grace period: {formatTime(timeLeft)} remaining
              </span>
            </div>
          )}

          <div className="bg-sage-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-brand-muted mb-1">Renewal amount</p>
            {user?.subscriptionEndDate && (
              <p className="text-xs text-brand-muted mt-2">
                Expired on{' '}
                {new Date(
                  user.subscriptionEndDate
                ).toLocaleDateString('en-NG', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
            <p className="text-2xl font-display font-semibold text-brand-green">
              ₦{Number(2000).toLocaleString()}
            </p>
            <p className="text-xs text-brand-muted mt-1">For 30 days of premium access</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRenew}
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3.5 disabled:opacity-70"
            >
              {isLoading ? 'Processing...' : (
                <>
                  Renew Subscription
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <button
              onClick={logout}
              className="w-full py-3 text-sm text-brand-muted hover:text-brand-black transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
