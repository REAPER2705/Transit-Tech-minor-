import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import realtimeStore from '../store/realtimeStore';
import { passengerAPI } from '../utils/api';

// Custom bus icon
const busIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI0IiBmaWxsPSIjRkZCODAwIi8+PHBhdGggZD0iTTcgOEgxNVY2SDdWOFpNMTUgMThWOEgyNVYxOEgxNVpNOCAxOEg5VjIwSDhWMThaTTIzIDE4SDI0VjIwSDIzVjE4WiIgZmlsbD0iIzMzMzMzMyIvPjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
      popupAnchor: [0, -16],
  });

const defaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function LiveTrackingMap() {
  const { currentTripId, tripLocation, joinTrip, leaveTrip } = realtimeStore();
  const [assignment, setAssignment] = useState(null);
  const [trip, setTrip] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationUpdatedAt, setLocationUpdatedAt] = useState(null);

  useEffect(() => {
    loadData();

    return () => {
      if (currentTripId) {
        leaveTrip(currentTripId);
      }
    };
  }, []);

  useEffect(() => {
    if (tripLocation) {
      setLocationUpdatedAt(new Date());
    }
  }, [tripLocation]);

  const loadData = async () => {
    try {
      const res = await passengerAPI.getBus();
      if (res.data.data?.assignment) {
        const { assignment: assign, trip: tripData } = res.data.data;
        setAssignment(assign);
        setTrip(tripData);
        
        if (tripData?._id) {
          joinTrip(tripData._id);
        }

        // Load route details
        // For now, mock route data
        setRoute({
          name: 'Palasia Square → AITR Campus',
          stops: [
            { id: '1', name: 'Palasia Square', lat: 23.1815, lng: 75.8483 },
            { id: '2', name: 'Tribunal Square', lat: 23.1842, lng: 75.8508 },
            { id: '3', name: 'Central Library', lat: 23.1898, lng: 75.8531 },
            { id: '4', name: 'AITR Campus', lat: 23.1942, lng: 75.8654 },
          ],
        });
      }
    } catch (error) {
      console.error('Error loading tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass p-8 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-r-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600">Loading live tracking...</p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="glass p-8 text-center">
        <p className="text-gray-600">No active assignment found</p>
      </div>
    );
  }

  const currentLocation = tripLocation
    ? [tripLocation.coordinates[1], tripLocation.coordinates[0]]
    : null;
  const secondsAgo = locationUpdatedAt
    ? Math.floor((Date.now() - locationUpdatedAt.getTime()) / 1000)
    : null;

  return (
    <div className="space-y-6">
      {/* Map */}
      <div className="glass p-4">
        <div className="map-container">
          <MapContainer
            center={[23.19, 75.86]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {/* Route polyline */}
            {route?.stops && route.stops.length > 1 && (
              <Polyline
                positions={route.stops.map(s => [s.lat, s.lng])}
                color="blue"
                weight={3}
                opacity={0.7}
              />
            )}

            {/* Stops */}
            {route?.stops?.map(stop => (
              <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={defaultIcon}>
                <Popup>{stop.name}</Popup>
              </Marker>
            ))}

            {/* Current bus location */}
            {currentLocation && (
              <Marker position={currentLocation} icon={busIcon}>
                <Popup>
                  <div>
                    <p className="font-bold">Bus G-47</p>
                    <p className="text-sm">
                      Update: {secondsAgo}s ago
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>

      {/* Route Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Route</p>
              <p className="font-medium text-gray-800">{route?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Boarding Stop</p>
              <p className="font-medium text-gray-800">
                {assignment?.boardingStopId?.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bus Unit</p>
              <p className="font-medium text-gray-800">
                {assignment?.busId?.busCode}
                <span className="badge badge-success ml-2">Live GPS</span>
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry */}
        <div className="glass p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Real-time Telemetry</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Speed</span>
              <span className="font-medium text-gray-800">--</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Heading</span>
              <span className="font-medium text-gray-800">--</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Distance Remaining</span>
              <span className="font-medium text-gray-800">--</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ETA to Destination</span>
              <span className="font-medium text-gray-800">--</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last Update</span>
              <span className="font-medium text-gray-800">
                {locationUpdatedAt
                  ? `${secondsAgo}s ago`
                  : 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timetable Advisory */}
      <div className="glass p-4 bg-blue-50 border-l-4 border-blue-500">
        <div className="flex space-x-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-900">Timetable Advisory Notice</h4>
            <p className="text-sm text-blue-800 mt-1">
              Please reach your designated campus stop 5 minutes prior to scheduled arrival to ensure uninterrupted dispatch.
            </p>
            <p className="text-xs text-blue-700 mt-2">Standard Shift 1 Morning</p>
          </div>
        </div>
      </div>

      {/* Campus Landmarks */}
      <div className="glass p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">AITR Campus Corridor Landmarks</h3>
        <div className="text-sm text-gray-600">
          <p>Spatial transit landmarks captured on the Indore Bypass approach</p>
        </div>
      </div>
    </div>
  );
}
