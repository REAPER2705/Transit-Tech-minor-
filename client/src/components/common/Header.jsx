import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';

export default function Header() {
  const { currentPortal, setCurrentPortal } = useAppStore();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 w-full px-margin-desktop flex items-center justify-between gap-space-md">
        {/* Logo & Branding */}
        <div className="flex items-center gap-space-lg">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[20px]">directions_bus</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md tracking-tight text-on-surface leading-none">TransitTech</span>
              <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase mt-0.5">AITR Campus • Indore</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden xl:flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary font-label-lg rounded-lg">
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

        {/* Right Section */}
        <div className="flex items-center gap-space-md">
          {/* Search */}
          <div className="hidden md:flex items-center gap-space-sm px-space-md py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant text-label-md font-label-md w-56 justify-between cursor-pointer hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[18px] text-outline">search</span>
              <span>Search routes, stops...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface text-[10px] font-bold font-mono">⌘K</kbd>
          </div>

          {/* Shift Info */}
          <div className="hidden lg:flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container text-on-surface-variant text-label-sm font-label-sm">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="text-on-surface font-semibold">Shift 1:</span>
            <span>08:20 AM - 02:40 PM</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest"></span>
          </button>

          {/* User Section */}
          <div className="flex items-center gap-space-sm pl-space-xs">
            <div className="hidden sm:flex flex-col items-end">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-surface-container-high text-on-primary-fixed-variant uppercase tracking-wider">
                Passenger
              </span>
            </div>
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-container-highest"
              src="https://lh3.googleusercontent.com/aida/AEtjO1Vdh_2i6-ypCuO_DrFRnRtqbUdO9N7FQV1H_vClIaEcZAS7qSvmcTVYVSK2orFHc3RIPYMPtU1EOerBtfUpPcqxpdZTcZeOncSICWtuzVmUpeuvhDdiHSid5Pon6bhjzUzwrhxuhUC21GdPFomd1nxHh5siVav2It53HUVvqZr7YhoDEzcbHDMeuc6pbSKPmkxgt1FpTkCydOqxtA26a_FOoMCaVA9Xc3s4n65RILNrKg7ksolY5LDDuRw22oI1vqPHECrEd_XqlhQ"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
