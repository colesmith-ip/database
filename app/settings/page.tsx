'use client';

import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';

function SettingsContent() {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'user';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure your CRM system and customize data fields
        </p>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* People Custom Fields */}
        <Link
          href="/settings/people-fields"
          className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">People Fields</h3>
              <p className="text-sm text-gray-600">Customize contact data fields</p>
            </div>
          </div>
          <div className="text-blue-600 font-medium text-sm">
            Configure fields →
          </div>
        </Link>

        {/* Organizations Custom Fields */}
        <Link
          href="/settings/organizations-fields"
          className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-green-600 text-xl">🏢</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Organization Fields</h3>
              <p className="text-sm text-gray-600">Customize company data fields</p>
            </div>
          </div>
          <div className="text-green-600 font-medium text-sm">
            Configure fields →
          </div>
        </Link>

        {/* Data Management */}
        <Link
          href="/settings/data"
          className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-orange-600 text-xl">📊</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Data Management</h3>
              <p className="text-sm text-gray-600">Import, export, and manage data</p>
            </div>
          </div>
          <div className="text-orange-600 font-medium text-sm">
            Manage data →
          </div>
        </Link>

        {/* User Management - Only for Admins */}
        {userRole === 'admin' && (
          <Link
            href="/settings/users"
            className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-red-600 text-xl">👤</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600">Manage users, roles, and permissions</p>
              </div>
            </div>
            <div className="text-red-600 font-medium text-sm">
              Manage users →
            </div>
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/people"
            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 font-medium"
          >
            View People
          </Link>
          <Link
            href="/organizations"
            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 font-medium"
          >
            View Organizations
          </Link>
          <Link
            href="/pipelines"
            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 font-medium"
          >
            View Pipelines
          </Link>
          <Link
            href="/tasks"
            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 font-medium"
          >
            View Tasks
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
