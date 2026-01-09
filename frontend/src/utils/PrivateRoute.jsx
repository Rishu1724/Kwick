import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, role = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If a specific role is required and user doesn't have it, redirect to home
  if (role && user.role !== role && user.role !== 'both') {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;