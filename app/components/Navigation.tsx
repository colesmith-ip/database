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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        {label}
        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute z-50 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Hello CRM</span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>

              {renderDropdown(
                contactsDropdownOpen,
                setContactsDropdownOpen,
                contactsItems,
                'Contacts',
                contactsItems.some(item => isActive(item.href))
              )}

              {renderDropdown(
                mobilizationDropdownOpen,
                setMobilizationDropdownOpen,
                mobilizationItems,
                'Mobilization',
                mobilizationItems.some(item => isActive(item.href))
              )}

              <Link
                href="/marketing"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/marketing')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Communications
              </Link>

              {renderDropdown(
                projectManagementDropdownOpen,
                setProjectManagementDropdownOpen,
                projectManagementItems,
                'Project Management',
                projectManagementItems.some(item => isActive(item.href))
              )}

              <Link
                href="/hr"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/hr')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                HR
              </Link>

              <Link
                href="/finance"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/finance')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Finance
              </Link>
            </div>
          </div>

          {/* Right side - Settings dropdown */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onMouseEnter={() => {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                    timeoutRef.current = null
                  }
                  setSettingsDropdownOpen(true)
                }}
                onMouseLeave={() => {
                  timeoutRef.current = setTimeout(() => setSettingsDropdownOpen(false), 200)
                }}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center"
              >
                Settings
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {settingsDropdownOpen && (
                <div
                  onMouseEnter={() => {
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current)
                      timeoutRef.current = null
                    }
                    setSettingsDropdownOpen(true)
                  }}
                  onMouseLeave={() => {
                    timeoutRef.current = setTimeout(() => setSettingsDropdownOpen(false), 200)
                  }}
                  className="absolute right-0 z-50 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1"
                >
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    General
                  </Link>
                  
                  <div className="border-t border-gray-200 my-1"></div>
                  
                  <button
                    onClick={signOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Sign Out
                  </button>
                  
                  <div className="border-t border-gray-200 my-1"></div>
                  
                  <div className="px-4 py-2 text-xs text-gray-500">
                    <div>{user.email}</div>
                    <div className="capitalize">{userRole}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
