import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';

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
  } = useAppStore();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 w-full px-margin-desktop flex items-center justify-between gap-space-md">
          {/* Left Section: Logo & Branding */}
          <div className="flex items-center gap-space-lg">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
                <span className="material-symbols-outlined text-[20px]">directions_bus</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md tracking-tight text-on-surface leading-none">
                  TransitTech
                </span>
                <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase mt-0.5">
                  AITR Campus • Indore
                </span>
              </div>
            </div>

            {/* Portal Navigation (Desktop) */}
            <nav className="hidden xl:flex items-center gap-space-xs ml-space-xl">
              <button
                onClick={() => setCurrentPortal('passenger')}
                className={`px-space-md py-space-xs font-label-lg text-label-lg transition-colors rounded-lg ${
                  currentPortal === 'passenger'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                Passenger Portal
              </button>
              <button
                onClick={() => setCurrentPortal('staff')}
                className={`px-space-md py-space-xs font-label-lg text-label-lg transition-colors rounded-lg ${
                  currentPortal === 'staff'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                Transport Staff Portal
              </button>
              <button
                onClick={() => setCurrentPortal('admin')}
                className={`px-space-md py-space-xs font-label-lg text-label-lg transition-colors rounded-lg ${
                  currentPortal === 'admin'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                Admin Portal
              </button>
            </nav>
          </div>

          {/* Right Section: Shift, Notifications, Profile */}
          <div className="flex items-center gap-space-md">
            {/* Shift Info */}
            <div className="hidden lg:flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container text-on-surface-variant text-label-sm font-label-sm">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              <span className="text-on-surface font-semibold">Shift 1:</span>
              <span>08:20 AM - 02:40 PM</span>
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

            {/* Profile & Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-space-sm pl-space-xs hover:bg-surface-container-low rounded-lg transition-colors p-1"
              >
                <div className="hidden sm:flex flex-col items-end">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-surface-container-high text-on-primary-fixed-variant uppercase tracking-wider text-xs">
                    {currentPortal === 'passenger' && 'Passenger'}
                    {currentPortal === 'staff' && 'Staff'}
                    {currentPortal === 'admin' && 'Admin'}
                  </span>
                </div>
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-container-highest"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1Vdh_2i6-ypCuO_DrFRnRtqbUdO9N7FQV1H_vClIaEcZAS7qSvmcTVYVSK2orFHc3RIPYMPtU1EOerBtfUpPcqxpdZTcZeOncSICWtuzVmUpeuvhDdiHSid5Pon6bhjzUzwrhxuhUC21GdPFomd1nxHh5siVav2It53HUVvqZr7YhoDEzcbHDMeuc6pbSKPmkxgt1FpTkCydOqxtA26a_FOoMCaVA9Xc3s4n65RILNrKg7ksolY5LDDuRw22oI1vqPHECrEd_XqlhQ"
                />
              </button>

              {/* Profile Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-surface-container-lowest shadow-lg border border-surface-container overflow-hidden z-50">
                  {/* Profile Info */}
                  <div className="px-space-md py-space-lg border-b border-surface-container bg-surface-container-low">
                    <p className="font-label-lg text-label-lg font-bold text-on-surface">Demo User</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {currentPortal === 'passenger' && 'Campus Passenger'}
                      {currentPortal === 'staff' && 'Transport Staff'}
                      {currentPortal === 'admin' && 'System Administrator'}
                    </p>
                    <p className="font-label-sm text-label-sm text-outline mt-2 uppercase tracking-wider">
                      Demo Mode Active
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-space-sm">
                    <a
                      href="#"
                      className="px-space-md py-space-sm flex items-center gap-space-sm text-on-surface hover:bg-surface-container-low transition-colors font-body-sm"
                    >
                      <span className="material-symbols-outlined text-[18px] text-outline">settings</span>
                      Demo Settings
                    </a>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleResetDemo();
                      }}
                      className="w-full text-left px-space-md py-space-sm flex items-center gap-space-sm text-error hover:bg-error-container/20 transition-colors font-body-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                      Reset Demo Data
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="px-space-md py-space-sm border-t border-surface-container bg-surface-container-low text-center text-label-sm text-on-surface-variant">
                    <p>TransitTech v1.0 • Local Demo</p>
                  </div>
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

      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </>
  );
}
