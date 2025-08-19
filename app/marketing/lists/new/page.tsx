import Link from 'next/link'
import { EmailListForm } from '../../../components/marketing/EmailListForm'

export default function NewEmailListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/marketing/lists"
          className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block"
        >
          ← Back to Email Lists
        </Link>
        <h1 className="text-3xl font-bold">Create New Email List</h1>
        <p className="text-gray-600 mt-2">Build a new subscriber list for your email campaigns</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <EmailListForm />
      </div>
    </div>
  )
}
