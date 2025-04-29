
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from '@/components/Logo';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="py-8 px-8 md:px-16">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <Logo size="sm" color="text-white" />
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
