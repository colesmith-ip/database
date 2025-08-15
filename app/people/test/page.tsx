// Force dynamic rendering to prevent build-time issues
export const dynamic = 'force-dynamic'

export default function TestPeoplePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">People Page Test</h1>
      <p className="mt-4">This is a test page to verify routing works.</p>
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Static Test Data</h2>
        <div className="space-y-2">
          <div className="border-b pb-2">
            <p className="font-medium">John Smith</p>
            <p className="text-sm text-gray-600">john.smith@example.com</p>
          </div>
          <div className="border-b pb-2">
            <p className="font-medium">Sarah Johnson</p>
            <p className="text-sm text-gray-600">sarah.johnson@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

