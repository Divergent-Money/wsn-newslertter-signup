
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  withStars?: boolean;
  size?: "sm" | "md" | "lg"; 
  color?: string; // Add color prop for customization
}

const Logo: React.FC<LogoProps> = ({ className, withStars = true, size = "md", color = "text-white" }) => {
  // Determine text size based on the size prop
  const textSizeClasses = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl"
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <h1 className={cn("font-bold font-display", color, textSizeClasses[size])}>
        WealthSuperNova
      </h1>
      
      {withStars && (
        <>
          <div className="absolute -top-4 -right-4 w-4 h-4 animate-pulse-slow">
            <Star className={cn("w-full h-full", color === "text-white" ? "text-supernova-gold" : color)} />
          </div>
          <div className="absolute top-2 -left-3 w-3 h-3 animate-pulse-slow" style={{ animationDelay: '1s' }}>
            <Star className={cn("w-full h-full", color === "text-white" ? "text-supernova-gold" : color)} />
          </div>
          <div className="absolute -bottom-2 right-8 w-3 h-3 animate-pulse-slow" style={{ animationDelay: '2s' }}>
            <Star className={cn("w-full h-full", color === "text-white" ? "text-supernova-gold" : color)} />
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
