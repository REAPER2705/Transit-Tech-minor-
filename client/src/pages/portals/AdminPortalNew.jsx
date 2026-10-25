import { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import authStore from '../../store/authStore';
import UserManagementPage from '../admin/UserManagementPage';
import BusManagementPage from '../admin/BusManagementPage';
import RouteManagementPage from '../admin/RouteManagementPage';
import ScheduleManagementPage from '../admin/ScheduleManagementPage';
import AssignmentManagementPage from '../admin/AssignmentManagementPage';
import ImportManagementPage from '../admin/ImportManagementPage';
import ComplaintManagementPage from '../admin/ComplaintManagementPage';
import AuditLogsPage from '../admin/AuditLogsPage';

export default function AdminPortalNew() {
  const { user, clearAuth } = authStore();
  const location = useLocation();

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
              <div className="bg-red-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">TransitTech</h1>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{user?.displayName}</p>
                <p className="text-xs text-gray-500">Administrator</p>
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
          <div className="flex space-x-1 border-t border-white/20 -mx-4 px-4 pt-2 overflow-x-auto">
            <Link to="/admin/users" className={`nav-item text-sm ${isActive('/users') ? 'active' : ''}`}>
              👥 Users
            </Link>
            <Link to="/admin/buses" className={`nav-item text-sm ${isActive('/buses') ? 'active' : ''}`}>
              🚌 Buses
            </Link>
            <Link to="/admin/routes" className={`nav-item text-sm ${isActive('/routes') ? 'active' : ''}`}>
              🗺️ Routes
            </Link>
            <Link to="/admin/schedules" className={`nav-item text-sm ${isActive('/schedules') ? 'active' : ''}`}>
              📅 Schedules
            </Link>
            <Link to="/admin/assignments" className={`nav-item text-sm ${isActive('/assignments') ? 'active' : ''}`}>
              📍 Assignments
            </Link>
            <Link to="/admin/imports" className={`nav-item text-sm ${isActive('/imports') ? 'active' : ''}`}>
              📥 Imports
            </Link>
            <Link to="/admin/complaints" className={`nav-item text-sm ${isActive('/complaints') ? 'active' : ''}`}>
              ⚠️ Complaints
            </Link>
            <Link to="/admin/audit-logs" className={`nav-item text-sm ${isActive('/audit-logs') ? 'active' : ''}`}>
              📋 Audit Logs
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/users" />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="buses" element={<BusManagementPage />} />
          <Route path="routes" element={<RouteManagementPage />} />
          <Route path="schedules" element={<ScheduleManagementPage />} />
          <Route path="assignments" element={<AssignmentManagementPage />} />
          <Route path="imports" element={<ImportManagementPage />} />
          <Route path="complaints" element={<ComplaintManagementPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
        </Routes>
      </main>
    </div>
  );
}
