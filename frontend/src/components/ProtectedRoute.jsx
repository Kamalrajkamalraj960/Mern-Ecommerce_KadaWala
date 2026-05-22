import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-cream">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and store current location for redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
