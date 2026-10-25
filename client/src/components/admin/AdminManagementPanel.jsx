import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';

const API_BASE = 'http://localhost:5000/api/v1';

export default function AdminManagementPanel() {
  const { buses, routes, stops } = useAppStore();
  const [activeTab, setActiveTab] = useState('buses');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Bus Management State
  const [busForm, setBusForm] = useState({ busCode: '', registrationNumber: '', capacity: 50 });
  const [busList, setBusList] = useState([]);

  // Route Management State
  const [routeForm, setRouteForm] = useState({ routeCode: '', name: '', stopIds: [] });
  const [routeList, setRouteList] = useState([]);

  // Stop Management State
  const [stopForm, setStopForm] = useState({ stopCode: '', name: '', latitude: 0, longitude: 0 });
  const [stopList, setStopList] = useState([]);

  // Schedule Management State
  const [scheduleForm, setScheduleForm] = useState({
    scheduleCode: '',
    shiftCode: 'SHIFT-1',
    startTimeLocal: '08:00',
    endTimeLocal: '16:00',
    serviceDate: new Date().toISOString().split('T')[0],
    routeId: '',
    busId: '',
    driverId: '',
    conductorId: '',
  });
  const [scheduleList, setScheduleList] = useState([]);

  const getToken = () => localStorage.getItem('authToken');

  // Fetch data on tab change
  useEffect(() => {
    if (activeTab === 'buses') {
      fetchBuses();
    } else if (activeTab === 'routes') {
      fetchRoutes();
    } else if (activeTab === 'stops') {
      fetchStops();
    } else if (activeTab === 'schedules') {
      fetchSchedules();
    }
  }, [activeTab]);

  // ===== BUS MANAGEMENT =====
  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/buses`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch buses');
      const json = await response.json();
      setBusList(json.data);
    } catch (err) {
      console.error('Error fetching buses:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createBus = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/buses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(busForm),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to create bus');
      }
      const json = await response.json();
      setBusList([...busList, json.data]);
      setBusForm({ busCode: '', registrationNumber: '', capacity: 50 });
      setSuccess('Bus created successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error creating bus:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBus = async (busId, updates) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/buses/${busId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update bus');
      const json = await response.json();
      setBusList(busList.map(b => b._id === busId ? json.data : b));
      setSuccess('Bus updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating bus:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== ROUTE MANAGEMENT =====
  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/routes`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch routes');
      const json = await response.json();
      setRouteList(json.data);
    } catch (err) {
      console.error('Error fetching routes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRoute = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/routes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routeForm),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to create route');
      }
      const json = await response.json();
      setRouteList([...routeList, json.data]);
      setRouteForm({ routeCode: '', name: '', stopIds: [] });
      setSuccess('Route created successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error creating route:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== STOP MANAGEMENT =====
  const fetchStops = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/stops`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch stops');
      const json = await response.json();
      setStopList(json.data);
    } catch (err) {
      console.error('Error fetching stops:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createStop = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/stops`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stopForm),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to create stop');
      }
      const json = await response.json();
      setStopList([...stopList, json.data]);
      setStopForm({ stopCode: '', name: '', latitude: 0, longitude: 0 });
      setSuccess('Stop created successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error creating stop:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== SCHEDULE MANAGEMENT =====
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/schedules`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch schedules');
      const json = await response.json();
      setScheduleList(json.data);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/schedules`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleForm),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to create schedule');
      }
      const json = await response.json();
      setScheduleList([...scheduleList, json.data.schedule]);
      setScheduleForm({
        scheduleCode: '',
        shiftCode: 'SHIFT-1',
        startTimeLocal: '08:00',
        endTimeLocal: '16:00',
        serviceDate: new Date().toISOString().split('T')[0],
        routeId: '',
        busId: '',
        driverId: '',
        conductorId: '',
      });
      setSuccess('Schedule created successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error creating schedule:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-space-lg bg-surface-container-lowest rounded-xl">
      {/* Tab Navigation */}
      <div className="flex items-center gap-space-sm mb-space-lg border-b border-outline-variant">
        {['buses', 'routes', 'stops', 'schedules'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-space-md py-2 font-label-md text-label-md border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary text-on-surface'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Error & Success Messages */}
      {error && (
        <div className="mb-space-md p-space-sm rounded-lg bg-error-container text-on-error-container flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}
      {success && (
        <div className="mb-space-md p-space-sm rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {success}
        </div>
      )}

      {/* Buses Tab */}
      {activeTab === 'buses' && (
        <div className="space-y-space-lg">
          <form onSubmit={createBus} className="p-space-md bg-surface-container rounded-lg space-y-space-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface">Create Bus</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
              <input
                type="text"
                placeholder="Bus Code (e.g., G-47)"
                value={busForm.busCode}
                onChange={(e) => setBusForm({ ...busForm, busCode: e.target.value })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
                required
              />
              <input
                type="text"
                placeholder="Registration Number"
                value={busForm.registrationNumber}
                onChange={(e) => setBusForm({ ...busForm, registrationNumber: e.target.value })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={busForm.capacity}
                onChange={(e) => setBusForm({ ...busForm, capacity: parseInt(e.target.value) })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-on-primary-fixed-variant disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Bus'}
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase">
                <tr>
                  <th className="px-3 py-2">Bus Code</th>
                  <th className="px-3 py-2">Registration</th>
                  <th className="px-3 py-2">Capacity</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {busList.map((bus) => (
                  <tr key={bus._id} className="hover:bg-surface-container-high transition-colors">
                    <td className="px-3 py-2 font-bold text-primary">{bus.busCode}</td>
                    <td className="px-3 py-2">{bus.registrationNumber || '-'}</td>
                    <td className="px-3 py-2">{bus.capacity}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-label-sm font-bold ${
                        bus.status === 'ACTIVE' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container text-on-surface'
                      }`}>
                        {bus.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => updateBus(bus._id, { status: bus.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })}
                        className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-label-sm"
                      >
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Routes Tab */}
      {activeTab === 'routes' && (
        <div className="space-y-space-lg">
          <form onSubmit={createRoute} className="p-space-md bg-surface-container rounded-lg space-y-space-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface">Create Route</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
              <input
                type="text"
                placeholder="Route Code"
                value={routeForm.routeCode}
                onChange={(e) => setRouteForm({ ...routeForm, routeCode: e.target.value })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
                required
              />
              <input
                type="text"
                placeholder="Route Name"
                value={routeForm.name}
                onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-on-primary-fixed-variant disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Route'}
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase">
                <tr>
                  <th className="px-3 py-2">Route Code</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Stops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {routeList.map((route) => (
                  <tr key={route._id} className="hover:bg-surface-container-high transition-colors">
                    <td className="px-3 py-2 font-bold text-primary">{route.routeCode}</td>
                    <td className="px-3 py-2">{route.name}</td>
                    <td className="px-3 py-2 text-on-surface-variant">{route.stopIds?.length || 0} stops</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stops Tab */}
      {activeTab === 'stops' && (
        <div className="space-y-space-lg">
          <form onSubmit={createStop} className="p-space-md bg-surface-container rounded-lg space-y-space-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface">Create Stop</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-space-sm">
              <input
                type="text"
                placeholder="Stop Code"
                value={stopForm.stopCode}
                onChange={(e) => setStopForm({ ...stopForm, stopCode: e.target.value })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
                required
              />
              <input
                type="text"
                placeholder="Stop Name"
                value={stopForm.name}
                onChange={(e) => setStopForm({ ...stopForm, name: e.target.value })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
                required
              />
              <input
                type="number"
                step="0.0001"
                placeholder="Latitude"
                value={stopForm.latitude}
                onChange={(e) => setStopForm({ ...stopForm, latitude: parseFloat(e.target.value) })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
                required
              />
              <input
                type="number"
                step="0.0001"
                placeholder="Longitude"
                value={stopForm.longitude}
                onChange={(e) => setStopForm({ ...stopForm, longitude: parseFloat(e.target.value) })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-on-primary-fixed-variant disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Stop'}
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase">
                <tr>
                  <th className="px-3 py-2">Stop Code</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Coordinates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {stopList.map((stop) => (
                  <tr key={stop._id} className="hover:bg-surface-container-high transition-colors">
                    <td className="px-3 py-2 font-bold text-primary">{stop.stopCode}</td>
                    <td className="px-3 py-2">{stop.name}</td>
                    <td className="px-3 py-2 text-on-surface-variant font-mono text-[11px]">
                      {stop.location?.coordinates?.map(c => c.toFixed(4)).join(', ') || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedules Tab */}
      {activeTab === 'schedules' && (
        <div className="space-y-space-lg">
          <form onSubmit={createSchedule} className="p-space-md bg-surface-container rounded-lg space-y-space-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface">Create Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-space-sm">
              <input
                type="text"
                placeholder="Schedule Code"
                value={scheduleForm.scheduleCode}
                onChange={(e) => setScheduleForm({ ...scheduleForm, scheduleCode: e.target.value })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
                required
              />
              <select
                value={scheduleForm.shiftCode}
                onChange={(e) => setScheduleForm({ ...scheduleForm, shiftCode: e.target.value })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
              >
                <option>SHIFT-1</option>
                <option>SHIFT-2</option>
              </select>
              <input
                type="date"
                value={scheduleForm.serviceDate}
                onChange={(e) => setScheduleForm({ ...scheduleForm, serviceDate: e.target.value })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
                required
              />
              <input
                type="time"
                value={scheduleForm.startTimeLocal}
                onChange={(e) => setScheduleForm({ ...scheduleForm, startTimeLocal: e.target.value })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
              <input
                type="time"
                value={scheduleForm.endTimeLocal}
                onChange={(e) => setScheduleForm({ ...scheduleForm, endTimeLocal: e.target.value })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
                required
              />
              <select
                value={scheduleForm.routeId}
                onChange={(e) => setScheduleForm({ ...scheduleForm, routeId: e.target.value })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
              >
                <option value="">Select Route</option>
                {routeList.map(r => <option key={r._id} value={r._id}>{r.routeCode}</option>)}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-on-primary-fixed-variant disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Schedule'}
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase">
                <tr>
                  <th className="px-3 py-2">Schedule Code</th>
                  <th className="px-3 py-2">Shift</th>
                  <th className="px-3 py-2">Start Time</th>
                  <th className="px-3 py-2">End Time</th>
                  <th className="px-3 py-2">Route</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {scheduleList.map((schedule) => (
                  <tr key={schedule._id} className="hover:bg-surface-container-high transition-colors">
                    <td className="px-3 py-2 font-bold text-primary">{schedule.scheduleCode}</td>
                    <td className="px-3 py-2">{schedule.shiftCode}</td>
                    <td className="px-3 py-2">{schedule.startTimeLocal}</td>
                    <td className="px-3 py-2">{schedule.endTimeLocal}</td>
                    <td className="px-3 py-2 text-on-surface-variant">{schedule.routeId?.routeCode || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
