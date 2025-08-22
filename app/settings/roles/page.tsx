'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';

interface PagePermission {
  id: string;
  name: string;
  path: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

// Static list of available pages - no server actions needed
const AVAILABLE_PAGES: PagePermission[] = [
  { id: 'dashboard', name: 'Dashboard', path: '/', description: 'Main dashboard with announcements and events', category: 'Core' },
  { id: 'people', name: 'People', path: '/people', description: 'Manage contacts and people', category: 'Contacts' },
  { id: 'organizations', name: 'Organizations', path: '/organizations', description: 'Manage companies and organizations', category: 'Contacts' },
  { id: 'contacts', name: 'All Contacts', path: '/contacts', description: 'View all contacts', category: 'Contacts' },
  { id: 'pipelines', name: 'Pipelines', path: '/pipelines', description: 'Manage sales pipelines and deals', category: 'Mobilization' },
  { id: 'reports', name: 'Reports', path: '/reports', description: 'View analytics and reports', category: 'Mobilization' },
  { id: 'marketing', name: 'Communications', path: '/marketing', description: 'Marketing and communications', category: 'Communications' },
  { id: 'tasks', name: 'Tasks', path: '/tasks', description: 'Manage tasks and to-dos', category: 'Project Management' },
  { id: 'hr', name: 'Human Resources', path: '/hr', description: 'HR management', category: 'HR' },
  { id: 'finance', name: 'Finance', path: '/finance', description: 'Financial management', category: 'Finance' },
  { id: 'settings', name: 'Settings', path: '/settings', description: 'System settings', category: 'System' },
  { id: 'user-management', name: 'User Management', path: '/settings/users', description: 'Manage users and permissions', category: 'System' },
  { id: 'role-management', name: 'Role Management', path: '/settings/roles', description: 'Configure role permissions and access control', category: 'System' },
];

const DEFAULT_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full access to all features',
    permissions: AVAILABLE_PAGES.map(page => page.id)
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Access to most features except system settings',
    permissions: AVAILABLE_PAGES.filter(page => !['settings', 'user-management', 'role-management'].includes(page.id)).map(page => page.id)
  },
  {
    id: 'user',
    name: 'User',
    description: 'Basic access to core features',
    permissions: ['dashboard', 'people', 'organizations', 'contacts', 'tasks']
  }
];

export default function RolesPage() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const userRole = user?.user_metadata?.role || 'user';

  // Only admins can access this page
  if (userRole !== 'admin') {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access role management.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEditingRole(null);
  };

  const handlePermissionToggle = (pageId: string) => {
    if (!editingRole) return;

    const newPermissions = editingRole.permissions.includes(pageId)
      ? editingRole.permissions.filter(id => id !== pageId)
      : [...editingRole.permissions, pageId];

    setEditingRole({ ...editingRole, permissions: newPermissions });
  };

  const handleSaveRole = async () => {
    if (!editingRole) return;

    try {
      // Here you would save to your database
      // For now, we'll just update the local state
      setRoles(roles.map(role => 
        role.id === editingRole.id ? editingRole : role
      ));
      setSelectedRole(editingRole);
      setEditingRole(null);
      
      // TODO: Save to database
      console.log('Saving role:', editingRole);
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
  };

  const groupedPages = AVAILABLE_PAGES.reduce((groups, page) => {
    if (!groups[page.category]) {
      groups[page.category] = [];
    }
    groups[page.category].push(page);
    return groups;
  }, {} as Record<string, PagePermission[]>);

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-2">
            Manage role permissions and access control for your CRM system.
          </p>
          <p className="text-sm text-blue-600 mt-2">
            📁 {AVAILABLE_PAGES.length} pages available for role configuration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Roles List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Roles</h2>
              <div className="space-y-3">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedRole?.id === role.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <h3 className="font-medium text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {role.permissions.length} permissions
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Permissions Editor */}
          <div className="lg:col-span-2">
            {selectedRole ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedRole.name} Permissions</h2>
                    <p className="text-gray-600 mt-1">{selectedRole.description}</p>
                  </div>
                  {!editingRole && (
                    <button
                      onClick={() => setEditingRole({ ...selectedRole })}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Edit Permissions
                    </button>
                  )}
                </div>

                {editingRole ? (
                  <div>
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-4">
                        Select which pages and features this role can access:
                      </p>
                      
                      {Object.entries(groupedPages).map(([category, pages]) => (
                        <div key={category} className="mb-6">
                          <h3 className="font-medium text-gray-900 mb-3">{category}</h3>
                          <div className="space-y-2">
                            {pages.map((page) => (
                              <label key={page.id} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingRole.permissions.includes(page.id)}
                                  onChange={() => handlePermissionToggle(page.id)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <div>
                                  <div className="font-medium text-gray-900">{page.name}</div>
                                  <div className="text-sm text-gray-600">{page.description}</div>
                                  <div className="text-xs text-gray-500">{page.path}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveRole}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(groupedPages).map(([category, pages]) => (
                        <div key={category}>
                          <h3 className="font-medium text-gray-900 mb-2">{category}</h3>
                          <div className="space-y-1">
                            {pages.map((page) => (
                              <div
                                key={page.id}
                                className={`text-sm p-2 rounded ${
                                  selectedRole.permissions.includes(page.id)
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : 'bg-gray-50 text-gray-500 border border-gray-200'
                                }`}
                              >
                                {page.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center text-gray-500">
                  <p>Select a role to view and edit its permissions.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
