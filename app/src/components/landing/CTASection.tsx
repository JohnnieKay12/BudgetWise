import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CTASection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 lg:py-28 bg-brand-green relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />
        {/* Floating circles */}
        <motion.div
          className="absolute top-10 left-[10%] w-20 h-20 border border-white/10 rounded-full"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-10 right-[15%] w-14 h-14 border border-white/10 rounded-full"
          animate={{ y: [0, 15, 0], rotate: [360, 180, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="container-default relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Start Your Financial Journey Today
          </span>

          <h2 className="text-3xl lg:text-display-lg font-display text-white mb-6 max-w-3xl mx-auto">
            Ready to Take Control of Your Money?
          </h2>

          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of Nigerians who are already tracking their expenses, 
            saving smarter, and building financial freedom with BudgetWise.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 bg-white text-brand-green font-medium rounded-xl px-8 py-4 hover:bg-gray-100 transition-colors text-base shadow-lg"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center gap-2 bg-white text-brand-green font-medium rounded-xl px-8 py-4 hover:bg-gray-100 transition-colors text-base shadow-lg"
                >
                  Get Started — ₦2,000/month
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 bg-transparent text-white font-medium rounded-xl px-8 py-4 border border-white/30 hover:bg-white/10 transition-colors text-base"
                >
                  Already have an account? Log In
                </button>
              </>
            )}
          </div>

          <p className="text-sm text-white/60 mt-6">
            Cancel anytime. No hidden fees. Your data is secure.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
