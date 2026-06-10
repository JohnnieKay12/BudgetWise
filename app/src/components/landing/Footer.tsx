import { Link } from 'react-router-dom';
import { Wallet, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Analytics', href: '#analytics' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Resources: [
    { label: 'Help Center', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'API Docs', href: '#' },
    { label: 'Status', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'GDPR', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-16 pb-8">
      <div className="container-default">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-medium text-xl">BudgetWise</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-xs">
              Your smart money companion. Track expenses, manage budgets, 
              and achieve your savings goals — all in one beautiful dashboard.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-brand-green transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-medium text-sm mb-4 text-white/90">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/50 hover:text-brand-green transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} BudgetWise. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-white/40">Made with love for Nigerians</span>
            <span className="text-sm text-white/40">|</span>
            <span className="text-sm text-white/40">Lagos, Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
