import { motion } from 'framer-motion';

const companies = [
  'Paystack', 'Flutterwave', 'Kuda Bank', 'Opay', 'Moniepoint', 'PiggyVest',
];

export default function TrustedBySection() {
  return (
    <section className="py-12 bg-sage-50/50 border-y border-gray-100">
      <div className="container-default">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm text-brand-muted mb-8 font-medium uppercase tracking-wider"
        >
          Trusted by thousands of smart savers across Nigeria
        </motion.p>

        <div className="relative overflow-hidden">
          {/* Gradient fades */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-sage-50/50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-sage-50/50 to-transparent z-10" />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center flex-wrap gap-8 lg:gap-16"
          >
            {companies.map((company) => (
              <div
                key={company}
                className="text-xl lg:text-2xl font-display font-semibold text-brand-placeholder/40 hover:text-brand-green/60 transition-colors duration-300 cursor-default select-none"
              >
                {company}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
