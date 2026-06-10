import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Free Preview',
    description: 'Explore the landing page and learn about BudgetWise. No account required.',
    price: 'Free',
    period: '',
    cta: 'View Landing Page',
    ctaAction: 'scroll',
    highlighted: false,
    features: [
      { text: 'View landing page', included: true },
      { text: 'Learn about features', included: true },
      { text: 'See pricing details', included: true },
      { text: 'Read FAQ section', included: true },
      { text: 'Access dashboard', included: false },
      { text: 'Track expenses', included: false },
      { text: 'View analytics', included: false },
      { text: 'AI insights', included: false },
      { text: 'Savings goals', included: false },
      { text: 'Voice entry', included: false },
    ],
  },
  {
    name: 'Premium Access',
    description: 'Full access to all features, analytics, and AI-powered insights.',
    price: '₦2,000',
    period: '/month',
    cta: 'Get Started',
    ctaAction: 'register',
    highlighted: true,
    features: [
      { text: 'Full dashboard access', included: true },
      { text: 'Unlimited expense tracking', included: true },
      { text: 'Advanced analytics & charts', included: true },
      { text: 'AI financial insights', included: true },
      { text: 'Budget management', included: true },
      { text: 'Savings goals & tracking', included: true },
      { text: 'Smart reminders', included: true },
      { text: 'Voice expense entry', included: true },
      { text: 'Soft Life Score', included: true },
      { text: 'Savings challenges', included: true },
      { text: 'WhatsApp export', included: true },
      { text: 'All Nigerian categories', included: true },
    ],
  },
];

export default function PricingSection() {
  const navigate = useNavigate();

  const handleCTA = (action: string) => {
    if (action === 'register') {
      navigate('/register');
    } else if (action === 'scroll') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="section-padding bg-sage-50/50">
      <div className="container-default">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-3xl lg:text-display-lg font-display text-brand-black mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            Choose the plan that works for you. Upgrade to Premium for just ₦2,000/month 
            and unlock the full power of BudgetWise.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-brand-green text-white shadow-xl scale-[1.02]'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-yellow text-brand-black text-xs font-semibold rounded-full">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-2xl font-display font-medium mb-2 ${plan.highlighted ? 'text-white' : 'text-brand-black'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.highlighted ? 'text-white/80' : 'text-brand-muted'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className={`text-4xl font-display font-semibold ${plan.highlighted ? 'text-white' : 'text-brand-black'}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={`text-sm ml-1 ${plan.highlighted ? 'text-white/70' : 'text-brand-muted'}`}>
                    {plan.period}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleCTA(plan.ctaAction)}
                className={`w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 mb-8 ${
                  plan.highlighted
                    ? 'bg-white text-brand-green hover:bg-gray-100'
                    : 'bg-brand-green text-white hover:bg-brand-green-dark'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature.text} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.highlighted ? 'bg-white/20' : 'bg-brand-green/10'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlighted ? 'text-white' : 'text-brand-green'}`} />
                      </div>
                    ) : (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.highlighted ? 'bg-white/10' : 'bg-gray-100'
                      }`}>
                        <X className={`w-3 h-3 ${plan.highlighted ? 'text-white/50' : 'text-gray-400'}`} />
                      </div>
                    )}
                    <span className={`text-sm ${
                      feature.included
                        ? plan.highlighted ? 'text-white' : 'text-brand-body'
                        : plan.highlighted ? 'text-white/50' : 'text-brand-muted'
                    }`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
