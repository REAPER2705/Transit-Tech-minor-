import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import authStore from '../../store/authStore';
import UserManagement from '../../components/admin/UserManagement';
import BusManagement from '../../components/admin/BusManagement';
import RouteManagement from '../../components/admin/RouteManagement';
import ScheduleManagement from '../../components/admin/ScheduleManagement';
import AssignmentManagement from '../../components/admin/AssignmentManagement';
import ImportManagement from '../../components/admin/ImportManagement';
import ComplaintManagement from '../../components/admin/ComplaintManagement';
import AuditLogs from '../../components/admin/AuditLogs';

export default function AdminPortal() {
  const { user, clearAuth } = authStore();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

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
              <div className="bg-red-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">TransitTech</h1>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
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

          {/* Sub-navigation */}
          <div className="flex space-x-2 border-t border-white/20 -mx-4 px-4 pt-2 overflow-x-auto">
            <Link
              to="/admin/users"
              className={`nav-item whitespace-nowrap ${isActive('/users') ? 'active' : ''}`}
            >
              👥 Users
            </Link>
            <Link
              to="/admin/buses"
              className={`nav-item whitespace-nowrap ${isActive('/buses') ? 'active' : ''}`}
            >
              🚌 Buses
            </Link>
            <Link
              to="/admin/routes"
              className={`nav-item whitespace-nowrap ${isActive('/routes') ? 'active' : ''}`}
            >
              🗺️ Routes
            </Link>
            <Link
              to="/admin/schedules"
              className={`nav-item whitespace-nowrap ${isActive('/schedules') ? 'active' : ''}`}
            >
              📅 Schedules
            </Link>
            <Link
              to="/admin/assignments"
              className={`nav-item whitespace-nowrap ${isActive('/assignments') ? 'active' : ''}`}
            >
              📍 Assignments
            </Link>
            <Link
              to="/admin/imports"
              className={`nav-item whitespace-nowrap ${isActive('/imports') ? 'active' : ''}`}
            >
              📥 Imports
            </Link>
            <Link
              to="/admin/complaints"
              className={`nav-item whitespace-nowrap ${isActive('/complaints') ? 'active' : ''}`}
            >
              ⚠️ Complaints
            </Link>
            <Link
              to="/admin/audit-logs"
              className={`nav-item whitespace-nowrap ${isActive('/audit-logs') ? 'active' : ''}`}
            >
              📋 Audit Logs
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/users" />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="buses" element={<BusManagement />} />
          <Route path="routes" element={<RouteManagement />} />
          <Route path="schedules" element={<ScheduleManagement />} />
          <Route path="assignments" element={<AssignmentManagement />} />
          <Route path="imports" element={<ImportManagement />} />
          <Route path="complaints" element={<ComplaintManagement />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Routes>
      </main>
    </div>
  );
}
