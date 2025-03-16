import React from 'react';
import { HeroSection } from '@/components/Landing/HeroSection';
import { HowItWorksSection } from '@/components/Landing/HowItWorksSection';
import { FAQSection } from '@/components/Landing/FAQSection';
import { NewsletterSection } from '@/components/Landing/NewsletterSection';
import { Footer } from '@/components/Footer/Footer';
import FeaturesSection from '@/components/Landing/FeaturesSection';
import { YieldStrategySection } from '@/components/Landing/YieldStrategySection';
import { CTASection } from '@/components/Landing/CTASection';

export const HomePage: React.FC = () => {

  return (
    <div className="w-full">

      <HeroSection />
      <FeaturesSection />
      <YieldStrategySection />
      <HowItWorksSection />
      <FAQSection />
      <CTASection />
      <NewsletterSection />

      <Footer />
    </div>
  );
};

export default HomePage;