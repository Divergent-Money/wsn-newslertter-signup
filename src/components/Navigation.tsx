import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Logo from '@/components/Logo';
import { User, LogOut, Settings, Bookmark, FileText, Menu, X } from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-supernova-navy py-4 px-6 border-b border-supernova-gold/10">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <Link to="/" className="flex items-center">
          <Logo size="md" color="text-white" />
        </Link>
        
        <div className="block md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/newsletters" className="text-white hover:text-supernova-gold transition-colors">
            Newsletters
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-supernova-gold/20 text-white hover:bg-white/5">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-supernova-navy border-supernova-gold/30">
                <div className="px-2 py-1.5 text-sm text-white/70">
                  Signed in as<br />
                  <span className="font-medium text-supernova-gold">{user.email}</span>
                </div>
                <DropdownMenuSeparator className="bg-supernova-gold/20" />
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-white/10 text-white"
                  onClick={() => navigate('/account')}
                >
                  <User className="mr-2 h-4 w-4" />
                  My Account
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-white/10 text-white"
                  onClick={() => navigate('/account/bookmarks')}
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  Saved Articles
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-white/10 text-white"
                  onClick={() => navigate('/account/preferences')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Preferences
                </DropdownMenuItem>
                
                {user && (
                  <>
                    <DropdownMenuSeparator className="bg-supernova-gold/20" />
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-white/10 text-white"
                      onClick={() => navigate('/admin/insert-newsletter')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Create Newsletter
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator className="bg-supernova-gold/20" />
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-white/10 text-white"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default" 
              className="bg-supernova-gold hover:bg-supernova-gold/90 text-black"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          )}
        </div>
        
        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} flex-col w-full mt-4 md:hidden`}>
          <Link 
            to="/newsletters" 
            className="text-white hover:text-supernova-gold transition-colors py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Newsletters
          </Link>
          
          {user ? (
            <>
              <div className="py-2 text-sm text-white/70">
                Signed in as<br />
                <span className="font-medium text-supernova-gold">{user.email}</span>
              </div>
              <div className="border-t border-supernova-gold/20 my-2"></div>
              <Link 
                to="/account" 
                className="flex items-center text-white hover:text-supernova-gold transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="mr-2 h-4 w-4" />
                My Account
              </Link>
              <Link 
                to="/account/bookmarks" 
                className="flex items-center text-white hover:text-supernova-gold transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Saved Articles
              </Link>
              <Link 
                to="/account/preferences" 
                className="flex items-center text-white hover:text-supernova-gold transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </Link>
              {user && (
                <>
                  <div className="border-t border-supernova-gold/20 my-2"></div>
                  <Link 
                    to="/admin/insert-newsletter" 
                    className="flex items-center text-white hover:text-supernova-gold transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Create Newsletter
                  </Link>
                </>
              )}
              <div className="border-t border-supernova-gold/20 my-2"></div>
              <button 
                className="flex items-center text-white hover:text-supernova-gold transition-colors py-2" 
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <Button 
              variant="default" 
              className="bg-supernova-gold hover:bg-supernova-gold/90 text-black w-full mt-2"
              onClick={() => {
                navigate('/auth');
                setMobileMenuOpen(false);
              }}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
