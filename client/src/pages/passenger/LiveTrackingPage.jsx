import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { mockAssignments, mockLocation, mockStops } from '../../store/mockData';

const busIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="4" fill="%23FFB800"/><path d="M7 8h8V6H7V8ZM15 18V8h10V18H15ZM8 18h1v2H8v-2Zm15 0h1v2h-1v-2Z" fill="%23333333"/></svg>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export default function LiveTrackingPage() {
  const [assignment] = useState(mockAssignments[0]);
  const [stops] = useState(mockStops);
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const routeCoordinates = stops.map(s => [
    s.location.coordinates[1],
    s.location.coordinates[0]
  ]);

  const currentLocation = [mockLocation.coordinates[1], mockLocation.coordinates[0]];

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="glass p-4 rounded-xl shadow-lg overflow-hidden">
        <div className="map-container rounded-lg overflow-hidden">
          <MapContainer
            center={[23.19, 75.86]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Polyline positions={routeCoordinates} color="blue" weight={3} opacity={0.7} />
            {stops.map((stop, idx) => (
              <Marker
                key={stop._id}
                position={[stop.location.coordinates[1], stop.location.coordinates[0]]}
                icon={new L.Icon({
                  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
              >
                <Popup>{stop.name}</Popup>
              </Marker>
            ))}
            <Marker position={currentLocation} icon={busIcon}>
              <Popup>Bus G-47 - In Motion</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* Route and Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Route Info */}
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4">PRIMARY CORRIDOR • LINE 47</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="badge badge-success mt-0.5">● LIVE GPS</span>
              <div>
                <p className="font-bold text-gray-800">Palasia Square → AITR Campus</p>
                <p className="text-sm text-gray-600">Traversing Indore Bypass Corridor via Marg Junction.</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">Assigned Fleet Unit</p>
              <p className="font-semibold text-gray-800">Bus Unit G-47</p>
              <span className="badge badge-success text-xs mt-2">Live Conductor Verified</span>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry */}
        <div className="glass p-6 rounded-xl bg-gray-900/5 border border-gray-200/50">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🌐 REAL-TIME TELEMETRY STREAM</h3>
          <div className="text-sm space-y-3 font-mono">
            <div className="flex justify-between">
              <span className="text-gray-600">SPEED</span>
              <span className="text-gray-900 font-bold">32 km/h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">HEADING</span>
              <span className="text-gray-900 font-bold">NE (42°)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ETA BAY 2</span>
              <span className="text-gray-900 font-bold">6 mins</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">DIST</span>
              <span className="text-gray-900 font-bold">1.8 km</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-300">
              <span className="text-gray-600">Update:</span>
              <span className="text-gray-900 font-bold">{secondsAgo}s ago</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ◉ Next Point: Central Library Bay 2<br/>
              ↳ ON SCHEDULE
            </p>
          </div>
        </div>
      </div>

      {/* Timetable Advisory */}
      <div className="glass p-4 bg-blue-50 border-l-4 border-blue-500 rounded-xl">
        <div className="flex space-x-4">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-bold text-blue-900">Timetable Advisory Notice</h4>
            <p className="text-sm text-blue-800 mt-1">
              Please reach your designated campus stop 5 minutes prior to scheduled arrival to ensure uninterrupted dispatch.
            </p>
            <p className="text-xs text-blue-700 mt-2">Standard Shift 1 Morning</p>
          </div>
        </div>
      </div>
    </div>
  );
}
