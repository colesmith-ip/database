'use client';

import { useState } from 'react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  priority: string;
  createdAt: Date;
}

interface AnnouncementsSectionProps {
  announcements: Announcement[];
}

export default function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Announcements</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showForm ? 'Cancel' : 'Add Announcement'}
        </button>
      </div>
      
      {showForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Announcement form coming soon...</p>
        </div>
      )}
      
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  By {announcement.authorName} • {announcement.createdAt.toLocaleDateString()}
                </p>
              </div>
              {announcement.priority === 'high' && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  High Priority
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
