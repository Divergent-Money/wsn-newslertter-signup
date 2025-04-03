
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  withStars?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, withStars = true }) => {
  return (
    <div className={cn("relative inline-block", className)}>
      <h1 className="text-3xl md:text-4xl font-bold font-display">
        WealthSuperNova
      </h1>
      
      {withStars && (
        <>
          <div className="absolute -top-4 -right-4 w-4 h-4 animate-pulse-slow">
            <Star className="w-full h-full text-supernova-gold" />
          </div>
          <div className="absolute top-2 -left-3 w-3 h-3 animate-pulse-slow" style={{ animationDelay: '1s' }}>
            <Star className="w-full h-full text-supernova-gold" />
          </div>
          <div className="absolute -bottom-2 right-8 w-3 h-3 animate-pulse-slow" style={{ animationDelay: '2s' }}>
            <Star className="w-full h-full text-supernova-gold" />
          </div>
        </>
      )}
    </div>
  );
};

const Star: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </svg>
  );
};

export default Logo;
