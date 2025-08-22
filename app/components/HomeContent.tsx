'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getAnnouncements, getEvents } from '@/app/actions/homepage';
import AnnouncementsSection from './homepage/AnnouncementsSection';
import EventsSection from './homepage/EventsSection';
import DiscussionBoardWrapper from './DiscussionBoardWrapper';
import Link from 'next/link';

interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  priority: string;
  createdAt: Date;
}

interface Event {
  id: string;
  title: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
  location?: string | null;
  eventType: string;
  color: string;
}

// Fallback seed data in case database is empty
const FALLBACK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Welcome to Hello CRM!',
    content: 'We\'re excited to have you on board. This CRM will help you manage your contacts, track deals, and stay organized.',
    authorName: 'System Admin',
    priority: 'normal',
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'New Features Available',
    content: 'Check out the latest updates including improved contact management and enhanced reporting capabilities.',
    authorName: 'System Admin',
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    id: '3',
    title: 'Database Seeding Complete',
    content: 'All sample data has been loaded. You can now explore contacts, tasks, and other features with realistic data.',
    authorName: 'System Admin',
    priority: 'normal',
    createdAt: new Date(Date.now() - 172800000) // 2 days ago
  }
];

const FALLBACK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly team sync to discuss progress and upcoming tasks',
    startDate: new Date(Date.now() + 86400000), // Tomorrow
    endDate: new Date(Date.now() + 86400000 + 3600000), // 1 hour later
    location: 'Conference Room A',
    eventType: 'meeting',
    color: 'blue'
  },
  {
    id: '2',
    title: 'Client Presentation',
    description: 'Present quarterly results to key client',
    startDate: new Date(Date.now() + 172800000), // 2 days from now
    endDate: new Date(Date.now() + 172800000 + 5400000), // 1.5 hours later
    location: 'Virtual Meeting',
    eventType: 'presentation',
    color: 'green'
  },
  {
    id: '3',
    title: 'Training Session',
    description: 'New CRM features training for the team',
    startDate: new Date(Date.now() + 259200000), // 3 days from now
    endDate: new Date(Date.now() + 259200000 + 7200000), // 2 hours later
    location: 'Training Room',
    eventType: 'training',
    color: 'purple'
  }
];

export function HomeContent() {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'user';
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [announcementsData, eventsData] = await Promise.all([
          getAnnouncements(),
          getEvents()
        ]);
        
        // Use database data if available, otherwise use fallback data
        setAnnouncements(announcementsData && announcementsData.length > 0 ? announcementsData : FALLBACK_ANNOUNCEMENTS);
        setEvents(eventsData && eventsData.length > 0 ? eventsData : FALLBACK_EVENTS);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Use fallback data on error
        setAnnouncements(FALLBACK_ANNOUNCEMENTS);
        setEvents(FALLBACK_EVENTS);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.user_metadata?.full_name || user?.email || 'User'}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening in your CRM today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Announcements Section */}
        <AnnouncementsSection announcements={announcements} />

        {/* Upcoming Events Section */}
        <EventsSection events={events} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href="/people/new" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-blue-600 text-lg">👤</span>
            </div>
            <span className="text-sm font-medium text-gray-900">Add Person</span>
          </Link>
          
          <Link 
            href="/organizations/new" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-green-600 text-lg">🏢</span>
            </div>
            <span className="text-sm font-medium text-gray-900">Add Organization</span>
          </Link>
          
          <Link 
            href="/tasks" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-yellow-600 text-lg">📋</span>
            </div>
            <span className="text-sm font-medium text-gray-900">View Tasks</span>
          </Link>
          
          <Link 
            href="/pipelines" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-purple-600 text-lg">📊</span>
            </div>
            <span className="text-sm font-medium text-gray-900">View Pipelines</span>
          </Link>
        </div>
      </div>

      {/* Discussion Board */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Discussion Board</h2>
        <DiscussionBoardWrapper />
      </div>
    </div>
  );
}
