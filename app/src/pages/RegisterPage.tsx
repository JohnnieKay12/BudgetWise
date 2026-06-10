import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wallet,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle,
  CreditCard,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';
import { paymentAPI } from '@/services/api';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function RegisterPage() {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const paystackLoaded = useRef(false);

  // Load Paystack Script
  useEffect(() => {
    if (!paystackLoaded.current) {
      const script = document.createElement('script');

      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;

      script.onload = () => {
        console.log('Paystack loaded');
        paystackLoaded.current = true;
      };

      script.onerror = () => {
        console.log('Paystack failed to load');
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  // Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('FORM SUBMITTED');
    console.log(formData);

    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setStep('payment');
  };

  // Payment Handler
  // Payment Handler
const handlePayment = async () => {
  console.log('PAY BUTTON CLICKED');

  setIsLoading(true);

  try {
    // CHECK PAYSTACK
    if (
      !window.PaystackPop ||
      typeof window.PaystackPop.setup !== 'function'
    ) {
      toast.error('Paystack failed to load');

      setIsLoading(false);

      return;
    }

    const paymentReference = `BW_${Date.now()}`;

    // NORMAL FUNCTION
    function paymentCallback(response: any) {
      (async () => {
        try {
          console.log('PAYMENT SUCCESS');
          console.log(response);

          // REGISTER USER
          const registerResponse = await fetch(
            'http://localhost:5000/api/auth/register',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            }
          );

          const registerData =
            await registerResponse.json();

          if (!registerData.success) {
            toast.error(
              registerData.message ||
                'Registration failed'
            );

            setIsLoading(false);

            return;
          }

          // VERIFY PAYMENT
          const result =
            await paymentAPI.verify(
              response.reference
            );

          console.log(result);

          if (result.success) {
            localStorage.setItem(
              'token',
              result.token
            );

            toast.success(
              'Payment successful'
            );

            window.location.href =
              '/payment-success';
          } else {
            toast.error(
              'Payment verification failed'
            );

            window.location.href =
              '/payment-failed';
          }
        } catch (error: any) {
          console.log(error);

          toast.error(
            error?.response?.data?.message ||
              'Backend verification failed'
          );
        } finally {
          setIsLoading(false);
        }
      })();
    }

    // NORMAL FUNCTION
    function paymentClose() {
      console.log('PAYMENT CLOSED');

      setIsLoading(false);

      toast.info('Payment cancelled');
    }

    const handler = window.PaystackPop.setup({
      key:
        import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,

      email: formData.email,

      amount: 2000 * 100,

      currency: 'NGN',

      ref: paymentReference,

      metadata: {
        custom_fields: [
          {
            display_name: 'Full Name',
            variable_name: 'full_name',
            value: formData.fullName,
          },
        ],
      },

      callback: paymentCallback,

      onClose: paymentClose,
    });

    handler.openIframe();
  } catch (error: any) {
    console.log(error);

    toast.error(
      error.message || 'Payment failed'
    );

    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50/50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>

            <span className="font-display font-medium text-2xl text-brand-black">
              BudgetWise
            </span>
          </Link>

          <h1 className="text-2xl lg:text-3xl font-display text-brand-black mb-2">
            {step === 'form'
              ? 'Create Your Account'
              : 'Complete Payment'}
          </h1>

          <p className="text-brand-muted">
            {step === 'form'
              ? 'Start your journey to financial freedom'
              : 'Secure payment powered by Paystack'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-brand-green">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'form'
                  ? 'bg-brand-green text-white'
                  : 'bg-brand-green/10 text-brand-green'
              }`}
            >
              {step === 'payment' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                '1'
              )}
            </div>

            <span className="text-sm font-medium">Details</span>
          </div>

          <div className="w-12 h-px bg-gray-200" />

          <div
            className={`flex items-center gap-2 ${
              step === 'payment'
                ? 'text-brand-green'
                : 'text-brand-muted'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'payment'
                  ? 'bg-brand-green text-white'
                  : 'bg-gray-100 text-brand-muted'
              }`}
            >
              2
            </div>

            <span className="text-sm font-medium">Payment</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-card">
          {step === 'form' ? (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fullName: e.target.value,
                    })
                  }
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 pr-12"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full justify-center py-3.5"
              >
                Continue to Payment
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-sage-50 rounded-xl p-5">
                <h4 className="font-medium text-brand-black mb-4">
                  Order Summary
                </h4>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Plan</span>
                    <span>Premium Monthly</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Price</span>
                    <span>₦2,000.00</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Duration</span>
                    <span>30 days</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-brand-green/5 rounded-xl">
                <Shield className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />

                <div>
                  <p className="text-sm font-medium text-brand-black">
                    Secure Payment
                  </p>

                  <p className="text-xs text-brand-muted mt-1">
                    Your payment is processed securely by Paystack.
                  </p>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="btn-primary w-full justify-center py-4 text-base disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay ₦2,000 with Paystack
                  </>
                )}
              </button>

              <button
                onClick={() => setStep('form')}
                className="w-full py-3 text-sm text-brand-muted"
              >
                Go back to edit details
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}