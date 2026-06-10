import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import TrustedBySection from '@/components/landing/TrustedBySection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import AnalyticsSection from '@/components/landing/AnalyticsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <AnalyticsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
