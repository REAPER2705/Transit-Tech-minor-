import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import authStore from '../../store/authStore';
import { passengerAPI } from '../../utils/api';
import LiveTrackingMap from '../../components/LiveTrackingMap';
import BusAvailability from '../../components/BusAvailability';
import Complaints from '../../components/Complaints';
import Notifications from '../../components/Notifications';
import TimetablePage from './TimetablePage';

export default function PassengerPortal() {
  const { user, clearAuth } = authStore();
  const location = useLocation();
  const [assignments, setAssignments] = useState([]);
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const assignRes = await passengerAPI.getAssignments();
      setAssignments(assignRes.data.data);

      if (assignRes.data.data.length > 0) {
        const busRes = await passengerAPI.getBus();
        setBus(busRes.data.data);
      }

      const notifRes = await passengerAPI.getNotifications();
      setNotificationCount(notifRes.data.data.filter(n => !n.readAt).length);
    } catch (error) {
      console.error('Error loading passenger data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16h.01M12 16h.01M16 16h.01M9 7h6M9 11h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v11a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">TransitTech</h1>
                <p className="text-xs text-gray-500">Passenger Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.displayName}</p>
                <p className="text-xs text-gray-500">Shift 1: 08:20 - 14:40</p>
              </div>

              <Link to="/passenger/notifications" className="relative">
                <div className="p-2 hover:bg-white/50 rounded-lg transition-smooth">
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white/50 rounded-lg transition-smooth"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Sub-navigation */}
          <div className="flex space-x-2 border-t border-white/20 -mx-4 px-4 pt-2">
            <Link
              to="/passenger/live-tracking"
              className={`nav-item ${isActive('/live-tracking') ? 'active' : ''}`}
            >
              ⚡ Live Tracking Map
            </Link>
            <Link
              to="/passenger/bus-availability"
              className={`nav-item ${isActive('/bus-availability') ? 'active' : ''}`}
            >
              🚌 My Bus & Seat Availability
            </Link>
            <Link
              to="/passenger/timetable"
              className={`nav-item ${isActive('/timetable') ? 'active' : ''}`}
            >
              📅 Timetable & Routes
            </Link>
            <Link
              to="/passenger/complaints"
              className={`nav-item ${isActive('/complaints') ? 'active' : ''}`}
            >
              📋 Requests & Complaints
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/passenger/live-tracking" />} />
          <Route path="live-tracking" element={<LiveTrackingMap />} />
          <Route path="bus-availability" element={<BusAvailability />} />
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="notifications" element={<Notifications />} />
        </Routes>
      </main>
    </div>
  );
};
