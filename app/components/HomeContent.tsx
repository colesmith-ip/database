'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getAnnouncements, getEvents } from '@/app/actions/homepage';
import AnnouncementsSection from './homepage/AnnouncementsSection';
import EventsSection from './homepage/EventsSection';
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
        setAnnouncements(announcementsData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to International Project CRM</h1>
        <p className="text-gray-600 mt-2">
          Hello, {user?.email} ({userRole})
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Announcements Section */}
        <AnnouncementsSection announcements={announcements} />
        
        {/* Events Section */}
        <EventsSection events={events} />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* People */}
        <Link
          href="/people"
          className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">People</h3>
              <p className="text-sm text-gray-600">Manage contacts and people</p>
            </div>
          </div>
          <div className="text-blue-600 font-medium text-sm">
            View people →
          </div>
        </Link>

        {/* Organizations */}
        <Link
          href="/organizations"
          className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-green-600 text-xl">🏢</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Organizations</h3>
              <p className="text-sm text-gray-600">Manage companies and organizations</p>
            </div>
          </div>
          <div className="text-green-600 font-medium text-sm">
            View organizations →
          </div>
        </Link>

        {/* Pipelines */}
        <Link
          href="/pipelines"
          className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-purple-600 text-xl">📊</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Pipelines</h3>
              <p className="text-sm text-gray-600">Manage sales pipelines and deals</p>
            </div>
          </div>
          <div className="text-purple-600 font-medium text-sm">
            View pipelines →
          </div>
        </Link>

        {/* Tasks */}
        <Link
          href="/tasks"
          className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-yellow-600 text-xl">📋</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Tasks</h3>
              <p className="text-sm text-gray-600">Manage tasks and to-dos</p>
            </div>
          </div>
          <div className="text-yellow-600 font-medium text-sm">
            View tasks →
          </div>
        </Link>

        {/* Reports */}
        <Link
          href="/reports"
          className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-indigo-600 text-xl">📈</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Reports</h3>
              <p className="text-sm text-gray-600">View analytics and reports</p>
            </div>
          </div>
          <div className="text-indigo-600 font-medium text-sm">
            View reports →
          </div>
        </Link>

        {/* Settings */}
        <Link
          href="/settings"
          className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-gray-600 text-xl">⚙️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Settings</h3>
              <p className="text-sm text-gray-600">Configure your CRM system</p>
            </div>
          </div>
          <div className="text-gray-600 font-medium text-sm">
            Configure settings →
          </div>
        </Link>
      </div>

      {/* Admin Section */}
      {userRole === 'admin' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Admin Panel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/settings/users"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-center"
            >
              Manage Users
            </Link>
            <Link
              href="/settings"
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg font-medium text-center"
            >
              System Settings
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-600">No recent activity to display.</p>
      </div>
    </div>
  );
}
