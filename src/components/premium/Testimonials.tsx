
import React from 'react';
import { Card } from "@/components/ui/card";
import Testimonial from '@/components/Testimonial';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "The caliber of analysis in WealthSuperNova is unparalleled. Their insights helped me navigate the recent market turbulence with confidence and precision.",
      author: "Jonathan R.",
      position: "Managing Director, Private Equity"
    },
    {
      quote: "As someone who manages significant family assets, I find the depth and quality of WealthSuperNova's research to be exceptional. Their contrarian perspectives have proven invaluable.",
      author: "Elizabeth M.",
      position: "Family Office Principal"
    }
  ];

  return (
    <section className="py-16 px-8 md:px-16 bg-white/5">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center mb-16">
          <div className="w-24 h-[1px] bg-supernova-gold/30 mb-8"></div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center">
            Client Testimonials
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-supernova-navy/50 backdrop-blur-sm border-white/10 p-8">
              <svg className="w-12 h-12 text-supernova-gold/30 mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-white/80 text-lg mb-8">{testimonial.quote}</p>
              <div>
                <p className="font-bold text-white">{testimonial.author}</p>
                <p className="text-supernova-gold text-sm">{testimonial.position}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
