import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is BudgetWise and how does it work?',
    answer: 'BudgetWise is a smart expense tracking and budgeting platform designed for Nigerians. It helps you track your daily spending, set budgets for different categories, create savings goals, and get AI-powered financial insights. Simply sign up, subscribe for ₦2,000/month, and start logging your expenses to gain control over your finances.',
  },
  {
    question: 'Why do I need to pay ₦2,000 monthly?',
    answer: 'BudgetWise operates on a SaaS subscription model, similar to Netflix or Spotify. The ₦2,000 monthly fee gives you access to all premium features including the full dashboard, advanced analytics, AI insights, voice expense entry, savings challenges, and more. This helps us maintain the platform and continuously improve your experience.',
  },
  {
    question: 'What happens if my subscription expires?',
    answer: 'When your subscription expires, you will be redirected to the renewal page. You will not be able to access the dashboard, add expenses, view analytics, or use any premium features until you renew your subscription with another ₦2,000 payment.',
  },
  {
    question: 'Is my financial data secure?',
    answer: 'Absolutely. BudgetWise uses bank-grade encryption to protect your data. We never store your bank credentials or card details. All your information is securely stored in our database with proper access controls. We only track the expenses you manually enter into the app.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. However, cancellation takes effect at the end of your current billing period. You will continue to have access until your subscription end date, after which you will need to renew to regain access.',
  },
  {
    question: 'What Nigerian expense categories are available?',
    answer: 'We have categories tailored for Nigerian life including: Transport, Bolt/Uber, Food & Jollof, Generator Fuel, POS Charges, Airtime, Data Subscription, Family Support, Church Offering, Rent, NEPA Bills, and many more. You can also create custom categories.',
  },
  {
    question: 'How does the voice expense entry work?',
    answer: 'Our voice expense entry uses your device\'s speech recognition. Simply tap the microphone icon, speak your expense details like "I spent 3,500 naira on lunch at Iya Basira", and the app will automatically extract the amount and description for you.',
  },
  {
    question: 'What is the Soft Life Score?',
    answer: 'The Soft Life Score is a gamified scoring system (0-100) that measures your financial health based on your budgeting discipline, savings consistency, expense tracking frequency, and category diversification. The higher your score, the better your financial habits!',
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-gray-100 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-base lg:text-lg font-medium text-brand-black pr-4 group-hover:text-brand-green transition-colors">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-brand-muted" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-brand-muted leading-relaxed text-sm lg:text-base">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="section-padding bg-white">
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
            FAQ
          </span>
          <h2 className="text-3xl lg:text-display-lg font-display text-brand-black mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            Got questions? We have got answers. If you do not find what you are looking for, 
            feel free to reach out to our support team.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
