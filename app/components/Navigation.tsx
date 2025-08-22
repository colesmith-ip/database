'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'

export function Navigation() {
  const pathname = usePathname()
  const [contactsDropdownOpen, setContactsDropdownOpen] = useState(false)
  const [mobilizationDropdownOpen, setMobilizationDropdownOpen] = useState(false)
  const [projectManagementDropdownOpen, setProjectManagementDropdownOpen] = useState(false)
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false)
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
  ) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleMouseEnter = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setIsOpen(true)
    }

    const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false)
      }, 200) // 200ms delay before closing
    }

    return (
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
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
          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
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
  }

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
            </div>
          </div>

          {/* Settings Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setSettingsDropdownOpen(true)}
              onMouseLeave={() => {
                setTimeout(() => setSettingsDropdownOpen(false), 200)
              }}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                pathname.startsWith('/settings')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {settingsDropdownOpen && (
              <div
                onMouseEnter={() => setSettingsDropdownOpen(true)}
                onMouseLeave={() => {
                  setTimeout(() => setSettingsDropdownOpen(false), 200)
                }}
                className="absolute top-full right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50"
              >
                <Link
                  href="/settings"
                  className={`block px-4 py-2 text-sm transition-colors ${
                    pathname.startsWith('/settings')
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  General
                </Link>
                <button
                  onClick={signOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign Out
                </button>
                <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
                  {user.email} ({userRole})
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
