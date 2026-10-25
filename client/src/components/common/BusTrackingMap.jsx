import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useAppStore } from '../../store/appStore';

// Fix for default marker icons in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom yellow bus icon
const busIcon = L.divIcon({
  html: `
    <div class="flex flex-col items-center">
      <div class="relative filter drop-shadow-lg">
        <div class="w-10 h-10 rounded-2xl bg-yellow-400 border-2 border-yellow-600 flex items-center justify-center text-slate-900 shadow-lg">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
          </svg>
        </div>
      </div>
      <div class="mt-1 px-2 py-0.5 bg-white rounded text-xs font-bold text-slate-900 border border-slate-300 shadow-md whitespace-nowrap">
        Bus G-47
      </div>
    </div>
  `,
  iconSize: [50, 70],
  iconAnchor: [25, 70],
  popupAnchor: [0, -70],
});

// Stop marker icon
const stopIcon = L.divIcon({
  html: `
    <div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-blue-800 flex items-center justify-center text-white shadow-md">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function BusTrackingMap({ routeId, selectedBus, showStops = true }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const { buses, routes, stops, getStopsByRoute, getRouteById } = useAppStore();

  const bus = buses.find(b => b.id === selectedBus);
  const route = getRouteById(routeId);
  const routeStops = getStopsByRoute(routeId);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([22.7196, 75.8577], 15);

      // Add light OSM tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        tileSize: 256,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing layers except base layer
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Add route stops
    if (showStops && routeStops.length > 0) {
      routeStops.forEach((stop) => {
        if (stop.location) {
          L.marker([stop.location.lat, stop.location.lng], { icon: stopIcon })
            .bindPopup(
              `<div class="text-sm font-bold">${stop.name}</div><div class="text-xs text-slate-600">Stop ${routeStops.findIndex(s => s.id === stop.id) + 1}</div>`
            )
            .addTo(map);
        }
      });
    }

    // Add route path
    if (routeStops.length > 0) {
      const coordinates = routeStops
        .filter(stop => stop.location)
        .map(stop => [stop.location.lat, stop.location.lng]);

      if (coordinates.length > 1) {
        L.polyline(coordinates, {
          color: '#2563eb',
          weight: 5,
          opacity: 0.8,
          dashArray: '5, 5',
        }).addTo(map);
      }
    }

    // Add bus marker
    if (bus && bus.currentLocation) {
      L.marker([bus.currentLocation.lat, bus.currentLocation.lng], { icon: busIcon })
        .bindPopup(
          `<div class="font-bold">${bus.id}</div><div class="text-xs">Speed: ${bus.currentSpeed} km/h</div><div class="text-xs">Occupancy: ${bus.currentOccupancy}/${bus.capacity}</div>`
        )
        .addTo(map);

      // Center map on bus
      map.setView([bus.currentLocation.lat, bus.currentLocation.lng], 15);
    }
  }, [selectedBus, routeId, buses, stops, showStops, routeStops]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm" style={{ minHeight: '580px' }}>
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: '580px' }}
      />

      {/* Map controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="flex flex-col rounded-xl overflow-hidden bg-white/95 backdrop-blur-md border border-slate-200 shadow-md">
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.zoomIn();
              }
            }}
            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Zoom In"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="w-full h-px bg-slate-200"></div>
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.zoomOut();
              }
            }}
            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Zoom Out"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <button
          onClick={() => {
            if (mapInstanceRef.current && bus && bus.currentLocation) {
              mapInstanceRef.current.setView([bus.currentLocation.lat, bus.currentLocation.lng], 15);
            }
          }}
          className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-md transition-colors"
          title="Center on Bus"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.593 2.53a.75.75 0 00-1.055.852A9.001 9.001 0 1021 12a.75.75 0 00-1.5 0 7.5 7.5 0 11-15 0.75.75.75 0 00-1.493-.147A9 9 0 1021 12z" />
          </svg>
        </button>
      </div>

      {/* Top info bar */}
      <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-md text-slate-800 text-xs w-fit">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="font-semibold">
            {route ? `Route ${route.name}` : 'Live Tracking'}
          </span>
        </div>
      </div>

      {/* GPS status */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-slate-600 text-xs flex items-center gap-2 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-mono font-medium">GPS • {bus?.lastGPSUpdate ? `${Math.round((Date.now() - bus.lastGPSUpdate) / 1000)}s ago` : 'Unavailable'}</span>
        </div>
      </div>
    </div>
  );
}
