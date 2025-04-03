
import React from 'react';
import Logo from '@/components/Logo';
import NewsletterSignup from '@/components/NewsletterSignup';
import Testimonial from '@/components/Testimonial';
import FeatureCard from '@/components/FeatureCard';
import StarSparkle from '@/components/StarSparkle';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-wealth-gradient text-white relative">
      {/* Background stars */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <StarSparkle
            key={i}
            className="absolute text-white opacity-20 w-2 h-2 animate-pulse-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 7}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="py-6 px-4 md:px-8">
        <div className="container mx-auto flex justify-center">
          <Logo className="text-white text-center" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12 md:gap-8 items-center">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display text-wealth-gradient leading-tight">
                Supercharge Your Financial Future
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl">
                Join the exclusive WealthSuperNova newsletter for cutting-edge investment insights, wealth-building strategies, and financial opportunities most people will never discover.
              </p>
              <div className="hidden md:block">
                <NewsletterSignup className="max-w-md" />
              </div>
            </div>
            <div className="w-full md:w-2/5 relative">
              <div className="absolute -top-6 -left-6 w-full h-full bg-supernova-gold/10 rounded-lg"></div>
              <div className="relative z-10 bg-white/5 backdrop-blur-md p-8 rounded-lg border border-supernova-gold/20">
                <h2 className="text-2xl font-bold mb-6 text-center text-supernova-gold">What You'll Get</h2>
                <ul className="space-y-4">
                  {[
                    "Weekly exclusive financial insights",
                    "Premium stock market analysis",
                    "Early access to investment opportunities",
                    "Wealth-building strategies",
                    "Expert financial advice you won't find elsewhere"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1 text-supernova-gold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 md:hidden">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-display">
            Why Join <span className="text-supernova-gold">WealthSuperNova?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<TrendIcon className="w-6 h-6 text-supernova-gold" />}
              title="Market Trends"
              description="Stay ahead of market trends with expert analysis and predictions that help you make informed decisions."
            />
            <FeatureCard
              icon={<InsightIcon className="w-6 h-6 text-supernova-gold" />}
              title="Exclusive Insights"
              description="Access insider knowledge and perspectives from financial experts with decades of experience."
            />
            <FeatureCard
              icon={<StrategyIcon className="w-6 h-6 text-supernova-gold" />}
              title="Wealth Strategies"
              description="Learn proven wealth-building strategies tailored to different investment goals and risk tolerances."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-display">
            What Our Subscribers <span className="text-supernova-gold">Say</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Testimonial
              quote="WealthSuperNova has completely transformed my investment approach. The insights I've gained have helped me grow my portfolio by 32% in just 6 months."
              author="Michael S."
              position="Retail Investor"
            />
            <Testimonial
              quote="I've subscribed to many financial newsletters, but WealthSuperNova is in a league of its own. The quality of analysis and actionable advice is unmatched."
              author="Jennifer K."
              position="Financial Advisor"
            />
            <Testimonial
              quote="The team at WealthSuperNova spotted three major market shifts before mainstream media. Their insights saved my retirement portfolio during the last downturn."
              author="Robert T."
              position="Retired Professional"
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">
              Ready to <span className="text-supernova-gold">Transform</span> Your Financial Future?
            </h2>
            <p className="text-xl text-white/80 mb-8 mx-auto max-w-2xl">
              Join thousands of smart investors who receive our premium financial insights every week. It's free, and you can unsubscribe anytime.
            </p>
            <NewsletterSignup className="max-w-md mx-auto" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo className="text-white mb-4 md:mb-0" withStars={false} />
            <div className="text-white/60 text-sm">
              © {new Date().getFullYear()} WealthSuperNova. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
};

// Custom icons
const TrendIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const InsightIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h5" />
    <path d="M17 12h5" />
    <path d="M12 2v5" />
    <path d="M12 17v5" />
    <circle cx="12" cy="12" r="7" />
  </svg>
);

const StrategyIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a9 9 0 0 0 0 18c.19 0 .38 0 .56-.02" />
    <path d="M8 8.5v1" />
    <path d="M12 16v1" />
    <path d="M8 15v1" />
    <path d="M16 12.5h-5.5a1 1 0 0 0-.5.8V15l5 1" />
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M21 7V5a2 2 0 0 0-2-2h-2" />
    <path d="M3 17v2a2 2 0 0 0 2 2h2" />
    <path d="M18 21h3v-3" />
    <path d="M21 14.5V18h-3.5" />
    <path d="M21 18l-7-7" />
  </svg>
);

export default Index;
