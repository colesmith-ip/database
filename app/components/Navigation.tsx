'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'

export function Navigation() {
  const pathname = usePathname()
  const [contactsDropdownOpen, setContactsDropdownOpen] = useState(false)
  const [mobilizationDropdownOpen, setMobilizationDropdownOpen] = useState(false)
  const [projectManagementDropdownOpen, setProjectManagementDropdownOpen] = useState(false)
  const { user, signOut } = useAuth()

  const userRole = user?.user_metadata?.role || 'user'

  const contactsItems = [
    { href: '/people', label: 'People' },
    { href: '/organizations', label: 'Organizations' },
    { href: '/contacts', label: 'All Contacts' },
  ]

  const mobilizationItems = [
    { href: '/pipelines', label: 'Pipelines' },
    { href: '/reports', label: 'Reports' },
  ]

  const projectManagementItems = [
    { href: '/tasks', label: 'Tasks' },
  ]

  // Don't show navigation if not logged in
  if (!user) {
    return null
  }

  const renderDropdown = (
    isOpen: boolean,
    setIsOpen: (value: boolean) => void,
    items: Array<{ href: string; label: string }>,
    label: string,
    isActive: boolean
  ) => (
    <div className="relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`px-2 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
          isActive
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        {label}
        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
        >
          {items.map((item) => {
            const isItemActive = pathname === item.href || 
              (item.href !== '/contacts' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 text-sm transition-colors ${
                  isItemActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-xl font-bold text-gray-900 mr-4">
              International Project
            </Link>
            
            <div className="flex items-center space-x-1">
              {/* Dashboard */}
              <Link
                href="/"
                className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>

              {/* Separator */}
              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              {/* Contacts Dropdown */}
              {renderDropdown(
                contactsDropdownOpen,
                setContactsDropdownOpen,
                contactsItems,
                'Contacts',
                pathname.startsWith('/people') || pathname.startsWith('/organizations') || pathname.startsWith('/contacts')
              )}

              {/* Separator */}
              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              {/* Mobilization Dropdown */}
              {renderDropdown(
                mobilizationDropdownOpen,
                setMobilizationDropdownOpen,
                mobilizationItems,
                'Mobilization',
                pathname.startsWith('/pipelines') || pathname.startsWith('/reports')
              )}

              {/* Separator */}
              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              {/* Communications (Marketing) */}
              <Link
                href="/marketing"
                className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith('/marketing')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Communications
              </Link>

              {/* Separator */}
              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              {/* Project Management Dropdown */}
              {renderDropdown(
                projectManagementDropdownOpen,
                setProjectManagementDropdownOpen,
                projectManagementItems,
                'Project Management',
                pathname.startsWith('/tasks')
              )}

              {/* Separator */}
              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              {/* Human Resources */}
              <Link
                href="/hr"
                className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith('/hr')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Human Resources
              </Link>

              {/* Separator */}
              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              {/* Finance */}
              <Link
                href="/finance"
                className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith('/finance')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Finance
              </Link>

              {/* Separator */}
              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              {/* Settings */}
              <Link
                href="/settings"
                className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith('/settings')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Settings
              </Link>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {user.email} ({userRole})
            </div>
            <button
              onClick={signOut}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
