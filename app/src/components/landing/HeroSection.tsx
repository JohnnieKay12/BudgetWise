import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, TrendingUp, PieChart, Wallet, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      } as any,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-br from-brand-green/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sage-100/50 to-transparent rounded-full blur-2xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container-default relative z-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green/10 text-brand-green text-sm font-medium">
                <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
                Smart Expense Tracking for Nigerians
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-display-xl font-display text-brand-black mb-6 leading-tight"
            >
              Take Control of Your{' '}
              <span className="text-gradient">Finances</span> with BudgetWise
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-lg lg:text-body-lg text-brand-muted mb-8 leading-relaxed max-w-xl"
            >
              Track expenses, manage budgets, achieve savings goals, and get AI-powered 
              financial insights — all in one beautiful dashboard designed for your money journey.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary text-base px-8 py-4"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/register')}
                    className="btn-primary text-base px-8 py-4"
                  >
                    Start Tracking Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      const el = document.querySelector('#analytics');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-secondary text-base px-8 py-4"
                  >
                    <Play className="w-5 h-5" />
                    See How It Works
                  </button>
                </>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-8"
            >
              {[
                { value: '50K+', label: 'Active Users' },
                { value: '₦2B+', label: 'Expenses Tracked' },
                { value: '4.9', label: 'App Store Rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl lg:text-3xl font-display font-semibold text-brand-black">
                    {stat.value}
                  </div>
                  <div className="text-sm text-brand-muted">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main Dashboard Card */}
            <div className="relative glass-card-strong p-6 lg:p-8">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-muted">Total Balance</p>
                    <p className="text-xl font-display font-semibold text-brand-black">₦485,250.00</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-green/10 rounded-full">
                  <TrendingUp className="w-4 h-4 text-brand-green" />
                  <span className="text-sm font-medium text-brand-green">+12.5%</span>
                </div>
              </div>

              {/* Mini Chart */}
              <div className="bg-sage-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-brand-black">Monthly Spending</span>
                  <span className="text-xs text-brand-muted">This Month</span>
                </div>
                <div className="flex items-end gap-2 h-24">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-brand-green/20 hover:bg-brand-green/40 transition-colors"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => (
                    <span key={m} className="text-xs text-brand-muted">{m}</span>
                  ))}
                </div>
              </div>

              {/* Category Cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: PieChart, label: 'Food & Jollof', amount: '₦45,000', pct: 35, color: 'bg-brand-green' },
                  { icon: Shield, label: 'Transport', amount: '₦28,500', pct: 22, color: 'bg-brand-purple' },
                ].map((cat) => (
                  <div key={cat.label} className="bg-white rounded-xl p-4 border border-gray-100">
                    <cat.icon className="w-5 h-5 text-brand-muted mb-2" />
                    <p className="text-xs text-brand-muted">{cat.label}</p>
                    <p className="text-sm font-semibold text-brand-black">{cat.amount}</p>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
                      <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-card border border-gray-100"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-brand-green" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-muted">Saved this month</p>
                    <p className="text-sm font-semibold text-brand-green">+₦25,000</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-card border border-gray-100"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-yellow/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-brand-yellow" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-muted">Budget left</p>
                    <p className="text-sm font-semibold text-brand-black">₦120,000</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
