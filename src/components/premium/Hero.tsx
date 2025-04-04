
import React from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="py-16 md:py-24 px-8 md:px-16">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center">
          <h1 className="font-display font-bold text-5xl md:text-7xl max-w-4xl text-center mb-6">
            <span className="bg-gradient-to-r from-white to-supernova-gold bg-clip-text text-transparent">
              Exclusive Financial Intelligence
            </span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl text-center text-white/70 mb-12">
            Join the world's most sophisticated investors receiving bi-weekly insights from WealthSuperNova's elite financial analysts.
          </p>
          <Button 
            className="text-lg px-8 py-6 h-auto bg-supernova-gold hover:bg-supernova-gold/90 text-black font-bold"
            onClick={() => document.getElementById('request-access')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Request Private Access
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
