import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function PaymentFailedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50/50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 0.2 }}
          className="w-20 h-20 bg-brand-error/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="w-10 h-10 text-brand-error" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl font-display text-brand-black mb-3">Payment Failed</h1>
          <p className="text-brand-muted mb-8">
            We could not process your payment. This could be due to insufficient funds, 
            network issues, or a declined transaction. Please try again.
          </p>

          <div className="space-y-3">
          <button
            onClick={() =>
              navigate('/renew-subscription')
            }
            className="btn-primary w-full justify-center"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <button
            onClick={() =>
              navigate('/subscription-expired')
            }
            className="btn-secondary w-full justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
