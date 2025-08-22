'use server';

import fs from 'fs';
import path from 'path';

export interface PagePermission {
  id: string;
  name: string;
  path: string;
  description: string;
  category: string;
}

// Category mapping for different page types
const CATEGORY_MAPPING: Record<string, string> = {
  '': 'Core',
  'people': 'Contacts',
  'organizations': 'Contacts',
  'contacts': 'Contacts',
  'pipelines': 'Mobilization',
  'reports': 'Mobilization',
  'marketing': 'Communications',
  'tasks': 'Project Management',
  'hr': 'HR',
  'finance': 'Finance',
  'settings': 'System',
  'admin': 'System',
  'auth': 'System',
  'login': 'System',
  'reset-password': 'System',
};

// Name mapping for better display names
const NAME_MAPPING: Record<string, string> = {
  '': 'Dashboard',
  'people': 'People',
  'organizations': 'Organizations',
  'contacts': 'All Contacts',
  'pipelines': 'Pipelines',
  'reports': 'Reports',
  'marketing': 'Communications',
  'tasks': 'Tasks',
  'hr': 'Human Resources',
  'finance': 'Finance',
  'settings': 'Settings',
  'users': 'User Management',
  'roles': 'Role Management',
  'admin': 'Admin Panel',
  'auth': 'Authentication',
  'login': 'Login',
  'reset-password': 'Password Reset',
};

// Description mapping for better descriptions
const DESCRIPTION_MAPPING: Record<string, string> = {
  '': 'Main dashboard with announcements and events',
  'people': 'Manage contacts and people',
  'organizations': 'Manage companies and organizations',
  'contacts': 'View all contacts',
  'pipelines': 'Manage sales pipelines and deals',
  'reports': 'View analytics and reports',
  'marketing': 'Marketing and communications',
  'tasks': 'Manage tasks and to-dos',
  'hr': 'HR management and employee data',
  'finance': 'Financial management and accounting',
  'settings': 'System settings and configuration',
  'users': 'Manage users and permissions',
  'roles': 'Configure role permissions and access control',
  'admin': 'Administrative tools and functions',
  'auth': 'Authentication and security',
  'login': 'User login and authentication',
  'reset-password': 'Password reset functionality',
};

function scanDirectory(dir: string, basePath: string = ''): string[] {
  const pages: string[] = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip certain directories
        if (['node_modules', '.next', 'components', 'lib', 'contexts', 'actions', 'api'].includes(item)) {
          continue;
        }
        
        // Check if this directory has a page.tsx file
        const pageFile = path.join(fullPath, 'page.tsx');
        if (fs.existsSync(pageFile)) {
          pages.push(relativePath);
        } else {
          // Recursively scan subdirectories
          pages.push(...scanDirectory(fullPath, relativePath));
        }
      }
    }
  } catch (error) {
    console.error('Error scanning directory:', error);
  }
  
  return pages;
}

function generatePagePermission(pagePath: string): PagePermission {
  const segments = pagePath.split(path.sep);
  const lastSegment = segments[segments.length - 1] || '';
  const parentSegment = segments[segments.length - 2] || '';
  
  // Generate ID
  const id = pagePath.replace(/[\/\\]/g, '-').replace(/^-/, '') || 'dashboard';
  
  // Generate path
  const routePath = pagePath ? `/${pagePath}` : '/';
  
  // Determine category
  let category = 'Core';
  if (parentSegment && CATEGORY_MAPPING[parentSegment]) {
    category = CATEGORY_MAPPING[parentSegment];
  } else if (CATEGORY_MAPPING[lastSegment]) {
    category = CATEGORY_MAPPING[lastSegment];
  }
  
  // Generate name
  let name = 'Dashboard';
  if (NAME_MAPPING[lastSegment]) {
    name = NAME_MAPPING[lastSegment];
  } else if (NAME_MAPPING[parentSegment]) {
    name = NAME_MAPPING[parentSegment];
  } else {
    // Fallback: capitalize and format the segment
    name = lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Generate description
  let description = 'Page functionality';
  if (DESCRIPTION_MAPPING[lastSegment]) {
    description = DESCRIPTION_MAPPING[lastSegment];
  } else if (DESCRIPTION_MAPPING[parentSegment]) {
    description = DESCRIPTION_MAPPING[parentSegment];
  }
  
  return {
    id,
    name,
    path: routePath,
    description,
    category
  };
}

export async function getAvailablePages(): Promise<PagePermission[]> {
  try {
    const appDir = path.join(process.cwd(), 'app');
    const pages = scanDirectory(appDir);
    
    // Convert page paths to permissions
    const permissions = pages.map(pagePath => generatePagePermission(pagePath));
    
    // Sort by category and then by name
    permissions.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });
    
    return permissions;
  } catch (error) {
    console.error('Error getting available pages:', error);
    // Return fallback pages if scanning fails
    return [
      { id: 'dashboard', name: 'Dashboard', path: '/', description: 'Main dashboard', category: 'Core' },
      { id: 'people', name: 'People', path: '/people', description: 'Manage contacts', category: 'Contacts' },
      { id: 'organizations', name: 'Organizations', path: '/organizations', description: 'Manage organizations', category: 'Contacts' },
    ];
  }
}

// For development/testing - get pages synchronously
export function getAvailablePagesSync(): PagePermission[] {
  try {
    const appDir = path.join(process.cwd(), 'app');
    const pages = scanDirectory(appDir);
    
    const permissions = pages.map(pagePath => generatePagePermission(pagePath));
    
    permissions.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });
    
    return permissions;
  } catch (error) {
    console.error('Error getting available pages:', error);
    return [
      { id: 'dashboard', name: 'Dashboard', path: '/', description: 'Main dashboard', category: 'Core' },
      { id: 'people', name: 'People', path: '/people', description: 'Manage contacts', category: 'Contacts' },
      { id: 'organizations', name: 'Organizations', path: '/organizations', description: 'Manage organizations', category: 'Contacts' },
    ];
  }
}
