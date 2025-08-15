import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'

// Force dynamic rendering to prevent build-time issues
export const dynamic = 'force-dynamic'

export default function OrganizationsPage() {
  noStore()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <Link
          href="/organizations/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
        >
          Add Organization
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Organizations list temporarily disabled for deployment testing.</p>
      </div>
    </div>
  )
}
