import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';

export default function Header() {
  const {
    currentPortal,
    setCurrentPortal,
    userRole,
    setUserRole,
    notifications,
  } = useAppStore();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handlePortalSwitch = (portal) => {
    setCurrentPortal(portal);
    setShowRoleDropdown(false);
  };

  const handleRoleChange = (role, portal) => {
    setUserRole(role);
    setCurrentPortal(portal);
    setShowRoleDropdown(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1520px] mx-auto h-16 px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => handlePortalSwitch('passenger')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
              <img
                alt="Acropolis Logo"
                className="h-full w-full object-contain transform group-hover:scale-105 transition-transform duration-200"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOsYMNqy38cuzcERUMGoR3DxGBqM6so3b-YxhgKCv4Yo-ivqOwSqnKoY68Pee-M2HGGhbHgvYgct3Wrou4W4jsi55EKOx3_77z8G7aX9NuPgQ_jugAJ1tN8Lhs9eXOZ08g9Ux3-QiuKhlsFP9Mi7XilsGJW8AWoqW1UuK6QoUcly0ofRLMUyZY0GrJTNZHfCv4ijUprpZdqPyCwFkZnwcC9qYeWqJ_SlM5VzvOGu5qN_Bfp0CtNVrzwe5fuObNpo8B4OE"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  TransitTech
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  AITR
                </span>
              </div>
              <span className="text-[10.5px] text-slate-500 font-medium tracking-tight mt-0.5">
                Acropolis Indore Fleet Ops
              </span>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold p-1 bg-slate-100 rounded-full border border-slate-200">
          {[
            { id: 'passenger', label: 'Passenger Portal' },
            { id: 'staff', label: 'Transport Staff Portal' },
            { id: 'admin', label: 'Admin Portal' },
          ].map((portal) => (
            <button
              key={portal.id}
              onClick={() => handlePortalSwitch(portal.id)}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-2 font-bold ${
                currentPortal === portal.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {currentPortal === portal.id && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
              <span>{portal.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Utilities */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <svg
              className="w-5 h-5"
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
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[9px] font-bold ring-2 ring-white">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Role Switcher */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-bold transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="hidden sm:inline">{userRole}</span>
                <svg
                  className="w-3.5 h-3.5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 tracking-wider">
                    Switch Active Role
                  </div>
                  {[
                    { role: 'Passenger (Shift 1)', portal: 'passenger' },
                    { role: 'Transport Officer (Driver)', portal: 'staff' },
                    { role: 'Fleet Conductor', portal: 'staff' },
                    { role: 'Admin Desk', portal: 'admin' },
                  ].map((option) => (
                    <button
                      key={option.role}
                      onClick={() => handleRoleChange(option.role, option.portal)}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span>{option.role}</span>
                      {userRole === option.role && (
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
