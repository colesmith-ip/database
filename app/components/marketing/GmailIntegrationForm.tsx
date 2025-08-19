'use client'

import { useState } from 'react'

export function GmailIntegrationForm() {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnectGmail = async () => {
    setIsConnecting(true)
    
    try {
      // Redirect to our OAuth endpoint
      window.location.href = '/api/auth/gmail'
    } catch (error) {
      console.error('Failed to connect Gmail:', error)
      alert('Failed to connect Gmail account. Please try again.')
      setIsConnecting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="font-medium text-blue-900 mb-2">📧 Gmail API Integration</h4>
        <p className="text-sm text-blue-800 mb-3">
          To send email campaigns, you need to connect your Gmail account. This allows us to send emails on your behalf.
        </p>
        <div className="text-xs text-blue-700 space-y-1">
          <p><strong>Required permissions:</strong></p>
          <ul className="list-disc list-inside ml-2">
            <li>Send emails on your behalf</li>
            <li>Read email metadata (for tracking)</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gmail Account
          </label>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="email"
                placeholder="your-email@gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
            </div>
            <button
              type="button"
              onClick={handleConnectGmail}
              disabled={isConnecting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              {isConnecting ? 'Connecting...' : 'Connect Gmail'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            You'll be redirected to Google to authorize the connection.
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h4 className="font-medium text-yellow-900 mb-2">⚠️ Important Notes</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Use a Gmail account that you control and have access to</li>
          <li>• The account should have a good sending reputation</li>
          <li>• Consider using a dedicated email for campaigns</li>
          <li>• You can disconnect at any time from your Google account settings</li>
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <h4 className="font-medium text-gray-900 mb-2">🚀 Next Steps After Connection</h4>
        <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
          <li>Create email lists for your subscribers</li>
          <li>Design email templates for your campaigns</li>
          <li>Send your first email campaign</li>
          <li>Monitor delivery and engagement metrics</li>
        </ol>
      </div>
    </div>
  )
}
