'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.replace('/login');
      } else if (requireAdmin) {
        // Check if user is admin
        const userRole = user.user_metadata?.role || 'user';
        if (userRole !== 'admin') {
          // Not admin, redirect to home
          router.replace('/');
        }
      }
    }
  }, [user, loading, requireAdmin, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  // Check admin requirement
  if (requireAdmin) {
    const userRole = user.user_metadata?.role || 'user';
    if (userRole !== 'admin') {
      return null; // Will redirect
    }
  }

  // User is authenticated and authorized
  return <>{children}</>;
}
