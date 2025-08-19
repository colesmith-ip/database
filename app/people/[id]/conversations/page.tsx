import Link from 'next/link'
import { getPerson } from '../../../actions/people'
import { getEmailConversations } from '../../../actions/email-conversations'
import { EmailConversationList } from '../../../components/email/EmailConversationList'
import { unstable_noStore as noStore } from 'next/cache'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function PersonConversationsPage({
  params,
}: {
  params: { id: string }
}) {
  noStore()
  
  const person = await getPerson(params.id)
  const conversations = await getEmailConversations(params.id)

  if (!person) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Person not found</h1>
          <Link href="/people" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
            ← Back to People
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/people/${person.id}`}
          className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block"
        >
          ← Back to {person.name}
        </Link>
        <h1 className="text-3xl font-bold">Email Conversations</h1>
        <p className="text-gray-600 mt-2">
          Email conversations with {person.name}
          {person.email && ` (${person.email})`}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Conversations</h2>
            <div className="text-sm text-gray-500">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No email conversations yet</h3>
              <p className="text-gray-500 mb-4">
                Start tracking email conversations by BCC'ing track@yourmission.org
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-left">
                <h4 className="font-medium text-blue-900 mb-2">How to start tracking:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Compose an email to {person.name}</li>
                  <li>Add <code className="bg-blue-100 px-1 rounded">track@yourmission.org</code> to the BCC field</li>
                  <li>Send the email</li>
                  <li>The conversation will appear here automatically</li>
                </ol>
              </div>
            </div>
          ) : (
            <EmailConversationList conversations={conversations} personId={person.id} />
          )}
        </div>
      </div>
    </div>
  )
}
