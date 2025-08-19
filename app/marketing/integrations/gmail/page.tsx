import Link from 'next/link'
import { getGmailIntegrationStatus } from '../../../actions/marketing'
import { GmailIntegrationForm } from '../../../components/marketing/GmailIntegrationForm'
import { unstable_noStore as noStore } from 'next/cache'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function GmailIntegrationPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string }
}) {
  noStore()
  
  const gmailStatus = await getGmailIntegrationStatus()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/marketing"
          className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block"
        >
          ← Back to Marketing Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Gmail Integration</h1>
        <p className="text-gray-600 mt-2">Connect your Gmail account to send email campaigns</p>
      </div>

      {/* Success/Error Messages */}
      {searchParams.success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-800 font-medium">Gmail Integration Successful!</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Your Gmail account has been successfully connected. You can now send email campaigns.
          </p>
        </div>
      )}

      {searchParams.error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-red-800 font-medium">Gmail Integration Failed</span>
          </div>
          <p className="text-red-700 text-sm mt-1">
            {decodeURIComponent(searchParams.error)}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          
          {gmailStatus.isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-green-700 font-medium">Connected</span>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium text-green-900">Gmail Account Connected</span>
                </div>
                <p className="text-sm text-green-800">
                  Connected to: <strong>{gmailStatus.email}</strong>
                </p>
                {gmailStatus.expiresAt && (
                  <p className="text-xs text-green-700 mt-1">
                    Token expires: {new Date(gmailStatus.expiresAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">What you can do now:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Send email campaigns to your lists</li>
                  <li>• Schedule emails for later delivery</li>
                  <li>• Track email opens and clicks</li>
                  <li>• Manage bounces and unsubscribes</li>
                </ul>
              </div>

              <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium">
                Disconnect Gmail
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-red-700 font-medium">Not Connected</span>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="font-medium text-yellow-900">Gmail Account Required</span>
                </div>
                <p className="text-sm text-yellow-800">
                  Connect your Gmail account to send email campaigns to your subscribers.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Why connect Gmail?</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Send professional email campaigns</li>
                  <li>• Track delivery and engagement</li>
                  <li>• Manage your sender reputation</li>
                  <li>• Comply with email regulations</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Setup Instructions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900">Step 1: Google Cloud Console</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create a project in Google Cloud Console and enable the Gmail API.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900">Step 2: OAuth Credentials</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create OAuth 2.0 credentials and configure the redirect URI.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900">Step 3: Connect Account</h3>
              <p className="text-sm text-gray-600 mt-1">
                Authorize the application to access your Gmail account.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="font-medium text-blue-900 mb-2">🔒 Security & Privacy</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• We only access Gmail to send emails on your behalf</li>
                <li>• We never read your emails or access your inbox</li>
                <li>• You can revoke access at any time</li>
                <li>• All data is encrypted and secure</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Form */}
      {!gmailStatus.isConnected && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Connect Gmail Account</h2>
          <GmailIntegrationForm />
        </div>
      )}
    </div>
  )
}
