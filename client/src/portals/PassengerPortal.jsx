import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';

export default function PassengerPortal() {
  const [activeTab, setActiveTab] = useState('tracking');
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintData, setComplaintData] = useState({ category: '', description: '' });
  const [selectedBusId, setSelectedBusId] = useState('G-47'); // Track which bus is selected
  const [filterRoute, setFilterRoute] = useState('all'); // Filter buses by route
  const [selectedShift, setSelectedShift] = useState('shift1'); // Track selected shift
  const [selectedScheduleBusId, setSelectedScheduleBusId] = useState('G-10'); // Track selected bus in schedules tab
  const [expandedBusId, setExpandedBusId] = useState(null); // Track which bus is expanded showing timeline

  // Connect to store
  const { buses, routes, complaints, addComplaint, addNotification } = useAppStore();

  // Get selected bus from store, or default to G-47
  const currentBus = buses.find(b => b.id === selectedBusId) || buses.find(b => b.id === 'G-47') || {
    id: 'G-47',
    route: 'Navlakha Bus Stand → Acropolis Institute',
    line: 'Route 1',
    gpsStatus: 'UNAVAILABLE',
    currentOccupancy: 38,
    capacity: 50,
    nextStop: 'Palasia Chouraha',
    lastOccupancyUpdate: new Date(Date.now() - 3 * 60000),
    dataSourceNote: 'Historical Timetable - Sept 2023 | GPS Position Simulated',
  };

  // Get route info for current bus
  const currentRoute = routes.find(r => r.id === currentBus.assignedRoute) || {
    id: 'ROUTE-NAVLAKHA-ACROPOLIS',
    name: 'Navlakha Bus Stand → Acropolis Institute',
    number: 'Route 1',
  };

  // Get all ACTIVE buses, filtered by route if filter is applied
  const activeBuses = filterRoute === 'all' 
    ? buses.filter(b => b.status === 'ACTIVE')
    : buses.filter(b => b.status === 'ACTIVE' && b.assignedRoute === filterRoute);

  // Get alternative buses on the same route as currently selected bus (excluding selected bus)
  const alternativeBuses = buses
    .filter(b => 
      b.id !== selectedBusId && 
      b.status === 'ACTIVE' && 
      b.assignedRoute === currentBus.assignedRoute
    )
    .map(bus => ({
      id: bus.id,
      name: `Bus Unit ${bus.id}`,
      eta: Math.floor(Math.random() * 20) + 5, // Random 5-25 mins for demo
      seats: Math.max(0, bus.capacity - bus.currentOccupancy),
      occupancy: bus.currentOccupancy,
      capacity: bus.capacity,
    }))
    .sort((a, b) => a.eta - b.eta) // Sort by ETA
    .slice(0, 2); // Show top 2 alternatives

  const handleComplaintSubmit = () => {
    if (!complaintData.category || !complaintData.description) {
      alert('Please select a category and describe your concern');
      return;
    }

    // Check for duplicate complaints (same category and description within last 5 minutes)
    const recentDuplicate = complaints.find(
      (c) =>
        c.category === complaintData.category &&
        c.description === complaintData.description &&
        new Date(c.createdAt) > new Date(Date.now() - 5 * 60 * 1000)
    );

    if (recentDuplicate) {
      alert('You already submitted this complaint recently. Please wait before resubmitting.');
      return;
    }

    // Submit complaint to store
    addComplaint({
      category: complaintData.category,
      description: complaintData.description,
      submittedBy: 'PASSENGER',
      relatedBus: selectedBusId,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    });

    // Add notification
    addNotification({
      type: 'COMPLAINT_SUBMITTED',
      title: 'Complaint Submitted',
      message: `Your ${complaintData.category} complaint has been recorded and assigned reference ID. Our transport office will review it shortly.`,
      read: false,
      createdAt: new Date().toISOString(),
    });

    // Clear form and close
    setComplaintData({ category: '', description: '' });
    setShowComplaintForm(false);

    // Show success feedback
    alert('Complaint submitted successfully! Reference ID will be provided via notification.');
  };



  return (
    <div className="w-full pt-16 bg-surface min-h-screen">
      {/* HERO SECTION WITH AITR BUILDING IMAGE */}
      <div
        className="w-full h-96 bg-cover bg-center relative shadow-lg"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDuufXekciwjl6pejt5EuQzj4S4VIVgQuaJ-vEgHsryQYsXXAyIit_Xk41X3yv8jfd8-ZRPO5fIVm8K_4lrAMW1SYnpTfmlzWSuzKy5i632o_WUShbKnCJufHcpxf8yfek7D5LybC3Dc6UgOGutV9N4FfVdemKAjAkQBcoxByRlSoKlyV3Yrl5Atkyy-TMJ3qgYwO0vvZ2q3STrmDVhG7lm5bvU23mxDxBtW7IvbT82xHDLPQfpNKYiVg')`,
          backgroundPosition: 'center center',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h1 className="font-headline-lg text-headline-lg md:text-4xl font-bold mb-4">AITR Campus Transit Network</h1>
          <p className="font-body-lg text-body-lg md:text-xl max-w-2xl">Real-time tracking for seamless campus mobility across Indore</p>
        </div>
      </div>

      {/* Top Navigation Bar */}
      <div className="px-margin-desktop py-space-md bg-surface-container-low shadow-sm sticky top-20 z-40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
          <div className="flex flex-wrap items-center gap-space-xs">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`tab-btn px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-space-xs transition-all ${
                activeTab === 'tracking'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">near_me</span>
              <span>Live Tracking Map</span>
            </button>

            <button
              onClick={() => setActiveTab('schedules')}
              className={`tab-btn px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-space-xs transition-all ${
                activeTab === 'schedules'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Routes & Schedules</span>
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`tab-btn px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-space-xs transition-all ${
                activeTab === 'actions'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
              <span>Requests & Complaints</span>
            </button>
          </div>
          <div className="flex items-center gap-space-md text-label-sm font-label-sm">
            <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-highest text-on-primary-fixed-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
              <span>TELEMETRY ACTIVE: DUAL BAND L1/L5</span>
            </div>
            <div className="text-on-surface-variant hidden sm:block">
              Campus Geo-Zone: <span className="font-bold text-on-surface">AITR Indore Central</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'tracking' && (
        <div className="px-margin-desktop py-space-lg grid grid-cols-1 xl:grid-cols-12 gap-gutter-desktop">
          {/* Left: Map Section (8 cols) */}
          <div className="xl:col-span-8 flex flex-col gap-space-md">
            {/* Interactive Map */}
            <div className="relative w-full rounded-xl bg-surface-container overflow-hidden shadow-md" style={{ minHeight: '580px' }}>
              <div className="absolute inset-0 bg-[#f4f7f6]">
                <svg
                  className="w-full h-full opacity-90"
                  preserveAspectRatio="none"
                  viewBox="0 0 1000 600"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="campus-grid" patternUnits="userSpaceOnUse" width="40" height="40">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e6ece9" strokeWidth="1"></path>
                    </pattern>
                  </defs>
                  <rect fill="#f3f6f4" height="600" width="1000"></rect>
                  <rect fill="url(#campus-grid)" height="600" width="1000"></rect>
                  {/* Green areas */}
                  <path d="M 40 40 Q 180 30 260 120 T 140 320 Z" fill="#d8edd9" opacity="0.8"></path>
                  <path d="M 680 80 Q 920 60 940 280 T 720 340 Z" fill="#d2e8d4" opacity="0.8"></path>
                  <path d="M 460 380 Q 640 360 620 540 T 380 520 Z" fill="#dbeee0" opacity="0.75"></path>
                  <circle cx="210" cy="460" fill="#e0f2e4" opacity="0.7" r="90"></circle>

                  {/* Building markers */}
                  <rect fill="#ffffff" height="85" rx="6" stroke="#cdd9d2" strokeWidth="1.5" width="140" x="120" y="80"></rect>
                  <text fill="#434655" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" textAnchor="middle" x="190" y="122">
                    CENTRAL LIBRARY
                  </text>
                  <text fill="#737686" fontFamily="Plus Jakarta Sans" fontSize="9" textAnchor="middle" x="190" y="138">
                    Bay 2 Transit Zone
                  </text>

                  {/* Route path */}
                  <path d="M 0 540 L 320 540 L 460 300 L 760 300 L 1000 180" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="26"></path>
                  <path d="M 0 540 L 320 540 L 460 300 L 760 300 L 1000 180" fill="none" stroke="#e0e6ed" strokeLinecap="round" strokeLinejoin="round" strokeWidth="18"></path>

                  {/* Current position marker */}
                  <circle cx="610" cy="300" fill="#ba1a1a" r="7" stroke="#ffffff" strokeWidth="2.5"></circle>
                  <circle cx="610" cy="300" fill="none" opacity="0.4" r="14" stroke="#ba1a1a" strokeWidth="1"></circle>
                  <text fill="#ba1a1a" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="700" textAnchor="middle" x="610" y="280">
                    Central Library Bay 2 (Next)
                  </text>
                </svg>
              </div>

              {/* Dynamic Bus Markers - Show all active buses on map */}
              {activeBuses.map((bus, idx) => {
                const positions = [
                  { top: '284px', left: '520px' }, // Main position
                  { top: '220px', left: '620px' }, // Alt 1
                  { top: '380px', left: '400px' }, // Alt 2
                  { top: '300px', left: '700px' }, // Alt 3
                ];
                const pos = positions[idx % positions.length];
                const isSelected = bus.id === selectedBusId;
                
                return (
                  <div 
                    key={bus.id}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 group cursor-pointer transition-all ${isSelected ? 'z-20' : 'z-10'}`}
                    style={{ top: pos.top, left: pos.left }}
                    onClick={() => setSelectedBusId(bus.id)}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className={`absolute w-12 h-12 rounded-full animate-pulse ${isSelected ? 'bg-yellow-400/40' : 'bg-blue-400/25'}`}></span>
                      <div className={`relative w-9 h-9 rounded-full shadow-lg flex items-center justify-center font-bold text-white ${isSelected ? 'bg-yellow-400 text-slate-900' : 'bg-blue-500'}`}>
                        <span className="material-symbols-outlined text-[20px]">directions_bus</span>
                      </div>
                    </div>
                    <div className={`px-space-sm py-1 rounded backdrop-blur-md shadow-md flex items-center gap-space-xs ${isSelected ? 'bg-inverse-surface/90 text-inverse-on-surface' : 'bg-surface-container/80 text-on-surface'}`}>
                      <span className={`font-label-md text-label-md font-bold ${isSelected ? 'text-yellow-300' : 'text-on-surface'}`}>{bus.id}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-warning' : 'bg-primary'}`}></span>
                      <span className="font-label-sm text-label-sm">
                        {bus.currentOccupancy}/{bus.capacity}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Top-left info card with route selector */}
              <div className="absolute top-4 left-4 max-w-sm rounded-xl bg-surface-container-lowest/95 backdrop-blur-md p-space-md shadow-lg flex flex-col gap-space-md">
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm uppercase">Route</span>
                      <span className="font-label-md text-label-md font-bold text-on-surface">{currentRoute.number}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span>GPS UNAVAILABLE
                    </span>
                  </div>
                  <div className="font-headline-md text-headline-md text-on-surface text-sm">{currentRoute.name}</div>
                </div>
                
                {/* Route filter dropdown */}
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Filter by Route:</label>
                  <select
                    value={filterRoute}
                    onChange={(e) => setFilterRoute(e.target.value)}
                    className="px-space-sm py-1.5 rounded-lg bg-surface-container text-on-surface border border-surface-variant font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Active Routes</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>{r.number} - {r.name}</option>
                    ))}
                  </select>
                </div>
                
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {activeBuses.length} active bus{activeBuses.length !== 1 ? 'es' : ''} on {filterRoute === 'all' ? 'all routes' : 'this route'}. Click marker to select.
                </p>
              </div>

              {/* Bottom telemetry panel */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-[460px] rounded-xl bg-inverse-surface/95 backdrop-blur-xl text-inverse-on-surface p-space-md shadow-xl flex flex-col gap-space-sm">
                <div className="flex items-center justify-between border-b border-surface-variant/20 pb-2">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-error text-[20px]">gps_off</span>
                    <span className="font-label-md text-label-md font-bold tracking-wide uppercase">GPS Telemetry - Unavailable</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-outline-variant">Simulated Demo Data</span>
                </div>
                <div className="grid grid-cols-4 gap-space-xs text-center py-1">
                  <div className="flex flex-col items-center justify-center p-1.5 rounded bg-surface-variant/10">
                    <span className="font-label-sm text-label-sm text-inverse-on-surface/70">STATUS</span>
                    <span className="font-telemetry-metric text-telemetry-metric font-bold text-error">
                      N/A
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-1.5 rounded bg-surface-variant/10">
                    <span className="font-label-sm text-label-sm text-inverse-on-surface/70">SPEED</span>
                    <span className="font-telemetry-metric text-telemetry-metric font-bold text-inverse-on-surface">—</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-1.5 rounded bg-surface-variant/10">
                    <span className="font-label-sm text-label-sm text-inverse-on-surface/70">ETA</span>
                    <span className="font-telemetry-metric text-telemetry-metric font-bold text-inverse-on-surface">
                      — <span className="font-label-sm text-label-sm">mins</span>
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-1.5 rounded bg-surface-variant/10">
                    <span className="font-label-sm text-label-sm text-inverse-on-surface/70">DIST</span>
                    <span className="font-telemetry-metric text-telemetry-metric font-bold text-inverse-on-surface">
                      — <span className="font-label-sm text-label-sm">km</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm pt-1 bg-surface-variant/10 px-2 py-1.5 rounded">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-warning">info</span>
                    <span>
                      Next Stop: <strong>{currentBus.nextStop}</strong>
                    </span>
                  </div>
                  <span className="text-warning font-label-sm text-label-sm">DEMO MODE</span>
                </div>
              </div>

              {/* Zoom controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-1.5">
                <button
                  onClick={() => alert('Zoom in feature coming soon')}
                  className="w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface shadow-md flex items-center justify-center hover:bg-surface-container transition-colors"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
                <button
                  onClick={() => alert('Zoom out feature coming soon')}
                  className="w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface shadow-md flex items-center justify-center hover:bg-surface-container transition-colors"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-[20px]">remove</span>
                </button>
                <button
                  onClick={() => alert('Recenter on your location')}
                  className="w-9 h-9 rounded-lg bg-surface-container-lowest text-primary shadow-md flex items-center justify-center hover:bg-surface-container transition-colors"
                  title="My Location"
                >
                  <span className="material-symbols-outlined text-[20px]">my_location</span>
                </button>
              </div>
            </div>

            {/* Advisory Notice */}
            <div className="rounded-xl bg-surface-container-low p-space-md shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-md">
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">info</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg font-bold text-on-surface">Timetable Advisory Notice</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Please reach your designated campus stop 5 minutes prior to scheduled arrival to ensure uninterrupted dispatch.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-space-xs self-end sm:self-center shrink-0">
                <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">Standard Shift 1 Morning</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="xl:col-span-4 flex flex-col gap-space-lg">
            {/* Bus Details Card */}
            <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Selected Fleet Unit</span>
                  <span className="font-headline-lg text-headline-lg font-bold text-on-surface">Bus Unit {currentBus.id}</span>
                </div>
                <span className={`px-3 py-1 rounded-full font-label-sm text-label-sm font-bold flex items-center gap-1.5 shadow-sm ${
                  currentBus.status === 'ACTIVE' 
                    ? 'bg-emerald-50 text-emerald-800' 
                    : 'bg-amber-50 text-amber-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${currentBus.status === 'ACTIVE' ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`}></span>
                  {currentBus.status}
                </span>
              </div>

              {/* Occupancy Card */}
              <div className="rounded-lg bg-surface-container-low p-space-md flex flex-col gap-space-sm">
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Confirmed Occupancy:</span>
                  <span className="font-bold text-on-surface font-headline-md text-headline-md">
                    {currentBus.currentOccupancy} / {currentBus.capacity} <span className="text-body-sm font-normal text-on-surface-variant">Seats</span>
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden flex">
                  <div 
                    className="bg-primary h-full transition-all duration-500" 
                    style={{ width: `${(currentBus.currentOccupancy / currentBus.capacity) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-emerald-500 h-full opacity-60 transition-all duration-500" 
                    style={{ width: `${((currentBus.capacity - currentBus.currentOccupancy) / currentBus.capacity) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-label-sm font-label-sm pt-1">
                  <span className="text-primary font-bold">{Math.round((currentBus.currentOccupancy / currentBus.capacity) * 100)}% Seating Filled</span>
                  <span className="text-tertiary font-bold">{currentBus.capacity - currentBus.currentOccupancy} Seats Remaining</span>
                </div>
              </div>

              {/* Capacity Details */}
              <div className="grid grid-cols-2 gap-space-sm text-body-sm font-body-sm">
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5">
                  <span className="font-label-sm text-label-sm text-outline uppercase">Stated Capacity</span>
                  <span className="font-bold text-on-surface">{currentBus.capacity} Seats + {currentBus.staffCapacity} Officers</span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5">
                  <span className="font-label-sm text-label-sm text-outline uppercase">Last Update</span>
                  <span className="font-bold text-on-surface">
                    {currentBus.lastOccupancyUpdate 
                      ? Math.round((Date.now() - new Date(currentBus.lastOccupancyUpdate).getTime()) / 60000) + ' mins ago'
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>

              {/* Route Assignment */}
              <div className="rounded-lg bg-surface-container-low p-space-sm flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-outline uppercase">Assigned Route</span>
                <span className="font-bold text-on-surface">{currentRoute.number}: {currentRoute.name}</span>
              </div>
            </div>

            {/* Alternative Buses Card */}
            <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">Alternative Fleet Units</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Parallel buses along Palasia – Bypass axis</span>
                </div>
                <span className="material-symbols-outlined text-outline">swap_calls</span>
              </div>
              <div className="flex flex-col gap-space-sm">
                {alternativeBuses.map((bus) => (
                  <div key={bus.id} className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-colors">
                    <div className="flex items-center gap-space-md">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center font-bold text-primary">
                        {bus.id.split('-')[1]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-lg text-label-lg font-bold text-on-surface">{bus.name}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {bus.eta === 14 ? 'Trailing interval • ETA 14 mins' : 'Preceding relief • ETA 22 mins'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-label-sm text-label-sm font-bold">
                        {bus.seats} Free
                      </span>
                      <span className="font-label-sm text-label-sm text-outline mt-0.5">
                        {bus.occupancy}/{bus.capacity} filled
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Terminal */}
            <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">Passenger Action Terminal</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-space-sm">
                <button
                  onClick={() => alert('Stop change requests coming soon. Contact transport office at 0731-4730000')}
                  className="w-full px-space-md py-3 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-lg text-label-lg flex items-center justify-between text-left"
                >
                  <span className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px] text-primary">edit_location_alt</span>
                    <span>Request Stop Change</span>
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
                </button>
                <button
                  onClick={() => alert('Delay reporting form coming soon. Current delays: Check notifications panel')}
                  className="w-full px-space-md py-3 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-lg text-label-lg flex items-center justify-between text-left"
                >
                  <span className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px] text-outline">schedule</span>
                    <span>Report Transit Delay</span>
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
                </button>
              </div>
              <div className="flex items-center justify-between pt-1 text-label-sm text-outline">
                <span>
                  Active Role: <strong>Passenger</strong>
                </span>
                <span>AITR Transit Portal v4.2</span>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Routes & Schedules Tab - NEW DESIGN */}
      {activeTab === 'schedules' && (
        <div className="px-margin-desktop py-space-lg">
          <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* LEFT: Map Placeholder with Stops - 2 cols */}
              <div className="lg:col-span-2 p-space-lg bg-surface-container-low">
                <div className="flex flex-col gap-space-md">
                  <div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Route Map</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Navlakha Bus Stand → Acropolis Institute</p>
                  </div>

                  {/* Leaflet Map Container */}
                  <div className="relative w-full h-96 rounded-lg border-2 border-surface-variant overflow-hidden shadow-md bg-white">
                    <div id="route-map" className="w-full h-full"></div>
                  </div>

                  {/* Stop Count Info */}
                  <div className="grid grid-cols-3 gap-space-sm">
                    <div className="p-space-sm rounded-lg bg-surface-container-lowest text-center">
                      <div className="font-headline-sm text-headline-sm text-primary font-bold">8</div>
                      <div className="font-label-xs text-label-xs text-on-surface-variant uppercase">Total Stops</div>
                    </div>
                    <div className="p-space-sm rounded-lg bg-surface-container-lowest text-center">
                      <div className="font-headline-sm text-headline-sm text-tertiary font-bold">12.5</div>
                      <div className="font-label-xs text-label-xs text-on-surface-variant uppercase">Distance (km)</div>
                    </div>
                    <div className="p-space-sm rounded-lg bg-surface-container-lowest text-center">
                      <div className="font-headline-sm text-headline-sm text-on-surface font-bold">35</div>
                      <div className="font-label-xs text-label-xs text-on-surface-variant uppercase">Duration (min)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Shifts & Buses - 3 cols */}
              <div className="lg:col-span-3 p-space-lg flex flex-col gap-space-lg">
                {/* Header */}
                <div>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Live Fleet Schedule</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Select shift and bus to view real-time route animation</p>
                </div>

                {/* Shift Selector */}
                <div className="flex gap-space-sm">
                  {[
                    { id: 'shift1', label: 'Shift 1', time: '08:20 - 09:40' },
                    { id: 'shift2', label: 'Shift 2', time: '10:30 - 11:50' }
                  ].map(shift => (
                    <button
                      key={shift.id}
                      onClick={() => setSelectedShift(shift.id)}
                      className={`flex-1 p-space-md rounded-lg font-label-lg text-label-lg transition-all ${
                        selectedShift === shift.id
                          ? 'bg-primary text-on-primary shadow-md'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      <div className="font-bold">{shift.label}</div>
                      <div className={`text-xs mt-1 ${selectedShift === shift.id ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>
                        {shift.time}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Bus Selection - 5 Buses */}
                <div className="flex flex-col gap-space-sm">
                  <span className="font-label-md text-label-md font-bold text-on-surface">Select Bus Unit</span>
                  <div className="grid grid-cols-1 gap-space-sm">
                    {['G-10', 'G-23', 'G-45', 'G-67', 'G-88'].map(busId => (
                      <div key={busId}>
                        <button
                          onClick={() => setExpandedBusId(expandedBusId === busId ? null : busId)}
                          className={`w-full p-space-md rounded-lg font-label-lg text-label-lg text-left transition-all flex items-center justify-between ${
                            expandedBusId === busId
                              ? 'bg-tertiary-fixed text-on-tertiary-fixed shadow-md'
                              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                          }`}
                        >
                          <div className="flex items-center gap-space-sm">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                              expandedBusId === busId 
                                ? 'bg-on-tertiary-fixed/20 text-tertiary' 
                                : 'bg-surface-container-high text-primary'
                            }`}>
                              <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                            </span>
                            <div>
                              <div className="font-bold">{busId}</div>
                              <div className={`text-xs ${expandedBusId === busId ? 'text-on-tertiary-fixed/70' : 'text-on-surface-variant'}`}>
                                {selectedShift === 'shift1' ? '38/50 seats • On-Time' : '42/50 seats • 2 mins delay'}
                              </div>
                            </div>
                          </div>
                          <span className={`material-symbols-outlined text-[20px] transition-transform ${expandedBusId === busId ? 'rotate-180' : ''}`}>
                            expand_more
                          </span>
                        </button>

                        {/* Dropdown Timeline - Shows when bus is clicked */}
                        {expandedBusId === busId && (
                          <div className="mt-space-sm p-space-md rounded-lg bg-surface-container-low border border-surface-variant">
                            <div className="stepper-box">
                              {[
                                { stop: 'Navlakha Bus Stand', time: '08:20', status: 'completed' },
                                { stop: 'Palasia Chouraha', time: '08:32', status: 'completed' },
                                { stop: 'M.Y. Chauraha', time: '08:42', status: 'active' },
                                { stop: 'Geeta Bhawan', time: '08:52', status: 'pending' },
                                { stop: 'MGMC', time: '09:02', status: 'pending' },
                                { stop: 'Sanchar Nagar', time: '09:12', status: 'pending' },
                                { stop: 'Kanadia Road', time: '09:22', status: 'pending' },
                                { stop: 'Acropolis Campus', time: '09:35', status: 'pending' }
                              ].map((step, idx) => (
                                <div key={idx} className={`stepper-step stepper-${step.status}`}>
                                  <div className="stepper-line"></div>
                                  <div className="stepper-circle">
                                    {step.status === 'completed' ? '✓' : idx + 1}
                                  </div>
                                  <div className="stepper-content">
                                    <div className="stepper-title">{step.stop}</div>
                                    <span className="stepper-status">
                                      {step.status === 'completed' ? 'Completed' : step.status === 'active' ? 'Current Stop' : 'Upcoming'}
                                    </span>
                                    <div className="stepper-time">{step.time}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTIONS TAB */}
      {activeTab === 'actions' && (
        <div className="px-margin-desktop py-space-lg pb-space-xl">
          <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
            <div className="flex items-center justify-between mb-space-md flex-wrap gap-space-sm">
              <h2 className="text-headline-lg font-bold text-on-surface">Requests & Complaints</h2>
              <button
                onClick={() => setShowComplaintForm(!showComplaintForm)}
                className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Submit Complaint
              </button>
            </div>

            {showComplaintForm && (
              <div className="p-space-md rounded-lg bg-surface-container-low mb-space-md border-2 border-primary-fixed space-y-space-sm">
                <h3 className="text-label-lg font-bold text-on-surface mb-space-sm">Submit Complaint</h3>
                <select
                  value={complaintData.category}
                  onChange={(e) => setComplaintData({ ...complaintData, category: e.target.value })}
                  className="w-full px-space-md py-2 rounded-lg bg-surface-container-lowest border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Category</option>
                  <option value="DELAY">Delay</option>
                  <option value="OCCUPANCY">Occupancy Issue</option>
                  <option value="COMFORT">Comfort</option>
                  <option value="OTHER">Other</option>
                </select>
                <textarea
                  value={complaintData.description}
                  onChange={(e) => setComplaintData({ ...complaintData, description: e.target.value })}
                  placeholder="Describe your concern..."
                  className="w-full px-space-md py-2 rounded-lg bg-surface-container-lowest border border-surface-container text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="4"
                />
                <div className="flex gap-space-sm">
                  <button
                    onClick={handleComplaintSubmit}
                    className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-on-primary-fixed-variant transition-colors"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setShowComplaintForm(false)}
                    className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {complaints.length > 0 && (
              <div className="space-y-space-sm">
                <h3 className="text-label-lg font-bold text-on-surface">Your Complaints History</h3>
                <div className="text-label-sm text-on-surface-variant mb-space-md">
                  Total complaints: <strong>{complaints.length}</strong>
                </div>
                {complaints.map((complaint, idx) => (
                  <div key={idx} className="p-space-md rounded-lg bg-surface-container-low flex items-start gap-space-md hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-primary text-[24px]">feedback</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-label-lg text-label-lg font-bold text-on-surface">{complaint.category}</div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{complaint.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center flex-wrap gap-2 mt-2 text-label-sm">
                        <span className={`px-2 py-0.5 rounded font-semibold ${
                          complaint.status === 'SUBMITTED'
                            ? 'bg-yellow-100 text-yellow-800'
                            : complaint.status === 'OPEN'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {complaint.status}
                        </span>
                        <span className="text-outline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">directions_bus</span>
                          {complaint.relatedBus}
                        </span>
                        {complaint.createdAt && (
                          <span className="text-on-surface-variant">
                            {new Date(complaint.createdAt).toLocaleDateString()} {new Date(complaint.createdAt).toLocaleTimeString()}
                          </span>
                        )}
                        {complaint.id && (
                          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-mono text-xs">
                            Ref: {complaint.id.substring(0, 8)}...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {complaints.length === 0 && !showComplaintForm && (
              <div className="p-space-lg rounded-lg bg-surface-container-low text-center">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/50 inline-block mb-2">sentiment_satisfied</span>
                <p className="font-body-lg text-body-lg text-on-surface-variant">No complaints yet. Tap "Submit Complaint" if you need to report an issue.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FULL-WIDTH DATE & BUSES TABLE SECTION AT BOTTOM */}
      <div className="w-full bg-surface py-space-lg">
        {/* Date Section */}
        <div className="px-0 py-space-md">
          <div className="flex items-center justify-center gap-space-md">
            <span className="material-symbols-outlined text-primary text-[28px]">calendar_today</span>
            <div className="text-center">
              <p className="font-label-md text-label-md text-on-surface-variant uppercase">Today's Schedule</p>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h2>
            </div>
          </div>
        </div>

        {/* Available Buses Table - Full Width */}
        <div className="w-full flex flex-col gap-space-md px-0">
          <div className="bg-gradient-to-r from-primary to-primary-fixed p-space-lg shadow-lg">
            <div className="flex items-center gap-space-md px-margin-desktop">
              <span className="material-symbols-outlined text-[32px] text-on-primary">directions_bus</span>
              <div>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-primary">Available Buses on Your Routes</h2>
                <p className="font-body-sm text-body-sm text-on-primary/80 mt-1">Real-time fleet information and occupancy details</p>
              </div>
            </div>
          </div>

          <div className="px-margin-desktop overflow-x-auto rounded-xl border border-surface-container shadow-md">
            <table className="w-full text-left font-body-sm text-body-sm bg-surface-container-lowest">
              <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase sticky top-0">
                <tr>
                  <th className="px-space-md py-4 font-bold">Bus ID</th>
                  <th className="px-space-md py-4 font-bold">Route</th>
                  <th className="px-space-md py-4 font-bold">Shift</th>
                  <th className="px-space-md py-4 font-bold">Driver</th>
                  <th className="px-space-md py-4 font-bold">Conductor</th>
                  <th className="px-space-md py-4 font-bold">Occupancy</th>
                  <th className="px-space-md py-4 font-bold">% Filled</th>
                  <th className="px-space-md py-4 font-bold">Available Seats</th>
                  <th className="px-space-md py-4 font-bold">Status</th>
                  <th className="px-space-md py-4 font-bold">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {[
                  { busId: 'G32', route: 'Navlakha → Acropolis', shift: 'Shift 1', driver: 'Rohit Sharma', conductor: 'Amit Verma', occupancy: 46, capacity: 50, status: 'On Trip', duration: '60 min' },
                  { busId: 'G71', route: 'Geeta Bhawan → Acropolis', shift: 'Shift 1', driver: 'Vikas Patel', conductor: 'Sandeep Yadav', occupancy: 50, capacity: 50, status: 'Full', duration: '55 min' },
                  { busId: 'G80', route: 'Bengali Square → Acropolis', shift: 'Shift 1', driver: 'Manoj Singh', conductor: 'Deepak Joshi', occupancy: 32, capacity: 45, status: 'On Trip', duration: '60 min' },
                  { busId: 'G32', route: 'Acropolis → Navlakha', shift: 'Shift 2', driver: 'Rohit Sharma', conductor: 'Amit Verma', occupancy: 28, capacity: 50, status: 'Scheduled', duration: '60 min' },
                  { busId: 'G71', route: 'Acropolis → Geeta Bhawan', shift: 'Shift 2', driver: 'Vikas Patel', conductor: 'Sandeep Yadav', occupancy: 35, capacity: 50, status: 'Scheduled', duration: '55 min' },
                  { busId: 'G80', route: 'Acropolis → Bengali Square', shift: 'Shift 2', driver: 'Manoj Singh', conductor: 'Deepak Joshi', occupancy: 20, capacity: 45, status: 'Scheduled', duration: '60 min' },
                ].map((bus, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-space-md py-4 font-bold text-primary text-[15px]">{bus.busId}</td>
                    <td className="px-space-md py-4 text-on-surface">{bus.route}</td>
                    <td className="px-space-md py-4">
                      <span className={`px-2.5 py-1 rounded-full text-label-xs font-semibold ${
                        bus.shift === 'Shift 1'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {bus.shift}
                      </span>
                    </td>
                    <td className="px-space-md py-4">{bus.driver}</td>
                    <td className="px-space-md py-4">{bus.conductor}</td>
                    <td className="px-space-md py-4 font-semibold">{bus.occupancy}/{bus.capacity}</td>
                    <td className="px-space-md py-4">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-16 h-2 rounded-full bg-surface-container-highest overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              bus.occupancy / bus.capacity > 0.8 
                                ? 'bg-error' 
                                : bus.occupancy / bus.capacity > 0.5
                                ? 'bg-warning'
                                : 'bg-tertiary'
                            }`}
                            style={{ width: `${(bus.occupancy / bus.capacity) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-on-surface-variant">{Math.round((bus.occupancy / bus.capacity) * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-space-md py-4 font-semibold text-tertiary">{bus.capacity - bus.occupancy}</td>
                    <td className="px-space-md py-4">
                      <span className={`px-3 py-1.5 rounded-full text-label-xs font-bold whitespace-nowrap ${
                        bus.status === 'Full'
                          ? 'bg-error-container text-on-error-container'
                          : bus.status === 'On Trip'
                          ? 'bg-warning-container text-on-warning-container'
                          : 'bg-surface-container text-on-surface'
                      }`}>
                        {bus.status}
                      </span>
                    </td>
                    <td className="px-space-md py-4 text-on-surface-variant">{bus.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
