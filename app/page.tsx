import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'

// Force dynamic rendering to prevent build-time issues
export const dynamic = 'force-dynamic'

export default function Home() {
  noStore()
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Title Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-6xl font-bold text-blue-600 text-center">International Project</h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 CRM System</h2>
          <p className="text-gray-600 mb-6">
            Welcome to your CRM system! The homepage is temporarily simplified for deployment testing.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/people" className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <h3 className="font-medium text-gray-900">👥 People</h3>
              <p className="text-sm text-gray-600">Manage contacts</p>
            </Link>
            
            <Link href="/organizations" className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <h3 className="font-medium text-gray-900">🏢 Organizations</h3>
              <p className="text-sm text-gray-600">Manage companies</p>
            </Link>
            
            <Link href="/tasks" className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <h3 className="font-medium text-gray-900">📋 Tasks</h3>
              <p className="text-sm text-gray-600">Manage tasks</p>
            </Link>
            
            <Link href="/pipelines" className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <h3 className="font-medium text-gray-900">📊 Pipelines</h3>
              <p className="text-sm text-gray-600">Manage workflows</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
