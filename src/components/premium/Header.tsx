
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="py-8 px-8 md:px-16">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <svg viewBox="0 0 260 260" className="h-12 w-12 text-supernova-gold">
              <path d="M130,10L170,90L250,130L170,170L130,250L90,170L10,130L90,90L130,10Z" fill="currentColor"/>
            </svg>
          </div>
          <Button 
            variant="outline" 
            className="border-supernova-gold/30 text-supernova-gold hover:bg-supernova-gold/10"
            onClick={() => navigate('/')}
          >
            View Original
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
