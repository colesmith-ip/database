'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/people', label: 'People' },
    { href: '/organizations', label: 'Organizations' },
    { href: '/pipelines', label: 'Pipelines' },
    { href: '/tasks', label: 'Tasks' },
    { href: '/marketing', label: 'Marketing' },
    { href: '/reports', label: 'Reports' },
    { href: '/settings', label: 'Settings' },
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
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
