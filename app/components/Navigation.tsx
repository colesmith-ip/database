'use client'

import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'

export function Navigation() {
  const { user, signOut } = useAuth()
  const userRole = user?.user_metadata?.role || 'user'

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Hello CRM</span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              
              <Link href="/people" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                People
              </Link>
              
              <Link href="/organizations" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Organizations
              </Link>
              
              <Link href="/pipelines" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Pipelines
              </Link>
              
              <Link href="/tasks" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Tasks
              </Link>
            </div>
          </div>

          {/* Right side - Settings and user */}
          <div className="flex items-center space-x-4">
            {userRole === 'admin' && (
              <Link href="/settings" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Settings
              </Link>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">{user?.email}</span>
              <button
                onClick={signOut}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
