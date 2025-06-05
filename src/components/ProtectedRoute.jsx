import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute; 