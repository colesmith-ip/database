'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Navigation() {
  const pathname = usePathname()
  const [contactsDropdownOpen, setContactsDropdownOpen] = useState(false)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/pipelines', label: 'Pipelines' },
    { href: '/tasks', label: 'Tasks' },
    { href: '/marketing', label: 'Marketing' },
    { href: '/reports', label: 'Reports' },
    { href: '/settings', label: 'Settings' },
  ]

  const contactsItems = [
    { href: '/people', label: 'People' },
    { href: '/organizations', label: 'Organizations' },
    { href: '/contacts', label: 'All Contacts' },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              International Project
            </Link>
            
            <div className="flex space-x-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}

              {/* Contacts Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => {
                    if (dropdownTimeout) {
                      clearTimeout(dropdownTimeout)
                      setDropdownTimeout(null)
                    }
                    setContactsDropdownOpen(true)
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => setContactsDropdownOpen(false), 150)
                    setDropdownTimeout(timeout)
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                    pathname.startsWith('/people') || pathname.startsWith('/organizations') || pathname.startsWith('/contacts')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Contacts
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {contactsDropdownOpen && (
                  <div
                    onMouseEnter={() => {
                      if (dropdownTimeout) {
                        clearTimeout(dropdownTimeout)
                        setDropdownTimeout(null)
                      }
                      setContactsDropdownOpen(true)
                    }}
                    onMouseLeave={() => {
                      const timeout = setTimeout(() => setContactsDropdownOpen(false), 150)
                      setDropdownTimeout(timeout)
                    }}
                    className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                  >
                    {contactsItems.map((item) => {
                      const isActive = pathname === item.href || 
                        (item.href !== '/contacts' && pathname.startsWith(item.href))
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            isActive
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
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
