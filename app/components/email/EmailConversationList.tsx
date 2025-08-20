'use client'

import Link from 'next/link'
import { EmailConversation } from '@prisma/client'

interface EmailConversationListProps {
  conversations: (EmailConversation & {
    _count: {
      messages: number
    }
  })[]
  personId: string
}

export function EmailConversationList({ conversations, personId }: EmailConversationListProps) {
  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-medium text-gray-900">
                <Link
                  href={`/conversations/${conversation.id}`}
                  className="hover:text-blue-600"
                >
                  {conversation.subject}
                </Link>
              </h3>
              <p className="text-sm text-gray-500">
                {conversation._count.messages} message{conversation._count.messages !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                conversation.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : conversation.status === 'closed'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {conversation.status}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(conversation.lastMessageAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Last activity: {new Date(conversation.lastMessageAt).toLocaleString()}
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/conversations/${conversation.id}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Conversation
              </Link>
              <Link
                href={`/conversations/${conversation.id}/reply`}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Reply
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
