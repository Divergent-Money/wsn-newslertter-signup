
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto py-10 px-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>You need to be logged in to view this page.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/auth')}>Sign In</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-supernova-gold">My Account</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <Link 
                    to="/account" 
                    className="px-4 py-2 hover:bg-accent border-l-2 border-primary"
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/account/preferences" 
                    className="px-4 py-2 hover:bg-accent border-l-2 border-transparent"
                  >
                    Preferences
                  </Link>
                  <Link 
                    to="/account/bookmarks" 
                    className="px-4 py-2 hover:bg-accent border-l-2 border-transparent"
                  >
                    Saved Articles
                  </Link>
                  <Link 
                    to="/account/subscription" 
                    className="px-4 py-2 hover:bg-accent border-l-2 border-transparent"
                  >
                    Subscription
                  </Link>
                </nav>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Account ID</h3>
                    <p className="text-muted-foreground">{user.id}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Member Since</h3>
                    <p className="text-muted-foreground">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
