
import React from 'react';
import { Card } from "@/components/ui/card";
import { FeatureCard } from '@/components/FeatureCard';

const Features = () => {
  const features = [
    {
      title: "Precision Market Analysis",
      description: "Our team of analysts leverages proprietary data models that consistently outperform traditional market indicators.",
      icon: (
        <svg className="w-6 h-6 text-supernova-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    {
      title: "Exclusive Investment Opportunities",
      description: "Gain early access to investment opportunities typically reserved for institutional investors and family offices.",
      icon: (
        <svg className="w-6 h-6 text-supernova-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
        </svg>
      )
    },
    {
      title: "Wealth Preservation Strategies",
      description: "Discover sophisticated strategies for wealth preservation and growth across market cycles and geopolitical shifts.",
      icon: (
        <svg className="w-6 h-6 text-supernova-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 px-8 md:px-16">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center mb-16">
          <div className="w-24 h-[1px] bg-supernova-gold/30 mb-8"></div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center">
            The WealthSuperNova Advantage
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
              <div className="h-12 w-12 rounded-full bg-supernova-gold/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
