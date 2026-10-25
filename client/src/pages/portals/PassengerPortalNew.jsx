import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import authStore from '../../store/authStore';
import { mockNotifications, mockAssignments, mockBuses } from '../../store/mockData';
import LiveTrackingPage from '../passenger/LiveTrackingPage';
import BusAvailabilityPage from '../passenger/BusAvailabilityPage';
import ComplaintsPage from '../passenger/ComplaintsPage';

export default function PassengerPortalNew() {
  const { user, clearAuth } = authStore();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(
    mockNotifications.filter(n => !n.readAt).length
  );

  const handleLogout = () => {
    clearAuth();
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="glass sticky top-0 z-40 shadow-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 3h12c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm0 2v14h12V5H6z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">TransitTech</h1>
                <p className="text-xs text-gray-500">Passenger Portal • AITR Campus</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{user?.displayName}</p>
                <p className="text-xs text-gray-500">Shift 1: 08:20 - 14:40</p>
              </div>

              <Link to="/passenger/notifications" className="relative p-2 hover:bg-white/50 rounded-lg transition-smooth">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white/50 rounded-lg transition-smooth"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex space-x-2 border-t border-white/20 -mx-4 px-4 pt-2 overflow-x-auto">
            <Link to="/passenger/tracking" className={`nav-item ${isActive('/tracking') ? 'active' : ''}`}>
              ⚡ Live Tracking Map
            </Link>
            <Link to="/passenger/availability" className={`nav-item ${isActive('/availability') ? 'active' : ''}`}>
              🚌 My Bus & Seat Availability
            </Link>
            <Link to="/passenger/complaints" className={`nav-item ${isActive('/complaints') ? 'active' : ''}`}>
              📋 Requests & Complaints
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/passenger/tracking" />} />
          <Route path="tracking" element={<LiveTrackingPage />} />
          <Route path="availability" element={<BusAvailabilityPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Routes>
      </main>
    </div>
  );
}

function NotificationsPage() {
  return (
    <div className="glass p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
      <div className="space-y-4">
        {mockNotifications.map(notif => (
          <div
            key={notif._id}
            className={`p-4 rounded-lg border-l-4 transition-smooth ${
              notif.readAt
                ? 'bg-gray-50 border-gray-300'
                : 'bg-blue-50 border-blue-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`font-medium ${notif.readAt ? 'text-gray-700' : 'text-blue-900'}`}>
                  {notif.title}
                </p>
                <p className={`text-sm ${notif.readAt ? 'text-gray-600' : 'text-blue-800'} mt-1`}>
                  {notif.message}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
