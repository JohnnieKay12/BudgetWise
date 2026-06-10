import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { paymentAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  const { refreshUser } = useAuth();

  const [isVerifying, setIsVerifying] =
    useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params =
          new URLSearchParams(
            window.location.search
          );

          console.log(
            'CURRENT URL:',
            window.location.href
          );

        const reference =
          params.get('reference');

          if (!reference) {
            console.error(
              'No payment reference found in URL'
            );
          
            setTimeout(() => {
              navigate('/dashboard');
            }, 3000);
          
            return;
          }

        const response = await paymentAPI.verify(reference);

        if (response.token) {
          localStorage.setItem(
            'token',
            response.token
          );

          try {
            await refreshUser();
          } catch (err) {
            console.error('Refresh user failed', err);
          }
        }

        toast.success(
          'Subscription activated successfully'
        );

        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (error) {
        toast.error(
          'Payment verification failed'
        );

        navigate(
          '/subscription-expired'
        );
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50/50 px-4">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            damping: 15,
            delay: 0.2,
          }}
          className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-brand-green" />
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.4,
          }}
        >
          <h1 className="text-3xl font-display text-brand-black mb-3">
            Payment Successful!
          </h1>

          <p className="text-brand-muted mb-2">
            Welcome to BudgetWise Premium!
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 rounded-full text-brand-green text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />

            {isVerifying
              ? 'Verifying payment...'
              : 'Redirecting to dashboard...'}
          </div>

          <div className="space-y-3">
            <button
              onClick={() =>
                navigate('/dashboard')
              }
              className="btn-primary inline-flex"
            >
              Go to Dashboard

              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}