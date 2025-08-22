'use client';

import { useState, useEffect } from 'react';
import { PagePermission } from './pageDetection';

// Client-side fallback pages when server detection fails
export const CLIENT_FALLBACK_PAGES: PagePermission[] = [
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

export function useAvailablePages() {
  const [pages, setPages] = useState<PagePermission[]>(CLIENT_FALLBACK_PAGES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get pages from server action
        const { getAvailablePages } = await import('@/app/actions/pageDetection');
        const serverPages = await getAvailablePages();
        
        if (serverPages && serverPages.length > 0) {
          setPages(serverPages);
        } else {
          // Fallback to client pages if server returns empty
          setPages(CLIENT_FALLBACK_PAGES);
        }
      } catch (err) {
        console.error('Error loading pages from server:', err);
        // Use fallback pages on error
        setPages(CLIENT_FALLBACK_PAGES);
        setError('Failed to load pages from server, using fallback');
      } finally {
        setLoading(false);
      }
    };

    loadPages();
  }, []);

  return { pages, loading, error };
}
