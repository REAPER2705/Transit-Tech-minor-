import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const {
    currentPortal,
    setCurrentPortal,
    notificationPanelOpen,
    setNotificationPanelOpen,
    notifications,
    getUnreadNotifications,
    markNotificationRead,
    resetDemoData,
    activeNavTab,
    setActiveNavTab,
  } = useAppStore();

  const unreadCount = getUnreadNotifications().length;

  const handleResetDemo = () => {
    if (window.confirm('Reset all demo data to initial state? This will clear all changes.')) {
      resetDemoData();
      setShowProfileMenu(false);
    }
  };

  const handleNotificationClick = (notifId) => {
    markNotificationRead(notifId);
  };

  const handlePortalSelect = (portal) => {
    setCurrentPortal(portal);
    setShowPortalMenu(false);
  };

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 w-full px-margin-desktop flex items-center justify-between gap-space-md">
          {/* Left Section: Acropolis Logo + Navigation */}
          <div className="flex items-center gap-space-lg">
            <div className="flex items-center gap-space-sm">
              {/* Acropolis Logo Image */}
              <img
                src="/images/acropolis.jpg"
                alt="Acropolis Institute"
                className="w-11 h-11 rounded-lg object-cover shadow-md border border-surface-container"
              />
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md tracking-tight text-on-surface leading-none">
                  AITR Campus Transit
                </span>
                <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase mt-0.5">
                  {currentPortal === 'passenger' ? 'Passenger Network' : currentPortal === 'staff' ? 'Transport Staff' : 'Admin System'}
                </span>
              </div>
            </div>

            {/* Navigation Sections - Different for each portal */}
            <div className="hidden lg:flex items-center gap-space-md ml-space-lg border-l border-surface-container pl-space-lg">
              {currentPortal === 'passenger' && (
                <>
                  <button 
                    onClick={() => setActiveNavTab('tracking')}
                    className={`flex items-center gap-space-xs px-space-md py-space-xs rounded-lg transition-colors font-label-md text-label-md ${
                      activeNavTab === 'tracking' 
                        ? 'text-on-surface bg-surface-container' 
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                    <span>Live Tracking</span>
                  </button>
                  <button 
                    onClick={() => setActiveNavTab('schedules')}
                    className={`flex items-center gap-space-xs px-space-md py-space-xs rounded-lg transition-colors font-label-md text-label-md ${
                      activeNavTab === 'schedules' 
                        ? 'text-on-surface bg-surface-container' 
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">route</span>
                    <span>Routes & Schedules</span>
                  </button>
                  <button 
                    onClick={() => setActiveNavTab('complaints')}
                    className={`flex items-center gap-space-xs px-space-md py-space-xs rounded-lg transition-colors font-label-md text-label-md ${
                      activeNavTab === 'complaints' 
                        ? 'text-on-surface bg-surface-container' 
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">feedback</span>
                    <span>Complaints</span>
                  </button>
                </>
              )}
              {currentPortal === 'staff' && (
                <>
                  <button className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md">
                    <span className="material-symbols-outlined text-[20px]">directions_bus</span>
                    <span>Driver</span>
                  </button>
                  <button className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md">
                    <span className="material-symbols-outlined text-[20px]">groups</span>
                    <span>Conductor</span>
                  </button>
                </>
              )}
              {currentPortal === 'admin' && (
                <>
                  <button className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md">
                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    <span>Dashboard</span>
                  </button>
                  <button className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                    <span>Management</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Section: Portal Menu, Notifications */}
          <div className="flex items-center gap-space-md">
            {/* Portal Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPortalMenu(!showPortalMenu)}
                className="px-space-md py-space-xs font-label-lg text-label-lg transition-colors rounded-lg flex items-center gap-space-xs hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">apps</span>
                <span className="hidden sm:inline">Portal</span>
                <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
              </button>

              {/* Portal Menu Dropdown */}
              {showPortalMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface-container-lowest shadow-lg border border-surface-container overflow-hidden z-50">
                  <button
                    onClick={() => handlePortalSelect('passenger')}
                    className={`w-full text-left px-space-md py-space-sm font-body-sm transition-colors flex items-center gap-space-sm ${
                      currentPortal === 'passenger'
                        ? 'bg-primary-container text-on-primary'
                        : 'hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined">person</span>
                    <div>
                      <div className="font-label-md text-label-md font-bold">Passenger Portal</div>
                      <div className="text-label-xs text-on-surface-variant">Track & Book</div>
                    </div>
                    {currentPortal === 'passenger' && (
                      <span className="material-symbols-outlined ml-auto">check_circle</span>
                    )}
                  </button>
                  <button
                    onClick={() => handlePortalSelect('staff')}
                    className={`w-full text-left px-space-md py-space-sm font-body-sm transition-colors flex items-center gap-space-sm border-t border-surface-container ${
                      currentPortal === 'staff'
                        ? 'bg-primary-container text-on-primary'
                        : 'hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined">groups</span>
                    <div>
                      <div className="font-label-md text-label-md font-bold">Transport Staff</div>
                      <div className="text-label-xs text-on-surface-variant">Manage Operations</div>
                    </div>
                    {currentPortal === 'staff' && (
                      <span className="material-symbols-outlined ml-auto">check_circle</span>
                    )}
                  </button>
                  <button
                    onClick={() => handlePortalSelect('admin')}
                    className={`w-full text-left px-space-md py-space-sm font-body-sm transition-colors flex items-center gap-space-sm border-t border-surface-container ${
                      currentPortal === 'admin'
                        ? 'bg-primary-container text-on-primary'
                        : 'hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined">admin_panel_settings</span>
                    <div>
                      <div className="font-label-md text-label-md font-bold">Admin Portal</div>
                      <div className="text-label-xs text-on-surface-variant">System Control</div>
                    </div>
                    {currentPortal === 'admin' && (
                      <span className="material-symbols-outlined ml-auto">check_circle</span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
                className="relative p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest"></span>
                )}
              </button>

              {/* Notification Panel */}
              {notificationPanelOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 max-h-96 rounded-xl bg-surface-container-lowest shadow-lg border border-surface-container overflow-hidden flex flex-col z-50">
                  {/* Header */}
                  <div className="px-space-md py-space-sm border-b border-surface-container bg-surface-container-low flex items-center justify-between">
                    <span className="font-label-lg text-label-lg font-bold text-on-surface">
                      Notifications {unreadCount > 0 && `(${unreadCount})`}
                    </span>
                    <button
                      onClick={() => setNotificationPanelOpen(false)}
                      className="text-on-surface-variant hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className="flex-1 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 8).map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif.id)}
                          className={`w-full text-left px-space-md py-space-sm border-b border-surface-container hover:bg-surface-container-low transition-colors ${
                            !notif.read ? 'bg-primary-fixed/20' : ''
                          }`}
                        >
                          <div className="flex items-start gap-space-sm">
                            <div className="flex-1 min-w-0">
                              <p className="font-label-md text-label-md text-on-surface font-bold text-sm">
                                {notif.title || notif.type}
                              </p>
                              <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5 line-clamp-2">
                                {notif.message || notif.description}
                              </p>
                              <p className="font-label-sm text-label-sm text-outline text-xs mt-1">
                                {new Date(notif.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                            {!notif.read && (
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-space-md py-space-lg text-center text-on-surface-variant text-body-sm">
                        No notifications
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-space-md py-space-sm border-t border-surface-container bg-surface-container-low text-center">
                      <button className="font-label-sm text-label-sm text-primary hover:text-primary-fixed">
                        View All Notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification Backdrop (Close on click) */}
      {notificationPanelOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setNotificationPanelOpen(false)}
        />
      )}

      {showPortalMenu && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setShowPortalMenu(false)}
        />
      )}
    </>
  );
}
