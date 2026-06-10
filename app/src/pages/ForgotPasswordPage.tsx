import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, ArrowRight, Loader2, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Password reset link sent to your email');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50/50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-medium text-2xl text-brand-black">BudgetWise</span>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-display text-brand-black mb-2">
            {isSubmitted ? 'Check Your Email' : 'Forgot Password?'}
          </h1>
          <p className="text-brand-muted">
            {isSubmitted
              ? 'We have sent a password reset link to your email'
              : 'Enter your email and we will send you a reset link'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-card">
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-brand-green" />
              </div>
              <p className="text-sm text-brand-muted">
                If an account exists with <strong className="text-brand-black">{email}</strong>, 
                you will receive a password reset link shortly.
              </p>
              <Link to="/login" className="btn-primary inline-flex">
                Back to Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-black placeholder:text-brand-placeholder focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full justify-center py-3.5 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {!isSubmitted && (
            <div className="mt-6 text-center">
              <p className="text-sm text-brand-muted">
                Remember your password?{' '}
                <Link to="/login" className="text-brand-green font-medium hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
