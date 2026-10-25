import { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import authStore from '../../store/authStore';
import TripControlPage from '../staff/TripControlPage';
import OccupancyPage from '../staff/OccupancyPage';
import ReportsPage from '../staff/ReportsPage';

export default function StaffPortalNew() {
  const { user, clearAuth } = authStore();
  const location = useLocation();
  const isDriveFunctionality = user?.roles?.includes('driver');
  const isConductorFunctionality = user?.roles?.includes('conductor');

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
              <div className="bg-amber-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">TransitTech</h1>
                <p className="text-xs text-gray-500">Transport Staff Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{user?.displayName}</p>
                <p className="text-xs text-gray-500">
                  Role: {user?.roles?.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')}
                </p>
              </div>

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
            {isDriveFunctionality && (
              <Link to="/staff/trip-control" className={`nav-item ${isActive('/trip-control') ? 'active' : ''}`}>
                🚗 Trip Control
              </Link>
            )}
            {isConductorFunctionality && (
              <Link to="/staff/occupancy" className={`nav-item ${isActive('/occupancy') ? 'active' : ''}`}>
                📊 Occupancy Management
              </Link>
            )}
            <Link to="/staff/reports" className={`nav-item ${isActive('/reports') ? 'active' : ''}`}>
              📝 Operational Reports
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/staff/trip-control" />} />
          {isDriveFunctionality && <Route path="trip-control" element={<TripControlPage />} />}
          {isConductorFunctionality && <Route path="occupancy" element={<OccupancyPage />} />}
          <Route path="reports" element={<ReportsPage />} />
        </Routes>
      </main>
    </div>
  );
}
