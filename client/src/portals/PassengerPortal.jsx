import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';

export default function PassengerPortal() {
  const [activeTab, setActiveTab] = useState('tracking');
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintData, setComplaintData] = useState({ category: '', description: '' });

  // Connect to store
  const { buses, complaints, addComplaint, addNotification } = useAppStore();

  // Mock data
  const currentBus = {
    id: 'G-47',
    route: 'Palasia Square → AITR Campus',
    line: 'LINE 47',
    status: 'LIVE GPS',
    occupancy: 38,
    capacity: 50,
    speed: 32,
    heading: 'NE (42°)',
    eta: 6,
    distance: 1.8,
    nextStop: 'Central Library Bay 2',
  };

  const handleComplaintSubmit = () => {
    if (complaintData.category && complaintData.description) {
      addComplaint({
        category: complaintData.category,
        description: complaintData.description,
        submittedBy: 'PASSENGER',
        relatedBus: 'G-47',
      });
      addNotification({
        type: 'COMPLAINT_SUBMITTED',
        title: 'Complaint Submitted',
        message: `Your ${complaintData.category} complaint has been recorded.`,
      });
      setComplaintData({ category: '', description: '' });
      setShowComplaintForm(false);
    }
  };

  const alternativeBuses = [
    { id: 'G-39', name: 'Bus Unit G-39', eta: 14, seats: 19, occupancy: 31, capacity: 50 },
    { id: 'G-34', name: 'Bus Unit G-34', eta: 22, seats: 8, occupancy: 42, capacity: 50 },
  ];

  const landmarks = [
    {
      id: 1,
      title: 'Campus Administration & Lawn',
      desc: 'Direct bus stop turnaround loop near the main academic wing.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzjDt9jau_lDtL4orNISJJdnN3nNcDlbvVrXU8EQjEEN4wlMIPhlC3NNDy0tyZ886OI_tPjFrEMTz7OBeex_oWli74p79OOygOfPY2MD25Pr5BqH86PHfnci1r6w6dVdCfosXhZxQJV_cHAuuPExKkIq-n_RaXnTpZ_r8FyDY8e9xq7ky0btFub5uiM97Op7qo8CPTkngr0qqkQM2xxPpVPTHuVpi4vvpsUxMYAhtmSITFBkU801KpgQ',
    },
    {
      id: 2,
      title: 'Central Library Bay 2 Transit Hub',
      desc: 'Primary disembarkation hub for Shift 1 science and engineering departments.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8oVgKdjPFHPJCUD-OZfJcbc4SiGRPa7cJSIKR7eodxQrQ7lUJ98vD3yv1cLOX0qk7KbSpys8tjJ1XdTs89jyQngQBu0qFfu1he_K5EXVvss5EoT-68lpgHM6frSFaBTcLfcw1W83RkjUILu5-240EszBGB4iv5b1-XLCg5iXV8oFT4mPwB_7T0y-jjhMLcsihrPaJNkXuNdJEeuk0KS3-B8rcREiYJVfZdroyYA2lXm3KWKbA2aVNzQ',
    },
    {
      id: 3,
      title: 'Bypass Corridor Access',
      desc: 'Wide paved campus bypass roadway with directional lane markings.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo7lpS_L94GPF-Ck38QRKM8rZPqZ2_mHfAD-lwh_2BykX0vcj0gq8iFsG0zCnoghr0Mx518XyXzdo1TNXXc6S9ofqhSoIS7-jp2yVIVacAr',
    },
  ];

  return (
    <div className="w-full pt-16 bg-surface min-h-[calc(100vh-14rem)]">
      {/* Top Navigation Bar */}
      <div className="px-margin-desktop py-space-md bg-surface-container-low shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
          <div className="flex flex-wrap items-center gap-space-xs" id="portal-subnav">
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
              onClick={() => setActiveTab('seats')}
              className={`tab-btn px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-space-xs transition-all ${
                activeTab === 'seats'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">airline_seat_recline_normal</span>
              <span>My Bus & Seat Availability</span>
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
            <div className="text-on-surface-variant">
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

              {/* Bus Marker with Telemetry */}
              <div className="absolute top-[284px] left-[520px] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 group cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-12 h-12 rounded-full bg-amber-400/25 animate-ping"></span>
                  <div className="relative w-9 h-9 rounded-full bg-amber-400 text-slate-900 shadow-lg flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[20px]">directions_bus</span>
                  </div>
                </div>
                <div className="px-space-sm py-1 rounded bg-inverse-surface/90 text-inverse-on-surface backdrop-blur-md shadow-md flex items-center gap-space-xs">
                  <span className="font-label-md text-label-md font-bold text-amber-300">BUS G-47</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed"></span>
                  <span className="font-label-sm text-label-sm">In Motion</span>
                </div>
              </div>

              {/* Top-left info card */}
              <div className="absolute top-4 left-4 max-w-sm rounded-xl bg-surface-container-lowest/95 backdrop-blur-md p-space-md shadow-lg flex flex-col gap-space-xs">
                <div className="flex items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm">PRIMARY CORRIDOR</span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">LINE 47</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>LIVE GPS
                  </span>
                </div>
                <div className="font-headline-md text-headline-md text-on-surface">Palasia Square → AITR Campus</div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Traversing Indore Bypass Corridor via Ring Road and Manglia Junction.</p>
              </div>

              {/* Bottom telemetry panel */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-[460px] rounded-xl bg-inverse-surface/95 backdrop-blur-xl text-inverse-on-surface p-space-md shadow-xl flex flex-col gap-space-sm">
                <div className="flex items-center justify-between border-b border-surface-variant/20 pb-2">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">sensors</span>
                    <span className="font-label-md text-label-md font-bold tracking-wide uppercase">Real-Time Telemetry Stream</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-outline-variant">Update: 8s ago</span>
                </div>
                <div className="grid grid-cols-4 gap-space-xs text-center py-1">
                  <div className="flex flex-col items-center justify-center p-1.5 rounded bg-surface-variant/10">
                    <span className="font-label-sm text-label-sm text-inverse-on-surface/70">SPEED</span>
                    <span className="font-telemetry-metric text-telemetry-metric font-bold text-inverse-on-surface">
                      {currentBus.speed} <span className="font-label-sm text-label-sm">km/h</span>
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-1.5 rounded bg-surface-variant/10">
                    <span className="font-label-sm text-label-sm text-inverse-on-surface/70">HEADING</span>
                    <span className="font-telemetry-metric text-telemetry-metric font-bold text-inverse-on-surface">{currentBus.heading}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-1.5 rounded bg-surface-variant/10">
                    <span className="font-label-sm text-label-sm text-inverse-on-surface/70">ETA BAY 2</span>
                    <span className="font-telemetry-metric text-telemetry-metric font-bold text-tertiary-fixed">
                      {currentBus.eta} <span className="font-label-sm text-label-sm">mins</span>
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-1.5 rounded bg-surface-variant/10">
                    <span className="font-label-sm text-label-sm text-inverse-on-surface/70">DIST</span>
                    <span className="font-telemetry-metric text-telemetry-metric font-bold text-inverse-on-surface">
                      {currentBus.distance} <span className="font-label-sm text-label-sm">km</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm pt-1 bg-surface-variant/10 px-2 py-1.5 rounded">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-amber-300">pin_drop</span>
                    <span>
                      Next Point: <strong>Central Library Bay 2</strong>
                    </span>
                  </div>
                  <span className="text-tertiary-fixed font-label-sm text-label-sm">ON SCHEDULE</span>
                </div>
              </div>

              {/* Zoom controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-1.5">
                <button className="w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface shadow-md flex items-center justify-center hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
                <button className="w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface shadow-md flex items-center justify-center hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[20px]">remove</span>
                </button>
                <button className="w-9 h-9 rounded-lg bg-surface-container-lowest text-primary shadow-md flex items-center justify-center hover:bg-surface-container transition-colors">
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
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Assigned Fleet Unit</span>
                  <span className="font-headline-lg text-headline-lg font-bold text-on-surface">Bus Unit G-47</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-label-sm text-label-sm font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  Live Conductor Verified
                </span>
              </div>

              {/* Occupancy Card */}
              <div className="rounded-lg bg-surface-container-low p-space-md flex flex-col gap-space-sm">
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Confirmed Occupancy:</span>
                  <span className="font-bold text-on-surface font-headline-md text-headline-md">
                    {currentBus.occupancy} / {currentBus.capacity} <span className="text-body-sm font-normal text-on-surface-variant">Seats</span>
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden flex">
                  <div className="bg-primary h-full transition-all duration-500" style={{ width: '76%' }}></div>
                  <div className="bg-emerald-500 h-full opacity-60 transition-all duration-500" style={{ width: '24%' }}></div>
                </div>
                <div className="flex items-center justify-between text-label-sm font-label-sm pt-1">
                  <span className="text-primary font-bold">76% Seating Filled</span>
                  <span className="text-tertiary font-bold">12 Seats Remaining</span>
                </div>
              </div>

              {/* Capacity Details */}
              <div className="grid grid-cols-2 gap-space-sm text-body-sm font-body-sm">
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5">
                  <span className="font-label-sm text-label-sm text-outline uppercase">Stated Capacity</span>
                  <span className="font-bold text-on-surface">50 Seats + 2 Officers</span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5">
                  <span className="font-label-sm text-label-sm text-outline uppercase">Verification Stamp</span>
                  <span className="font-bold text-on-surface">08:14 AM (Synced)</span>
                </div>
              </div>

              {/* Crew Info */}
              <div className="rounded-lg bg-surface-container-low p-space-sm flex items-center justify-between text-label-md font-label-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-outline">verified_user</span>
                  <span className="text-on-surface">Operational Crew Units:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-label-sm text-label-sm">Driver Unit G-47</span>
                  <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-label-sm text-label-sm">Conductor Unit G-47</span>
                </div>
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
                <button className="w-full px-space-md py-3 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-lg text-label-lg flex items-center justify-between text-left">
                  <span className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px] text-primary">edit_location_alt</span>
                    <span>Request Stop Change</span>
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
                </button>
                <button className="w-full px-space-md py-3 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-lg text-label-lg flex items-center justify-between text-left">
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

      {/* Landmarks Section */}
      <div className="px-margin-desktop py-space-lg">
        <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-sm">
            <div>
              <span className="font-headline-md text-headline-md font-bold text-on-surface">AITR Campus Corridor Landmarks</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Spatial transit landmarks captured on the Indore Bypass Campus approach</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm text-outline">Geo-tagging: Manglia, Indore</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
            {landmarks.map((landmark) => (
              <div key={landmark.id} className="rounded-lg overflow-hidden bg-surface-container-low shadow-sm flex flex-col">
                <img className="w-full h-44 object-cover" src={landmark.image} alt={landmark.title} />
                <div className="p-space-md flex flex-col gap-1">
                  <span className="font-label-md text-label-md font-bold text-on-surface">{landmark.title}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{landmark.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIONS TAB */}
      {activeTab === 'actions' && (
        <div className="px-margin-desktop py-space-lg">
          <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
            <div className="flex items-center justify-between mb-space-md">
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

            {complaints.length > 0 ? (
              <div className="space-y-space-sm">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="p-space-md rounded-lg bg-surface-container-low border border-surface-container">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-label-lg font-bold text-on-surface">{complaint.category}</p>
                        <p className="text-body-sm text-on-surface-variant">{complaint.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-label-sm font-bold whitespace-nowrap ${
                        complaint.status === 'SUBMITTED' ? 'bg-secondary-fixed text-on-secondary-fixed' :
                        complaint.status === 'IN_REVIEW' ? 'bg-tertiary-fixed text-on-tertiary-fixed' :
                        'bg-tertiary-container text-on-tertiary'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-label-sm text-outline">{new Date(complaint.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-space-lg text-on-surface-variant">
                <p className="text-body-sm">No complaints submitted yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
