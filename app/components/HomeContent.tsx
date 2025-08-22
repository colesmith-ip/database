'use client';

import { useAuth } from '@/app/contexts/AuthContext';

export default function HomeContent() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.user_metadata?.full_name || user?.email || 'User'}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening in your CRM today.
        </p>
      </div>

      {/* Simple Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard</h2>
        <p className="text-gray-600">
          Your CRM dashboard is working properly!
        </p>
      </div>
    </div>
  );
}
