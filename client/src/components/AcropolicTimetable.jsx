import { useEffect, useState } from 'react';
import { passengerAPI } from '../utils/api';

export default function AcropolicTimetable() {
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [timetableInfo, setTimetableInfo] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedShift, setSelectedShift] = useState('SHIFT_1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStops, setFilteredStops] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStopOnMap, setSelectedStopOnMap] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stopsRes, routesRes, infoRes] = await Promise.all([
        passengerAPI.getStops(),
        passengerAPI.getRoutes(),
        passengerAPI.getTimetableInfo(),
      ]);

      setStops(stopsRes.data.data || []);
      setRoutes(routesRes.data.data || []);
      setTimetableInfo(infoRes.data.data);
    } catch (err) {
      setError('Failed to load timetable data');
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
    setSelectedStopOnMap(stop);
    setSearchQuery('');
    setFilteredStops([]);

    try {
      const res = await passengerAPI.getStopSchedules(stop._id, { shift: selectedShift });
      setSchedules(res.data.data || []);
    } catch (err) {
      console.error('Error loading schedules:', err);
    }
  };

  // Load route details when route is selected
  const handleRouteSelect = async (route) => {
    setSelectedRoute(route);

    try {
      const res = await passengerAPI.getRouteDetails(route._id, { shift: selectedShift });
      setSchedules(res.data.data?.schedules || []);
    } catch (err) {
      console.error('Error loading route details:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading timetable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="glass p-4 bg-amber-50 border-l-4 border-amber-500">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900">Historical Timetable</h3>
            <p className="text-sm text-amber-800 mt-1">
              {timetableInfo?.sourceDate && `Published ${new Date(timetableInfo.sourceDate).toLocaleDateString()}`}
              {' — '}
              <strong>Current timings are unverified.</strong> Always verify with the transport office before planning your journey.
            </p>
            {timetableInfo?.liveTrackingMessage && (
              <p className="text-sm text-amber-800 mt-1">
                📍 {timetableInfo.liveTrackingMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Search & Select */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Find a Stop</h3>
            <input
              type="text"
              placeholder="Search stop name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {searchQuery && (
              <div className="mt-3 max-h-64 overflow-y-auto space-y-2">
                {filteredStops.length > 0 ? (
                  filteredStops.map((stop) => (
                    <button
                      key={stop._id}
                      onClick={() => handleStopSelect(stop)}
                      className={`w-full text-left p-2 rounded-lg transition-colors ${
                        selectedStop?._id === stop._id
                          ? 'bg-blue-100 border border-blue-300'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-800">{stop.name}</div>
                      <div className="text-xs text-gray-500">{stop.stopCode}</div>
                    </button>
                  ))
                ) : (
                  <div className="p-2 text-sm text-gray-600 text-center">No stops found</div>
                )}
              </div>
            )}
          </div>

          {/* Shift Filter */}
          <div className="glass p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Shift</h3>
            <div className="space-y-2">
              {['SHIFT_1', 'SHIFT_2'].map((shift) => (
                <label key={shift} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="shift"
                    value={shift}
                    checked={selectedShift === shift}
                    onChange={(e) => setSelectedShift(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">
                    {shift === 'SHIFT_1' ? 'Morning (8:30 AM - 2:40 PM)' : 'Afternoon (10:30 AM - 5:00 PM)'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Routes List */}
          <div className="glass p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Routes</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {routes.length > 0 ? (
                routes.map((route) => (
                  <button
                    key={route._id}
                    onClick={() => handleRouteSelect(route)}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      selectedRoute?._id === route._id
                        ? 'bg-blue-100 border border-blue-300'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-800">{route.name}</div>
                    <div className="text-xs text-gray-500">{route.stopIds?.length || 0} stops</div>
                  </button>
                ))
              ) : (
                <div className="text-sm text-gray-600 text-center py-4">No routes available</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Details & Timetable */}
        <div className="lg:col-span-2 space-y-4">
          {/* Selected Stop Info */}
          {selectedStop && (
            <div className="glass p-4 bg-blue-50 border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-2">{selectedStop.name}</h3>
              <p className="text-sm text-gray-600">Code: {selectedStop.stopCode}</p>
              {selectedStop.coordinatesVerified ? (
                <p className="text-xs text-green-600 mt-1">✓ Coordinates verified</p>
              ) : (
                <p className="text-xs text-amber-600 mt-1">⚠ Stop location not verified</p>
              )}
            </div>
          )}

          {/* Selected Route Info */}
          {selectedRoute && (
            <div className="glass p-4 bg-green-50 border border-green-200">
              <h3 className="font-semibold text-gray-800 mb-2">{selectedRoute.name}</h3>
              <p className="text-sm text-gray-600">Route Code: {selectedRoute.routeCode}</p>
              <p className="text-sm text-gray-600">Stops: {selectedRoute.stopIds?.length || 0}</p>
            </div>
          )}

          {/* Timetable */}
          {schedules.length > 0 ? (
            <div className="glass p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Schedules</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {schedules.map((schedule, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-800">
                          Bus {schedule.busId?.busCode || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {schedule.startTimeLocal} - {schedule.endTimeLocal}
                        </div>
                      </div>
                      <span className={`badge ${
                        schedule.shiftCode === 'SHIFT_1' 
                          ? 'badge-info' 
                          : 'badge-warning'
                      }`}>
                        {schedule.shiftCode === 'SHIFT_1' ? 'Morning' : 'Afternoon'}
                      </span>
                    </div>
                    {schedule.routeId && (
                      <div className="text-xs text-gray-600">
                        Route: {schedule.routeId.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass p-6 text-center">
              <p className="text-gray-600">
                {selectedStop || selectedRoute
                  ? 'No schedules available'
                  : 'Select a stop or route to view schedules'}
              </p>
            </div>
          )}

          {/* Map Placeholder */}
          <div className="glass p-4 bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-600 text-sm">
                {selectedStopOnMap
                  ? `${selectedStopOnMap.name} (map view)`
                  : 'Map view coming soon'}
              </p>
              {selectedStopOnMap && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedStopOnMap.coordinatesVerified 
                    ? '✓ Verified location'
                    : '⚠ Location unverified'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
