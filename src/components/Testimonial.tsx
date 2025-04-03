
import React from 'react';
import { cn } from "@/lib/utils";

interface TestimonialProps {
  quote: string;
  author: string;
  position?: string;
  className?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, position, className }) => {
  return (
    <div className={cn("flex flex-col p-6 rounded-lg bg-white/5 backdrop-blur-sm", className)}>
      <div className="mb-4">
        <svg className="w-8 h-8 text-supernova-gold opacity-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-white/90 mb-4">{quote}</p>
      <div className="mt-auto">
        <p className="font-bold text-white">{author}</p>
        {position && <p className="text-sm text-supernova-gold">{position}</p>}
      </div>
    </div>
  );
};

export default Testimonial;
