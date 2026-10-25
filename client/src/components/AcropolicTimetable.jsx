import { useEffect, useState } from 'react';
import { passengerAPI } from '../utils/api';

export default function AcropolicTimetable() {
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [timetableInfo, setTimetableInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStops, setFilteredStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedShift, setSelectedShift] = useState('SHIFT_1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stopsRes, routesRes, busesRes, infoRes] = await Promise.all([
        passengerAPI.getStops(),
        passengerAPI.getRoutes(),
        passengerAPI.getBuses(),
        passengerAPI.getTimetableInfo(),
      ]);

      setStops(stopsRes.data.data || []);
      setRoutes(routesRes.data.data || []);
      setBuses(busesRes.data.data || []);
      setTimetableInfo(infoRes.data.data);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search stops
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStops([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = stops.filter(
      stop =>
        stop.name.toLowerCase().includes(query) ||
        stop.stopCode.toLowerCase().includes(query)
    );
    setFilteredStops(filtered);
  }, [searchQuery, stops]);

  // Load schedules when stop is selected
  const handleStopSelect = async (stop) => {
    setSelectedStop(stop);
    setSearchQuery('');
    setFilteredStops([]);

    try {
      const res = await passengerAPI.getStopSchedules(stop._id, { shift: selectedShift });
      setSchedules(res.data.data || []);
    } catch (err) {
      console.error('Error loading schedules:', err);
    }
  };

  const handleShiftChange = (newShift) => {
    setSelectedShift(newShift);
    if (selectedStop) {
      handleStopSelect(selectedStop);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading campus transit directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Campus Transit Schedule & Routes Directory</h1>
        <p className="text-blue-100 mb-6">Real-time access to Acropolis bus transport timetables</p>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a bus stop by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
          />
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {filteredStops.length > 0 ? (
                filteredStops.map((stop) => (
                  <button
                    key={stop._id}
                    onClick={() => handleStopSelect(stop)}
                    className="w-full text-left px-6 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{stop.name}</div>
                    <div className="text-sm text-gray-600">{stop.stopCode}</div>
                  </button>
                ))
              ) : (
                <div className="px-6 py-3 text-center text-gray-600">No stops found</div>
              )}
            </div>
          )}
        </div>

        {/* Source Attribution */}
        <div className="mt-6 p-3 bg-white/15 rounded-lg text-sm text-blue-50 border border-white/30">
          <span className="font-medium">📋 Data Source:</span> September 1, 2023 • 
          <a 
            href="https://www.scribd.com/document/703073096/BusRoute-Sep23-1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-white ml-1"
          >
            Scribd Document
          </a>
          {' • '}
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
            Unverified Data
          </span>
        </div>
      </div>

      {/* Fleet Units Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Active Fleet Units</h2>
        {buses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buses.map((bus) => (
              <div key={bus._id} className="glass p-5 rounded-lg hover:shadow-md transition-shadow border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Bus Unit {bus.busCode}</h3>
                    <p className="text-sm text-gray-600 mt-1">Fleet ID: {bus._id.substring(0, 8)}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">Active</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{bus.capacity || 50} seats</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">{bus.operationalStatus || 'Operational'}</span>
                  </div>
                  {bus.sourceDate && (
                    <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                      Data: {new Date(bus.sourceDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass p-8 text-center rounded-lg bg-gray-50">
            <p className="text-gray-600">No fleet units currently available</p>
          </div>
        )}
      </div>

      {/* Shift Selection */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Shifts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['SHIFT_1', 'SHIFT_2'].map((shift) => (
            <button
              key={shift}
              onClick={() => handleShiftChange(shift)}
              className={`p-4 rounded-lg text-left transition-all ${
                selectedShift === shift
                  ? 'glass border-2 border-blue-500 bg-blue-50'
                  : 'glass border border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-800">
                {shift === 'SHIFT_1' ? '🌅 Morning Service' : '🌤️ Afternoon Service'}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {shift === 'SHIFT_1' ? '08:30 - 14:40' : '10:30 - 17:00'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Routes & Stops Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Routes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Routes</h2>
          {routes.length > 0 ? (
            <div className="space-y-3">
              {routes.map((route) => (
                <div key={route._id} className="glass p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-800">{route.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-600">🚏 {route.stopIds?.length || 0} stops</p>
                    {route.sourceDate && (
                      <p className="text-xs text-gray-500">
                        {new Date(route.sourceDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass p-6 text-center bg-gray-50 rounded-lg">
              <p className="text-gray-600">No routes available</p>
            </div>
          )}
        </div>

        {/* All Stops */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Bus Stops Directory</h2>
          {stops.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stops.map((stop) => (
                <button
                  key={stop._id}
                  onClick={() => handleStopSelect(stop)}
                  className={`w-full text-left p-4 rounded-lg transition-all border ${
                    selectedStop?._id === stop._id
                      ? 'glass bg-blue-50 border-blue-500 shadow-md'
                      : 'glass border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{stop.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{stop.stopCode}</p>
                    </div>
                    <span className="text-lg">🚏</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="glass p-6 text-center bg-gray-50 rounded-lg">
              <p className="text-gray-600">No stops available</p>
            </div>
          )}
        </div>
      </div>

      {/* Selected Stop Details */}
      {selectedStop && (
        <div className="glass p-6 rounded-lg bg-blue-50 border-2 border-blue-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">📍 {selectedStop.name}</h2>
              <p className="text-gray-600 mt-1">Stop Code: <span className="font-medium">{selectedStop.stopCode}</span></p>
            </div>
            <button
              onClick={() => {
                setSelectedStop(null);
                setSchedules([]);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Schedules for Selected Stop */}
          {schedules.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule & Timings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schedules.map((schedule, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-gray-800 text-lg">
                          🚌 Bus {schedule.busId?.busCode || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          ⏱️ {schedule.startTimeLocal} — {schedule.endTimeLocal}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        schedule.shiftCode === 'SHIFT_1' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {schedule.shiftCode === 'SHIFT_1' ? 'Morning' : 'Afternoon'}
                      </span>
                    </div>
                    {schedule.routeId && (
                      <p className="text-xs text-gray-600">
                        Route: {schedule.routeId.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-white rounded-lg text-center text-gray-600">
              No schedules available for this stop in the selected shift.
            </div>
          )}
        </div>
      )}

      {/* Footer Attribution */}
      <div className="glass p-4 rounded-lg bg-gray-50 border border-gray-200 text-center text-sm text-gray-600">
        <p>
          This timetable contains historical data from 
          <a 
            href="https://www.scribd.com/document/703073096/BusRoute-Sep23-1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline ml-1"
          >
            September 1, 2023 source
          </a>
          . Data is unverified and for reference only. Always contact the transport office for current schedules.
        </p>
      </div>
    </div>
  );
}
