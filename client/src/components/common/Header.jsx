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
  const [showPortalMenu, setShowPortalMenu] = useState(false);

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
          {/* Left Section: Acropolis Logo */}
          <div className="flex items-center gap-space-lg">
            <div className="flex items-center gap-space-sm">
              {/* Acropolis Logo */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white shadow-md font-bold text-lg">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md tracking-tight text-on-surface leading-none">
                  AITR Campus Transit
                </span>
                <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase mt-0.5">
                  Passenger Network
                </span>
              </div>
            </div>
          </div>

          {/* Right Section: Portal Menu, Notifications, Profile */}
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
                    <p>AITR Transit • v1.0 Demo</p>
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

      {showPortalMenu && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setShowPortalMenu(false)}
        />
      )}
    </>
  );
}
