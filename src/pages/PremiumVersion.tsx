
import React from 'react';
import Header from '@/components/premium/Header';
import Hero from '@/components/premium/Hero';
import Features from '@/components/premium/Features';
import TestimonialsSection from '@/components/premium/Testimonials';
import AccessForm from '@/components/premium/AccessForm';
import Footer from '@/components/premium/Footer';

const PremiumVersion = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-supernova-navy to-black text-white">
      <Header />
      <Hero />
      <Features />
      <TestimonialsSection />
      <AccessForm />
      <Footer />
    </div>
  );
};

export default PremiumVersion;
