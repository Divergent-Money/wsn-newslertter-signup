
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  adminOnly = false 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You could show a loading spinner here
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-supernova-gold"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    // Redirect to auth page but save the location they were trying to access
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Note: For the adminOnly check, you'd need to fetch the user's role from your profiles table
  // This is a placeholder for now
  if (adminOnly) {
    // For now, we're just checking if the user is authenticated
    // In a real app, you'd check if the user has admin privileges
    if (!user) {
      return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
