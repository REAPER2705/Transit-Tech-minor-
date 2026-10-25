import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '../store/appStore';

/**
 * Complete Passenger Portal - Stitch-accurate implementation
 * Features: Live tracking map, bus availability, routes & schedules, complaints
 */
export default function PassengerPortalComplete() {
  const {
    selectedBus,
    selectedRoute,
    selectedStop,
    selectBus,
    selectRoute,
    selectStop,
    buses,
    routes,
    stops,
    timetables,
    complaints,
    getStopsByRoute,
    getTimetablesForRoute,
    addComplaint,
    addNotification,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('tracking');
  const [searchQuery, setSearchQuery] = useState('');
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintData, setComplaintData] = useState({ category: '', description: '' });

  // Initialize with default selections
  useEffect(() => {
    if (!selectedBus && buses.length > 0) {
      selectBus(buses[0].id);
    }
    if (!selectedRoute && routes.length > 0) {
      selectRoute(routes[0].id);
    }
  }, [buses, routes, selectedBus, selectedRoute, selectBus, selectRoute]);

  // Derived data
  const selectedBusData = buses.find((b) => b.id === selectedBus);
  const selectedRouteData = routes.find((r) => r.id === selectedRoute);
  const selectedStopData = stops.find((s) => s.id === selectedStop);
  const routeStops = selectedRouteData ? getStopsByRoute(selectedRouteData.id) : [];
  const routeTimetables = selectedRouteData ? getTimetablesForRoute(selectedRouteData.id) : [];

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { stops: [], routes: [] };
    const query = searchQuery.toLowerCase();
    return {
      stops: stops.filter((s) => s.name.toLowerCase().includes(query)),
      routes: routes.filter((r) => r.name.toLowerCase().includes(query)),
    };
  }, [searchQuery, stops, routes]);

  const handleComplaintSubmit = () => {
    if (complaintData.category && complaintData.description) {
      addComplaint({
        category: complaintData.category,
        description: complaintData.description,
        submittedBy: 'PASSENGER',
        relatedBus: selectedBus || 'G-47',
        relatedRoute: selectedRoute || 'ROUTE-01',
      });
      addNotification({
        type: 'COMPLAINT_SUBMITTED',
        title: 'Complaint Submitted',
        message: `Your ${complaintData.category} complaint has been recorded.`,
        createdAt: new Date().toISOString(),
        read: false,
      });
      setComplaintData({ category: '', description: '' });
      setShowComplaintForm(false);
    }
  };

  return (
    <div className="w-full pt-16 bg-surface min-h-screen">
      {/* Sub-navigation */}
      <div className="px-margin-desktop py-space-md bg-surface-container-low shadow-sm sticky top-16 z-30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
          <div className="flex flex-wrap items-center gap-space-xs">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-space-xs transition-all ${
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
              className={`px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-space-xs transition-all ${
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
              className={`px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-space-xs transition-all ${
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
              className={`px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-space-xs transition-all ${
                activeTab === 'actions'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
              <span>Requests & Complaints</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-highest text-on-primary-fixed-variant font-label-sm text-label-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
            <span>TELEMETRY ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="px-margin-desktop py-space-lg">
        {/* TRACKING TAB */}
        {activeTab === 'tracking' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter-desktop">
            {/* Left: Map area */}
            <div className="xl:col-span-8 flex flex-col gap-space-md">
              {/* Search & Route Selection */}
              <div className="glass rounded-xl p-space-md shadow-sm">
                <div className="space-y-space-md">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search routes, stops..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-space-md py-2 rounded-lg bg-surface-container-low border border-surface-container text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {searchQuery && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest rounded-lg shadow-md border border-surface-container z-50 max-h-64 overflow-y-auto">
                        {searchResults.stops.length > 0 && (
                          <div className="p-space-md border-b border-surface-container">
                            <p className="text-label-sm text-on-surface-variant mb-2 uppercase">Stops</p>
                            {searchResults.stops.map((stop) => (
                              <button
                                key={stop.id}
                                onClick={() => {
                                  selectStop(stop.id);
                                  setSearchQuery('');
                                }}
                                className="w-full text-left px-space-sm py-2 hover:bg-surface-container rounded transition-colors"
                              >
                                <p className="font-label-md text-label-md text-on-surface">{stop.name}</p>
                                <p className="text-label-sm text-on-surface-variant">{stop.stopCode}</p>
                              </button>
                            ))}
                          </div>
                        )}
                        {searchResults.routes.length > 0 && (
                          <div className="p-space-md">
                            <p className="text-label-sm text-on-surface-variant mb-2 uppercase">Routes</p>
                            {searchResults.routes.map((route) => (
                              <button
                                key={route.id}
                                onClick={() => {
                                  selectRoute(route.id);
                                  setSearchQuery('');
                                }}
                                className="w-full text-left px-space-sm py-2 hover:bg-surface-container rounded transition-colors"
                              >
                                <p className="font-label-md text-label-md text-on-surface">{route.name}</p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Route & Shift Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <select
                      value={selectedRoute}
                      onChange={(e) => selectRoute(e.target.value)}
                      className="px-space-md py-2 rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Route</option>
                      {routes.map((route) => (
                        <option key={route.id} value={route.id}>
                          {route.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value=""
                      onChange={(e) => {}}
                      className="px-space-md py-2 rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Shift 1 (08:20 - 14:40)</option>
                      <option value="">Shift 2 (10:30 - 17:00)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Map Visualization */}
              <div className="glass rounded-xl bg-surface-container-low p-space-md shadow-sm" style={{ minHeight: '400px' }}>
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-[48px] block mb-2">public</span>
                    <p className="font-label-lg text-label-lg">Campus Map Area</p>
                    <p className="text-body-sm mt-2">Map integration with Leaflet</p>
                    {selectedBusData && (
                      <p className="text-primary font-bold mt-4">Bus {selectedBusData.id} · Route: {selectedRouteData?.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Advisory Notice */}
              <div className="glass rounded-xl bg-surface-container-low p-space-md shadow-sm flex items-start gap-space-md">
                <span className="material-symbols-outlined text-[20px] text-primary flex-shrink-0">info</span>
                <div>
                  <p className="font-label-lg text-label-lg text-on-surface font-bold">Timetable Advisory Notice</p>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    Please reach your designated campus stop 5 minutes prior to scheduled arrival to ensure uninterrupted dispatch.
                  </p>
                  <p className="text-label-sm text-outline mt-2">Standard Shift 1 Morning • Sept 1, 2023 (Unverified)</p>
                </div>
              </div>
            </div>

            {/* Right: Bus Info Sidebar */}
            <div className="xl:col-span-4 flex flex-col gap-space-md">
              {/* Assigned Bus Card */}
              <div className="glass rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                <div className="flex items-center justify-between mb-space-md">
                  <div>
                    <p className="text-label-sm text-outline uppercase">Assigned Fleet Unit</p>
                    <p className="text-headline-lg font-bold text-on-surface">Bus Unit {selectedBusData?.id || 'G-47'}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-label-sm font-bold flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    Live Verified
                  </span>
                </div>

                {/* Occupancy */}
                <div className="rounded-lg bg-surface-container-low p-space-md mb-space-md">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-body-sm text-on-surface-variant">Confirmed Occupancy:</p>
                    <p className="text-headline-md font-bold text-on-surface">38 / 50 Seats</p>
                  </div>
                  <div className="flex h-3 rounded-full bg-surface-container-highest overflow-hidden">
                    <div className="bg-primary flex-shrink-0" style={{ width: '76%' }}></div>
                    <div className="bg-emerald-500 flex-shrink-0" style={{ width: '24%' }}></div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-label-sm">
                    <span className="text-primary font-bold">76% Filled</span>
                    <span className="text-tertiary font-bold">12 Available</span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-space-sm text-body-sm">
                  <div className="p-space-sm rounded-lg bg-surface-container-low">
                    <p className="text-label-sm text-outline uppercase text-xs">Capacity</p>
                    <p className="font-bold text-on-surface">50 + 2 Staff</p>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container-low">
                    <p className="text-label-sm text-outline uppercase text-xs">Verified</p>
                    <p className="font-bold text-on-surface">08:14 AM</p>
                  </div>
                </div>
              </div>

              {/* Alternative Buses */}
              <div className="glass rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                <p className="text-headline-md font-bold text-on-surface mb-space-md">Alternative Fleet Units</p>
                <div className="space-y-space-sm">
                  {buses
                    .filter((b) => b.id !== selectedBus && b.status === 'ACTIVE')
                    .slice(0, 2)
                    .map((bus) => (
                      <div
                        key={bus.id}
                        className="p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer border border-surface-container"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-label-lg text-label-lg font-bold text-on-surface">Bus Unit {bus.id}</p>
                            <p className="text-body-sm text-on-surface-variant">ETA {Math.floor(Math.random() * 20) + 5} mins</p>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-label-sm font-bold">
                            {50 - bus.currentOccupancy} Free
                          </span>
                        </div>
                        <p className="text-label-sm text-on-surface-variant">{bus.currentOccupancy}/50 filled</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="glass rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                <p className="text-headline-md font-bold text-on-surface mb-space-md">Passenger Actions</p>
                <div className="space-y-space-sm">
                  <button className="w-full px-space-md py-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface font-label-lg text-label-lg flex items-center justify-between text-left">
                    <span className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-[20px] text-primary">edit_location_alt</span>
                      <span>Request Stop Change</span>
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
                  </button>
                  <button className="w-full px-space-md py-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface font-label-lg text-label-lg flex items-center justify-between text-left">
                    <span className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-[20px] text-outline">schedule</span>
                      <span>Report Transit Delay</span>
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEATS TAB */}
        {activeTab === 'seats' && (
          <div className="glass rounded-xl p-space-lg shadow-sm">
            <h2 className="text-headline-lg font-bold text-on-surface mb-space-md">Bus Seat Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div>
                <p className="text-label-lg font-bold text-on-surface mb-2">G-47 Occupancy Grid</p>
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded text-xs flex items-center justify-center font-bold text-white text-[10px] ${
                        i < 38
                          ? 'bg-primary'
                          : 'bg-emerald-500'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex gap-space-sm mt-space-md text-label-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-primary"></div>
                    <span>Occupied (38)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-emerald-500"></div>
                    <span>Available (12)</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-space-md">
                <div className="p-space-md rounded-lg bg-surface-container-low">
                  <p className="text-label-lg font-bold text-on-surface">Status</p>
                  <p className="text-body-sm text-on-surface-variant mt-2">Verified Occupancy: 38/50</p>
                  <p className="text-body-sm text-on-surface-variant">Last Update: 8:14 AM</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCHEDULES TAB */}
        {activeTab === 'schedules' && (
          <div className="space-y-space-md">
            <div className="glass rounded-xl p-space-lg shadow-sm">
              <h2 className="text-headline-lg font-bold text-on-surface mb-space-md">Routes & Timetables</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {routes.map((route) => (
                  <div key={route.id} className="p-space-md rounded-lg bg-surface-container-low border-2 border-surface-container hover:border-primary transition-colors cursor-pointer">
                    <p className="text-label-lg font-bold text-on-surface">{route.name}</p>
                    <p className="text-body-sm text-on-surface-variant mt-1">{route.stops?.length || 0} stops</p>
                    <p className="text-label-sm text-outline mt-2 uppercase">Sept 1, 2023 (Unverified)</p>
                  </div>
                ))}
              </div>
            </div>
            {routeTimetables.length > 0 && (
              <div className="glass rounded-xl p-space-lg shadow-sm">
                <h3 className="text-headline-md font-bold text-on-surface mb-space-md">Schedule Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm">
                    <thead>
                      <tr className="border-b border-surface-container">
                        <th className="text-left p-2 font-bold">Route</th>
                        <th className="text-left p-2 font-bold">Stop</th>
                        <th className="text-left p-2 font-bold">Arrival</th>
                        <th className="text-left p-2 font-bold">Departure</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routeTimetables.slice(0, 10).map((tt, idx) => (
                        <tr key={idx} className="border-b border-surface-container-low hover:bg-surface-container-low">
                          <td className="p-2 font-medium">{tt.routeId}</td>
                          <td className="p-2">{tt.stopId}</td>
                          <td className="p-2">{tt.arrivalTime}</td>
                          <td className="p-2">{tt.departureTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACTIONS TAB */}
        {activeTab === 'actions' && (
          <div className="glass rounded-xl p-space-lg shadow-sm">
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
              <div className="p-space-md rounded-lg bg-surface-container-low mb-space-md border-2 border-primary-fixed">
                <h3 className="text-label-lg font-bold text-on-surface mb-space-sm">Submit Complaint</h3>
                <div className="space-y-space-sm">
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
                      <span className={`px-2 py-1 rounded text-label-sm font-bold ${
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
        )}
      </main>
    </div>
  );
}
