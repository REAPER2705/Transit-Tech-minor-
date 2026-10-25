import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import BusTrackingMap from '../components/common/BusTrackingMap';

const campusImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuALy9stFksMSbi4cvNyeJEngWTykzVZ8Sq-G-rPvXqDoptTC-pfmBFp4F5TQ-W4ThxEXPh8HIpBK_OKC8qo4YyA8sc4ztkaivB6krmxE1mLVIfHtfAcaJP9E7F_7K9cwOs7vRmFRjkY6Av9yfpzLcgPPrZiirIafX1OX_pHdutBHXA4ZQuaDLZTStUxBQDCj69BW1-7KfEQsjBFpNz1dlakLtOOibLa-87Sl4yeWb84Ohe_l8hiGZX2CZ1uvIqX3mHfEoc';

export default function PassengerPortalComplete() {
  const {
    buses,
    routes,
    stops,
    selectedBus,
    selectedRoute,
    selectBus,
    selectRoute,
    addRequest,
    addComplaint,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('tracking');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ type: 'STOP_CHANGE', description: '' });
  const [complaintForm, setComplaintForm] = useState({ category: '', description: '' });

  const bus = buses.find(b => b.id === selectedBus);
  const route = routes.find(r => r.id === selectedRoute);
  const routeStops = stops.filter(s => s.routes.includes(selectedRoute));

  const handleSubmitRequest = () => {
    if (requestForm.description.trim()) {
      addRequest({
        id: `REQ-${Date.now()}`,
        type: requestForm.type,
        submittedBy: 'PASS-001',
        description: requestForm.description,
        status: 'PENDING',
        createdAt: new Date(),
      });
      setRequestForm({ type: 'STOP_CHANGE', description: '' });
      setShowRequestModal(false);
      alert('Request submitted successfully!');
    }
  };

  const handleSubmitComplaint = () => {
    if (complaintForm.category && complaintForm.description.trim()) {
      addComplaint({
        id: `COMP-${Date.now()}`,
        submittedBy: 'PASS-001',
        category: complaintForm.category,
        description: complaintForm.description,
        relatedBus: selectedBus,
        status: 'OPEN',
        createdAt: new Date(),
      });
      setComplaintForm({ category: '', description: '' });
      setShowComplaintModal(false);
      alert('Complaint submitted successfully!');
    }
  };

  return (
    <div className="max-w-[1520px] mx-auto px-4 md:px-8 space-y-6 pb-12">
      {/* Timetable Advisory Banner */}
      <div className="rounded-2xl bg-amber-50/90 border border-amber-200/80 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-amber-900 font-medium">
          <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
          </svg>
          <span>
            <strong className="font-bold">Legacy Timetable (July 2015)</strong> — Schedules pending verification. Please arrive 5 minutes early.
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
          Needs Verification
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative w-full rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-900 min-h-[440px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-[1.01]"
          style={{ backgroundImage: `url('${campusImageUrl}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#070d19]/95 via-[#0b1322]/85 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070d19]/80 via-transparent to-transparent"></div>

        <div className="relative z-10 w-full p-6 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start gap-3.5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                Your Campus. Your Journey.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                  Connected.
                </span>
              </h1>
              <p className="text-slate-300 text-sm md:text-base max-w-xl font-normal leading-relaxed">
                Track your assigned bus in real-time, explore campus routes, and get verified schedule updates.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('tracking')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span>Track My Bus</span>
                </button>
                <button
                  onClick={() => setActiveTab('routes')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md text-white font-semibold text-xs md:text-sm border border-white/20 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6l6 6m0 0l6-6m-6 6v12" />
                  </svg>
                  <span>Explore Routes</span>
                </button>
              </div>
            </div>

            {/* Right Frosted Glass Panel */}
            <div className="lg:col-span-5 xl:col-span-4 flex justify-end">
              <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-xl p-5 md:p-6 shadow-2xl border border-white/40 text-slate-900">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Next Arrival</span>
                  {bus && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      <span>LIVE</span>
                    </div>
                  )}
                </div>
                <div className="pt-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow-sm border border-yellow-600">
                      {bus?.id || 'N/A'}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 leading-snug">
                        {bus?.id || 'Bus Assignment'}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">{route?.name || 'No route assigned'}</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold">Shift 1</span>
                </div>

                {bus && (
                  <div className="mt-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ETA</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-3xl font-extrabold text-blue-600 tracking-tight">8</span>
                          <span className="text-sm font-bold text-blue-600">min</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-700 block">2.3 km away</span>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">On schedule</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between text-xs bg-blue-50/70 border border-blue-200/70 p-2.5 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-700">
                    <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-[11.5px]">
                      Seats: <strong className="text-blue-700">{bus ? bus.capacity - bus.currentOccupancy : 0} free</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Tiles */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Assigned Bus', value: bus?.id || 'None', icon: '🚌' },
          { label: 'Designated Stop', value: routeStops[0]?.name || 'Not assigned', icon: '📍' },
          { label: 'Shift', value: 'Shift 1 (08:20-14:40)', icon: '⏰' },
          { label: 'Seats Available', value: bus ? `${bus.capacity - bus.currentOccupancy} of ${bus.capacity}` : 'N/A', icon: '💺' },
        ].map((tile, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-xs">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">{tile.label}</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl">{tile.icon}</span>
              <p className="font-bold text-slate-900 text-sm">{tile.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {[
          { id: 'tracking', label: '🗺️ Live Tracking' },
          { id: 'routes', label: '🛣️ Routes & Stops' },
          { id: 'requests', label: '📝 Requests' },
          { id: 'complaints', label: '⚠️ Complaints' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'tracking' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <BusTrackingMap routeId={selectedRoute} selectedBus={selectedBus} showStops={true} />
          </div>
          <div className="lg:col-span-4 space-y-4">
            {bus && (
              <>
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                  <h3 className="font-bold text-slate-900 mb-3">Bus Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Occupancy</span>
                      <span className="font-bold">{bus.currentOccupancy} / {bus.capacity}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: `${(bus.currentOccupancy / bus.capacity) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{Math.round((bus.currentOccupancy / bus.capacity) * 100)}% Full</span>
                      <span>{bus.capacity - bus.currentOccupancy} Seats Free</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                  <h3 className="font-bold text-slate-900 mb-3">Alternative Buses</h3>
                  {buses.filter(b => b.id !== selectedBus && b.assignedRoute === selectedRoute).map(altBus => (
                    <div key={altBus.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 mb-2 hover:bg-slate-100 transition cursor-pointer" onClick={() => selectBus(altBus.id)}>
                      <div className="flex justify-between">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{altBus.id}</div>
                          <div className="text-xs text-slate-500">ETA: ~14 mins</div>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                          {altBus.capacity - altBus.currentOccupancy} Free
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="w-full px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-sm transition"
                  >
                    📝 Request Stop Change
                  </button>
                  <button
                    onClick={() => setShowComplaintModal(true)}
                    className="w-full px-3 py-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold text-sm transition"
                  >
                    ⚠️ Report Issue
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'routes' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Available Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map(r => (
              <div
                key={r.id}
                onClick={() => selectRoute(r.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                  selectedRoute === r.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 bg-slate-50 hover:border-blue-300'
                }`}
              >
                <h3 className="font-bold text-slate-900">{r.name}</h3>
                <p className="text-xs text-slate-600 mt-1">{r.description}</p>
                <p className="text-xs text-slate-500 mt-2">{r.distance} km • {r.estimatedDuration} mins</p>
                <p className="text-xs mt-2">{r.stops.length} stops</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">My Requests</h2>
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-3 py-1 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
            >
              + New Request
            </button>
          </div>
          <p className="text-sm text-slate-600">No pending requests</p>
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">My Complaints</h2>
            <button
              onClick={() => setShowComplaintModal(true)}
              className="px-3 py-1 rounded-lg bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition"
            >
              + File Complaint
            </button>
          </div>
          <p className="text-sm text-slate-600">No complaints yet</p>
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Submit Request</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Request Type</label>
                <select
                  value={requestForm.type}
                  onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="STOP_CHANGE">Request Stop Change</option>
                  <option value="BUS_CHANGE">Request Bus Change</option>
                  <option value="SHIFT_CHANGE">Request Shift Change</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
                <textarea
                  value={requestForm.description}
                  onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                  placeholder="Please describe your request..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRequest}
                  className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">File Complaint</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Category</label>
                <select
                  value={complaintForm.category}
                  onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="DELAY">Delay</option>
                  <option value="COMFORT">Comfort</option>
                  <option value="SAFETY">Safety</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
                <textarea
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                  placeholder="Please describe the issue..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowComplaintModal(false)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitComplaint}
                  className="flex-1 px-3 py-2 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
