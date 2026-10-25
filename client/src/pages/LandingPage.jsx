import React from 'react';
import { useAppStore } from '../store/appStore';

const campusImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuALy9stFksMSbi4cvNyeJEngWTykzVZ8Sq-G-rPvXqDoptTC-pfmBFp4F5TQ-W4ThxEXPh8HIpBK_OKC8qo4YyA8sc4ztkaivB6krmxE1mLVIfHtfAcaJP9E7F_7K9cwOs7vRmFRjkY6Av9yfpzLcgPPrZiirIafX1OX_pHdutBHXA4ZQuaDLZTStUxBQDCj69BW1-7KfEQsjBFpNz1dlakLtOOibLa-87Sl4yeWb84Ohe_l8hiGZX2CZ1uvIqX3mHfEoc';

export default function LandingPage() {
  const { setCurrentPortal, routes } = useAppStore();

  const handleEnterPortal = (portal) => {
    setCurrentPortal(portal);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1520px] mx-auto h-16 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center">
              <img
                alt="Acropolis Logo"
                className="h-full w-full object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOsYMNqy38cuzcERUMGoR3DxGBqM6so3b-YxhgKCv4Yo-ivqOwSqnKoY68Pee-M2HGGhbHgvYgct3Wrou4W4jsi55EKOx3_77z8G7aX9NuPgQ_jugAJ1tN8Lhs9eXOZ08g9Ux3-QiuKhlsFP9Mi7XilsGJW8AWoqW1UuK6QoUcly0ofRLMUyZY0GrJTNZHfCv4ijUprpZdqPyCwFkZnwcC9qYeWqJ_SlM5VzvOGu5qN_Bfp0CtNVrzwe5fuObNpo8B4OE"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">TransitTech</span>
              <span className="text-[10.5px] text-slate-500 font-medium">Acropolis Indore</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <a href="#routes" className="text-slate-600 hover:text-slate-900 transition">
              Routes
            </a>
            <a href="#portals" className="text-slate-600 hover:text-slate-900 transition">
              Portals
            </a>
            <button
              onClick={() => handleEnterPortal('passenger')}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url('${campusImageUrl}')` }}
        ></div>

        <div className="max-w-[1520px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.2] tracking-tight">
                  Your Campus. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                    Your Journey.
                  </span>
                  <br /> Connected.
                </h1>
              </div>
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                Real-time bus tracking, verified schedules, and seamless campus mobility for AITR Indore. Track your assigned bus, explore routes, and stay informed.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleEnterPortal('passenger')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span>Start Tracking</span>
                </button>
                <a
                  href="#routes"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-slate-900 font-bold border-2 border-slate-200 hover:border-blue-600 transition"
                >
                  <span>Explore Routes</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100">
                  <img
                    alt="Campus"
                    src={campusImageUrl}
                    className="w-full h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Routes Section */}
      <section id="routes" className="py-20 px-4 md:px-8 bg-white border-t border-slate-200">
        <div className="max-w-[1520px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Available Routes</h2>
            <p className="text-lg text-slate-600">Explore the campus transit network</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {routes.map((route) => (
              <div
                key={route.id}
                className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{route.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{route.description}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                    {route.stops.length} Stops
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-blue-100">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold">Distance</span>
                    <p className="text-lg font-bold text-slate-900 mt-1">{route.distance} km</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold">Duration</span>
                    <p className="text-lg font-bold text-slate-900 mt-1">{route.estimatedDuration} mins</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold">Active Buses</span>
                    <p className="text-lg font-bold text-slate-900 mt-1">{route.activeBuses.length}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-[1520px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-lg text-slate-600">Three simple steps to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔍',
                title: 'Find Your Bus',
                description: 'View your assigned bus and real-time location on the interactive map.',
              },
              {
                icon: '📍',
                title: 'Check Your Route',
                description: 'See all stops, schedules, and estimated arrival times.',
              },
              {
                icon: '✅',
                title: 'Stay Informed',
                description: 'Receive notifications and track occupancy in real-time.',
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-8 -right-4 items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section id="portals" className="py-20 px-4 md:px-8 bg-white border-t border-slate-200">
        <div className="max-w-[1520px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Portal Access</h2>
            <p className="text-lg text-slate-600">Select your role to access the appropriate portal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Passenger Portal',
                icon: '👤',
                description: 'Track your assigned bus, check schedules, submit requests.',
                actions: [
                  'Live bus tracking',
                  'Route & schedule browsing',
                  'Seat availability',
                  'Submit requests & complaints',
                ],
                color: 'blue',
                onClick: () => handleEnterPortal('passenger'),
              },
              {
                title: 'Transport Staff Portal',
                icon: '🚗',
                description: 'Manage trips, occupancy, and GPS sharing.',
                actions: [
                  'Trip control (start/end)',
                  'Occupancy management',
                  'GPS sharing',
                  'Issue reporting',
                ],
                color: 'green',
                onClick: () => handleEnterPortal('staff'),
              },
              {
                title: 'Admin Portal',
                icon: '⚙️',
                description: 'Manage buses, routes, assignments, and data.',
                actions: [
                  'Fleet management',
                  'Route configuration',
                  'Staff assignments',
                  'Data imports & exports',
                ],
                color: 'purple',
                onClick: () => handleEnterPortal('admin'),
              },
            ].map((portal, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br from-${portal.color}-50 to-slate-50 rounded-2xl p-8 border-2 border-${portal.color}-200 hover:shadow-lg transition`}
              >
                <div className="text-5xl mb-4">{portal.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{portal.title}</h3>
                <p className="text-slate-600 mb-6">{portal.description}</p>
                <ul className="space-y-2 mb-8">
                  {portal.actions.map((action, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-700">
                      <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {action}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={portal.onClick}
                  className={`w-full px-4 py-3 rounded-lg bg-${portal.color}-600 text-white font-bold hover:bg-${portal.color}-700 transition`}
                >
                  Enter {portal.title.split(' ')[0]} Portal
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 md:px-8">
        <div className="max-w-[1520px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-3">TransitTech</h3>
              <p className="text-slate-400">Campus bus tracking and fleet management system for Acropolis Institute of Technology & Research.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Contact</h3>
              <p className="text-slate-400">Acropolis Institute of Technology & Research<br />Indore, Madhya Pradesh, India</p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>© 2025 TransitTech. All rights reserved. | <a href="#" className="hover:text-white transition">Privacy Policy</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
