import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/store';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const user = useAuthStore((state) => state.user);

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}