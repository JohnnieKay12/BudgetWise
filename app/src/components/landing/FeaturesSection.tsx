import { motion } from 'framer-motion';
import {
  Receipt,
  Target,
  Bell,
  TrendingUp,
  Mic,
  Brain,
  Gamepad2,
  MessageCircle,
  Shield,
} from 'lucide-react';

const features = [
  {
    icon: Receipt,
    title: 'Smart Expense Tracking',
    description: 'Log every naira you spend with categories tailored for Nigerian life — from Bolt rides to NEPA bills, generator fuel to church offerings.',
  },
  {
    icon: Target,
    title: 'Budget Management',
    description: 'Set monthly budgets for different categories and get real-time alerts when you are approaching your limits.',
  },
  {
    icon: TrendingUp,
    title: 'Savings Goals',
    description: 'Create savings targets, track your progress with beautiful visual indicators, and watch your money grow.',
  },
  {
    icon: Mic,
    title: 'Voice Expense Entry',
    description: 'Too busy to type? Just speak your expense details and our voice recognition will log it automatically.',
  },
  {
    icon: Brain,
    title: 'AI Financial Insights',
    description: 'Get personalized spending analysis and smart recommendations to help you save more and spend wisely.',
  },
  {
    icon: Gamepad2,
    title: 'Soft Life Score',
    description: 'Gamify your financial habits with a score that rewards budgeting discipline, consistent savings, and smart spending.',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss a bill payment or savings deposit with customizable reminders for all your financial commitments.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Export',
    description: 'Export your expense reports directly to WhatsApp to share with family, friends, or your accountability partner.',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your financial data is protected with enterprise-level encryption. We never store your bank credentials.',
  },
];

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      } as any,
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section id="features" className="section-padding bg-white">
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
            Features
          </span>
          <h2 className="text-3xl lg:text-display-lg font-display text-brand-black mb-4">
            Everything You Need to<br className="hidden lg:block" /> Master Your Money
          </h2>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            From tracking daily expenses to setting ambitious savings goals, 
            BudgetWise gives you all the tools to take control of your finances.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group p-6 lg:p-8 rounded-2xl border border-gray-100 bg-white hover:border-brand-green/20 hover:shadow-card transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center mb-5 group-hover:bg-brand-green/20 transition-colors">
                <feature.icon className="w-6 h-6 text-brand-green" />
              </div>
              <h4 className="text-lg font-display font-medium text-brand-black mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-brand-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
