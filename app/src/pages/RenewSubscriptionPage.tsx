import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Loader2, Sparkles } from 'lucide-react';
import { paymentAPI } from '@/services/api';
import { toast } from 'sonner';

export default function RenewSubscriptionPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRenewal = async () => {
    setIsLoading(true);
  
    try {
      const result =
        await paymentAPI.renew();
  
      if (
        result.authorization_url
      ) {
        window.location.href =
          result.authorization_url;
      } else {
        toast.error(
          'Unable to start payment.'
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        'Renewal failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50/50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-card">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-brand-green" />
            </div>
            <h1 className="text-2xl font-display text-brand-black mb-2">Renew Your Subscription</h1>
            <p className="text-brand-muted text-sm">
              Continue enjoying all premium features by renewing your subscription.
            </p>
          </div>

          <div className="bg-sage-50 rounded-xl p-5 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Plan</span>
                <span className="text-brand-black font-medium">Premium Monthly</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Amount</span>
                <span className="text-brand-black font-medium">₦2,000.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Duration</span>
                <span className="text-brand-black font-medium">30 days</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-medium text-brand-black">Total</span>
                <span className="font-display font-semibold text-brand-green text-lg">₦2,000.00</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-brand-green/5 rounded-xl mb-6">
            <Shield className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-brand-black">Secure Payment</p>
              <p className="text-xs text-brand-muted mt-1">
                Your payment is processed securely by Paystack.
              </p>
            </div>
          </div>

          <button
            onClick={handleRenewal}
            disabled={isLoading}
            className="btn-primary w-full justify-center py-4 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay ₦2,000 & Renew
              </>
            )}
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 mt-3 text-sm text-brand-muted hover:text-brand-black transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
