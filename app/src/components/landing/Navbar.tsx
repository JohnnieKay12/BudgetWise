import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Analytics', href: '#analytics' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container-default flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">B</span>
            </div>
            <span className="font-display font-medium text-xl text-brand-black tracking-tight">
              BudgetWise
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-brand-body hover:text-brand-green transition-colors duration-200 font-body text-sm"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-brand-body hover:text-brand-green transition-colors duration-200 font-medium text-sm"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn-primary text-sm"
            >
              Get Started
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-brand-black" />
            ) : (
              <Menu className="w-6 h-6 text-brand-black" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 h-full w-[300px] bg-white z-50 lg:hidden shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-10">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center">
                      <span className="text-white font-display font-bold text-lg">B</span>
                    </div>
                    <span className="font-display font-medium text-xl">BudgetWise</span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-4 mb-8">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => scrollToSection(link.href)}
                      className="text-left text-lg font-body text-brand-body hover:text-brand-green transition-colors py-2"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                    className="w-full py-3 text-center border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
                    className="btn-primary w-full justify-center"
                  >
                    Get Started
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
