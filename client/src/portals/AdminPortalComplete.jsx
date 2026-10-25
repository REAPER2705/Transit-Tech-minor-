import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';

export default function AdminPortalComplete() {
  const {
    buses,
    routes,
    stops,
    shifts,
    requests,
    complaints,
    updateBus,
    addBus,
    updateRoute,
    addRoute,
    updateStop,
    addStop,
    updateRequestStatus,
    updateComplaintStatus,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [showBusModal, setShowBusModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [newBus, setNewBus] = useState({ id: '', capacity: 50, status: 'ACTIVE' });
  const [newRoute, setNewRoute] = useState({ id: '', name: '', distance: 0 });
  const [selectedShift, setSelectedShift] = useState('SHIFT-1');
  const [importFile, setImportFile] = useState(null);

  const handleAddBus = () => {
    if (newBus.id && newBus.capacity > 0) {
      addBus({
        ...newBus,
        officialCapacity: newBus.capacity,
        staffCapacity: 2,
        currentOccupancy: 0,
        lastOccupancyUpdate: new Date(),
      });
      setNewBus({ id: '', capacity: 50, status: 'ACTIVE' });
      setShowBusModal(false);
      alert('Bus added successfully!');
    }
  };

  const handleAddRoute = () => {
    if (newRoute.id && newRoute.name) {
      addRoute({
        ...newRoute,
        stops: [],
        activeBuses: [],
        shift: selectedShift,
      });
      setNewRoute({ id: '', name: '', distance: 0 });
      setShowRouteModal(false);
      alert('Route added successfully!');
    }
  };

  return (
    <div className="max-w-[1520px] mx-auto px-4 md:px-8 space-y-6 pb-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Admin Portal - Fleet Management</h1>
        <p className="text-slate-500 mt-2">Manage buses, routes, staff, assignments, and system configuration</p>
      </div>

      {/* Shift Selector */}
      <div className="flex gap-2">
        {[
          { id: 'SHIFT-1', label: 'Shift 1 (08:20-14:40)' },
          { id: 'SHIFT-2', label: 'Shift 2 (10:30-17:00)' },
        ].map((shift) => (
          <button
            key={shift.id}
            onClick={() => setSelectedShift(shift.id)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedShift === shift.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
            }`}
          >
            {shift.label}
          </button>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'buses', label: '🚌 Buses' },
          { id: 'routes', label: '🛣️ Routes' },
          { id: 'stops', label: '📍 Stops' },
          { id: 'requests', label: '📝 Requests' },
          { id: 'complaints', label: '⚠️ Complaints' },
          { id: 'imports', label: '📥 Imports' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition whitespace-nowrap ${
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
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Buses', value: buses.length, color: 'blue' },
            { label: 'Active Routes', value: routes.length, color: 'green' },
            { label: 'Total Stops', value: stops.length, color: 'purple' },
            { label: 'Pending Requests', value: requests.filter(r => r.status === 'PENDING').length, color: 'amber' },
          ].map((card, i) => (
            <div key={i} className={`bg-${card.color}-50 rounded-2xl p-6 border border-${card.color}-200`}>
              <span className={`text-xs font-bold uppercase text-${card.color}-600`}>{card.label}</span>
              <p className={`text-3xl font-bold text-${card.color}-900 mt-2`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'buses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Bus Fleet Management</h2>
            <button
              onClick={() => setShowBusModal(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
            >
              + Add Bus
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Bus ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Capacity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Occupancy</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Route</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus) => (
                  <tr key={bus.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-3 font-bold text-slate-900">{bus.id}</td>
                    <td className="px-6 py-3 text-slate-600">{bus.capacity} seats</td>
                    <td className="px-6 py-3 text-slate-600">{bus.currentOccupancy}/{bus.capacity}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        bus.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {bus.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{bus.assignedRoute || 'Unassigned'}</td>
                    <td className="px-6 py-3">
                      <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'routes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Route Management</h2>
            <button
              onClick={() => setShowRouteModal(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
            >
              + Add Route
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.filter(r => r.shift === selectedShift).map((route) => (
              <div key={route.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{route.id}</h3>
                    <p className="text-sm text-slate-600 mt-1">{route.name}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Edit</button>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span className="font-bold text-slate-900">{route.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-bold text-slate-900">{route.estimatedDuration} mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stops:</span>
                    <span className="font-bold text-slate-900">{route.stops.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Buses:</span>
                    <span className="font-bold text-slate-900">{route.activeBuses.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stops' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Stop Management</h2>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Stop ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Routes</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {stops.map((stop) => (
                  <tr key={stop.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-3 font-bold text-slate-900">{stop.id}</td>
                    <td className="px-6 py-3 text-slate-600">{stop.name}</td>
                    <td className="px-6 py-3 text-slate-600">{stop.routes.join(', ')}</td>
                    <td className="px-6 py-3">
                      <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Assignment & Change Requests</h2>
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-900">{request.type}</h3>
                  <p className="text-sm text-slate-600 mt-1">{request.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  request.status === 'PENDING'
                    ? 'bg-amber-100 text-amber-800'
                    : request.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {request.status}
                </span>
              </div>
              {request.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateRequestStatus(request.id, 'APPROVED')}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateRequestStatus(request.id, 'REJECTED')}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition text-sm"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Complaints & Issues</h2>
          {complaints.map((complaint) => (
            <div key={complaint.id} className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-900">{complaint.category}</h3>
                  <p className="text-sm text-slate-600 mt-1">{complaint.description}</p>
                  <p className="text-xs text-slate-500 mt-2">Bus: {complaint.relatedBus}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  complaint.status === 'OPEN'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {complaint.status}
                </span>
              </div>
              {complaint.status === 'OPEN' && (
                <button
                  onClick={() => updateComplaintStatus(complaint.id, 'RESOLVED')}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition text-sm"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'imports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Import Data</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Shift</label>
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SHIFT-1">Shift 1 (08:20-14:40)</option>
                  <option value="SHIFT-2">Shift 2 (10:30-17:00)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Data Type</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Timetables</option>
                  <option>Routes</option>
                  <option>Bus Assignments</option>
                  <option>Staff Assignments</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Upload File</label>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => setImportFile(e.target.files?.[0])}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition">
                Upload & Preview
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Export Data</h3>
            <div className="space-y-2">
              {[
                'Bus Fleet',
                'Routes',
                'Stops',
                'Schedules',
                'Staff Assignments',
              ].map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-900 transition text-sm"
                >
                  Export {item} (CSV)
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bus Modal */}
      {showBusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Add New Bus</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Bus ID</label>
                <input
                  type="text"
                  value={newBus.id}
                  onChange={(e) => setNewBus({ ...newBus, id: e.target.value })}
                  placeholder="e.g., G-50"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Passenger Capacity</label>
                <input
                  type="number"
                  value={newBus.capacity}
                  onChange={(e) => setNewBus({ ...newBus, capacity: parseInt(e.target.value) || 0 })}
                  min="10"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBusModal(false)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBus}
                  className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Add Bus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Route Modal */}
      {showRouteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Add New Route</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Route ID</label>
                <input
                  type="text"
                  value={newRoute.id}
                  onChange={(e) => setNewRoute({ ...newRoute, id: e.target.value })}
                  placeholder="e.g., ROUTE-03"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Route Name</label>
                <input
                  type="text"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                  placeholder="e.g., Main Campus Loop"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Distance (km)</label>
                <input
                  type="number"
                  value={newRoute.distance}
                  onChange={(e) => setNewRoute({ ...newRoute, distance: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRouteModal(false)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRoute}
                  className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Add Route
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
