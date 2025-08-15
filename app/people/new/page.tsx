import Link from 'next/link'
import { PersonForm } from '../../components/people/PersonForm'

// Force dynamic rendering to prevent build-time issues
export const dynamic = 'force-dynamic'

export default function NewPersonPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/people"
          className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block"
        >
          ← Back to People
        </Link>
        <h1 className="text-3xl font-bold">Add New Person</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <PersonForm />
      </div>
    </div>
  )
}
