
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-12 px-8 md:px-16 border-t border-white/10">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <svg viewBox="0 0 260 260" className="h-10 w-10 text-supernova-gold">
              <path d="M130,10L170,90L250,130L170,170L130,250L90,170L10,130L90,90L130,10Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="text-white/60 text-sm">
            © {new Date().getFullYear()} WealthSuperNova. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
