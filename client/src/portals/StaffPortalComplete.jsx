import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';

export default function StaffPortalComplete() {
  const {
    buses,
    routes,
    stops,
    staff,
    trips,
    updateBusOccupancy,
    startTrip,
    endTrip,
    addComplaint,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('assignment');
  const [activeTrip, setActiveTrip] = useState(trips[0]);
  const [occupancyInput, setOccupancyInput] = useState(activeTrip?.passengersAboard || 0);
  const [gpsSharing, setGpsSharing] = useState(true);

  const staffMember = staff[0]; // Demo: First staff member
  const assignedBus = buses.find(b => b.id === staffMember.assignedBus);
  const assignedRoute = routes.find(r => r.id === staffMember.assignedRoute);
  const routeStops = stops.filter(s => s.routes.includes(staffMember.assignedRoute));

  const handleStartTrip = () => {
    const newTrip = {
      id: `TRIP-${Date.now()}`,
      bus: staffMember.assignedBus,
      route: staffMember.assignedRoute,
      shift: staffMember.assignedShift,
      status: 'IN_PROGRESS',
      startTime: new Date(),
      currentStop: routeStops[0]?.id,
      nextStop: routeStops[1]?.id,
      passengersAboard: 0,
    };
    startTrip(newTrip);
    setActiveTrip(newTrip);
    alert('Trip started successfully!');
  };

  const handleEndTrip = () => {
    if (activeTrip) {
      endTrip(activeTrip.id);
      setActiveTrip(null);
      alert('Trip ended successfully!');
    }
  };

  const handleUpdateOccupancy = () => {
    if (assignedBus && occupancyInput >= 0 && occupancyInput <= assignedBus.capacity) {
      updateBusOccupancy(assignedBus.id, occupancyInput);
      alert('Occupancy updated successfully!');
    } else {
      alert('Invalid occupancy value');
    }
  };

  const handleReportIssue = () => {
    addComplaint({
      id: `ISSUE-${Date.now()}`,
      submittedBy: staffMember.id,
      category: 'OPERATIONAL_ISSUE',
      description: 'Staff reported issue',
      relatedBus: assignedBus?.id,
      status: 'OPEN',
      createdAt: new Date(),
    });
    alert('Issue reported successfully!');
  };

  return (
    <div className="max-w-[1520px] mx-auto px-4 md:px-8 space-y-6 pb-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Transport Staff Portal</h1>
        <p className="text-slate-500 mt-2">Manage your assigned bus, GPS sharing, and occupancy updates</p>
      </div>

      {/* Staff Profile Card */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <span className="text-xs font-bold uppercase text-blue-600">Staff Member</span>
            <p className="text-lg font-bold text-slate-900 mt-1">{staffMember.name}</p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-blue-600">Role</span>
            <p className="text-lg font-bold text-slate-900 mt-1">{staffMember.role.join(', ')}</p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-blue-600">Assigned Bus</span>
            <p className="text-lg font-bold text-slate-900 mt-1">{assignedBus?.id || 'None'}</p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-blue-600">Shift</span>
            <p className="text-lg font-bold text-slate-900 mt-1">Shift 1 (08:20-14:40)</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {[
          { id: 'assignment', label: 'My Assignment' },
          { id: 'tripControl', label: 'Trip Control' },
          { id: 'occupancy', label: 'Occupancy' },
          { id: 'gps', label: 'GPS Sharing' },
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
      {activeTab === 'assignment' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">My Assignment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase text-slate-500">Bus</span>
              <p className="text-lg font-bold text-slate-900 mt-1">{assignedBus?.id}</p>
              <p className="text-sm text-slate-600 mt-1">Capacity: {assignedBus?.capacity} passengers</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase text-slate-500">Route</span>
              <p className="text-lg font-bold text-slate-900 mt-1">{assignedRoute?.name}</p>
              <p className="text-sm text-slate-600 mt-1">{assignedRoute?.distance} km • {assignedRoute?.estimatedDuration} mins</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase text-slate-500">Stops</span>
              <p className="text-lg font-bold text-slate-900 mt-1">{routeStops.length} Stops</p>
              <p className="text-sm text-slate-600 mt-1 truncate">{routeStops.map(s => s.name).join(', ')}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase text-slate-500">Current Status</span>
              <p className="text-lg font-bold text-slate-900 mt-1">{activeTrip ? 'Trip In Progress' : 'Idle'}</p>
              {activeTrip && (
                <p className="text-sm text-emerald-700 mt-1">Started: {new Date(activeTrip.startTime).toLocaleTimeString()}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tripControl' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trip Control Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Trip Control</h2>
            {activeTrip ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase text-emerald-600">Trip Status</span>
                      <p className="text-lg font-bold text-emerald-900 mt-1">IN PROGRESS</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">ACTIVE</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50">
                    <span className="text-xs font-bold uppercase text-slate-500">Trip Duration</span>
                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {Math.round((Date.now() - activeTrip.startTime) / 60000)} mins
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <span className="text-xs font-bold uppercase text-slate-500">Passengers</span>
                    <p className="text-lg font-bold text-slate-900 mt-1">{activeTrip.passengersAboard}</p>
                  </div>
                </div>
                <button
                  onClick={handleEndTrip}
                  className="w-full px-4 py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition"
                >
                  End Trip
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold uppercase text-slate-500">Trip Status</span>
                  <p className="text-lg font-bold text-slate-900 mt-1">NOT STARTED</p>
                </div>
                <p className="text-sm text-slate-600">No active trip. Click below to start a new trip.</p>
                <button
                  onClick={handleStartTrip}
                  className="w-full px-4 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition"
                >
                  Start Trip
                </button>
              </div>
            )}
          </div>

          {/* Trip History */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 mb-4">Recent Trips</h3>
            <div className="space-y-3">
              {trips.map((trip) => (
                <div key={trip.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900">{trip.bus}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      trip.status === 'COMPLETED'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-emerald-200 text-emerald-700'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{trip.route}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'occupancy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Update Occupancy</h2>
            {assignedBus && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold uppercase text-slate-500">Bus Capacity</span>
                  <p className="text-lg font-bold text-slate-900 mt-1">{assignedBus.capacity} passengers</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Current Passenger Count</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max={assignedBus.capacity}
                      value={occupancyInput}
                      onChange={(e) => setOccupancyInput(parseInt(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleUpdateOccupancy}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                    >
                      Update
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold uppercase text-slate-500">Occupancy Bar</span>
                  <div className="mt-3 h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${(occupancyInput / assignedBus.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-slate-600">
                    <span>{occupancyInput} passengers</span>
                    <span>{Math.round((occupancyInput / assignedBus.capacity) * 100)}% full</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-800"><strong>Demo Note:</strong> This updates local demo data only. In production, this will sync with occupancy sensors.</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 mb-4">Current Status</h3>
            {assignedBus && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold uppercase text-slate-500">Last Update</span>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {Math.round((Date.now() - assignedBus.lastOccupancyUpdate) / 60000)} mins ago
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold uppercase text-slate-500">Available Seats</span>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {assignedBus.capacity - assignedBus.currentOccupancy} seats
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold uppercase text-slate-500">Status</span>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {assignedBus.currentOccupancy >= assignedBus.capacity ? '🚌 Bus Full' : '✓ Capacity Available'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'gps' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-4">GPS Sharing</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">GPS Status</span>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {gpsSharing ? '🟢 Active' : '🔴 Inactive'}
                  </p>
                </div>
                <button
                  onClick={() => setGpsSharing(!gpsSharing)}
                  className={`px-4 py-2 rounded-lg font-bold transition ${
                    gpsSharing
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {gpsSharing ? 'Stop Sharing' : 'Start Sharing'}
                </button>
              </div>
            </div>

            {gpsSharing && (
              <>
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-xs font-bold uppercase text-emerald-600">Location Data</span>
                  <div className="space-y-2 mt-2 text-sm">
                    <div className="flex justify-between">
                      <span>Latitude:</span>
                      <span className="font-mono font-bold">{assignedBus?.currentLocation?.lat || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Longitude:</span>
                      <span className="font-mono font-bold">{assignedBus?.currentLocation?.lng || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span className="font-mono font-bold">{assignedBus?.currentSpeed || 0} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Update:</span>
                      <span className="font-mono font-bold">
                        {assignedBus?.lastGPSUpdate
                          ? `${Math.round((Date.now() - assignedBus.lastGPSUpdate) / 1000)}s ago`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-800"><strong>Demo Note:</strong> GPS data is simulated. In production, this will use the driver's phone location with proper permissions.</p>
                </div>
              </>
            )}

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Broadcasting</h3>
              <p className="text-sm text-slate-600">
                When GPS sharing is active, your location is broadcasted to:
              </p>
              <ul className="text-sm text-slate-600 mt-2 space-y-1 ml-4">
                <li>✓ Passengers assigned to your bus</li>
                <li>✓ Admin dashboard</li>
                <li>✓ Route tracking system</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 mb-4">Staff Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleReportIssue}
            className="px-4 py-3 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 transition"
          >
            📋 Report Operational Issue
          </button>
          <button className="px-4 py-3 rounded-lg bg-slate-600 text-white font-bold hover:bg-slate-700 transition">
            📞 Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
