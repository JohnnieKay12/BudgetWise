import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Chioma Okonkwo',
    role: 'Small Business Owner',
    location: 'Lagos',
    content: 'BudgetWise completely changed how I manage my business expenses. The Nigerian categories like POS charges and generator fuel make it so relevant. I have saved over ₦500,000 in just 3 months!',
    rating: 5,
    avatar: 'CO',
    color: 'bg-brand-green',
  },
  {
    name: 'Emmanuel Adeyemi',
    role: 'Software Developer',
    location: 'Abuja',
    content: 'The AI insights are incredible. It spotted that I was overspending on Bolt and suggested I take the bus for short distances. My Soft Life Score went from 45 to 82 in two months!',
    rating: 5,
    avatar: 'EA',
    color: 'bg-brand-purple',
  },
  {
    name: 'Fatima Ibrahim',
    role: 'Graduate Student',
    location: 'Ibadan',
    content: 'As a student with limited income, BudgetWise helps me stretch every naira. The savings challenges are fun, and I love sharing my progress on WhatsApp with my friends.',
    rating: 5,
    avatar: 'FI',
    color: 'bg-brand-yellow',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-white">
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
            Testimonials
          </span>
          <h2 className="text-3xl lg:text-display-lg font-display text-brand-black mb-4">
            Loved by Thousands of <br className="hidden lg:block" />Nigerians
          </h2>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            See what our users have to say about their journey to financial freedom with BudgetWise.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6 lg:p-8 relative"
            >
              <Quote className="w-8 h-8 text-brand-green/20 absolute top-6 right-6" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
                ))}
              </div>

              {/* Content */}
              <p className="text-brand-body text-sm leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className={`w-10 h-10 rounded-full ${testimonial.color} flex items-center justify-center`}>
                  <span className="text-white text-sm font-medium">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-black">{testimonial.name}</p>
                  <p className="text-xs text-brand-muted">
                    {testimonial.role} &middot; {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
