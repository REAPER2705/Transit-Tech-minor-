import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';

export default function StaffPortal() {
  const [passengerCount, setPassengerCount] = useState(38);
  const [activeWaypoint, setActiveWaypoint] = useState(4);

  // Connect to store
  const { buses, updateBusOccupancy, addIncident, addNotification } = useAppStore();

  const handleAdjustCount = (delta) => {
    setPassengerCount(Math.max(0, Math.min(50, passengerCount + delta)));
  };

  const handleConfirmOccupancy = () => {
    updateBusOccupancy('G-47', passengerCount);
    addNotification({
      type: 'OCCUPANCY_CONFIRMED',
      title: 'Occupancy Confirmed',
      message: `Bus G-47 occupancy updated to ${passengerCount} passengers`,
    });
  };

  const handleReportIncident = (category, label) => {
    addIncident({
      category,
      description: label,
      location: 'Bypass Hub',
      routeId: 'ROUTE-01',
      busId: 'G-47',
      reportedBy: 'STAFF',
    });
    addNotification({
      type: 'INCIDENT_REPORTED',
      title: 'Incident Reported',
      message: `${label} incident has been reported`,
    });
  };

  const waypoints = [
    { order: 1, name: 'Palasia Square', time: '08:28 AM', boarded: 22, status: 'DEPARTED', done: true },
    { order: 2, name: 'Bengali Square', time: '08:42 AM', boarded: 8, status: 'DEPARTED', done: true },
    { order: 3, name: 'Pipliyahana Junction', time: '08:58 AM', boarded: 5, status: 'DEPARTED', done: true },
    { order: 4, name: 'Bypass Hub (MR-10 Ring)', time: '09:12 AM', boarded: 3, status: 'ARRIVED / DOCKED', active: true },
    { order: 5, name: 'Acropolis Campus Gate • Terminal', time: '09:25 AM', boarded: null, status: 'IN TRANSIT', done: false },
  ];

  const incidentOptions = [
    { id: 'congestion', icon: 'traffic', label: 'Heavy Traffic Congestion', color: 'error' },
    { id: 'delay', icon: 'schedule', label: 'Route Delay Report', color: 'warning' },
    { id: 'mechanical', icon: 'construction', label: 'Mechanical Issue', color: 'error' },
    { id: 'passenger', icon: 'groups', label: 'Passenger Incident', color: 'error' },
    { id: 'weather', icon: 'cloud_queue', label: 'Adverse Weather', color: 'warning' },
    { id: 'safety', icon: 'safety_check', label: 'Safety Concern', color: 'error' },
  ];

  return (
    <div className="w-full pt-16 bg-surface min-h-[calc(100vh-14rem)]">
      {/* Top Operational Sub-Bar */}
      <section className="w-full px-margin-desktop py-space-md bg-surface-container-low">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          {/* Unit Identity & Shift Badges */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center gap-space-xs px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface">
              <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                directions_bus
              </span>
              <span className="font-headline-md text-headline-md tracking-tight">UNIT G-47</span>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono">MP-09-FA-2024</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span>Route: Bypass Corridor • Shift 1 (08:20 AM – 02:40 PM)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px] text-tertiary">badge</span>
              <span>Role: Driver & Fleet Conductor (Dual Authorized)</span>
            </div>
          </div>

          {/* Live Heartbeat & Telemetry Status */}
          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-ping"></span>
              <span className="font-semibold text-tertiary">FLEET SYNC: ONLINE</span>
              <span className="text-outline">|</span>
              <span className="font-mono text-outline-variant text-[11px]">09:14:22 AM IST</span>
            </div>
            <button className="p-2 rounded-lg bg-surface-container-highest hover:bg-surface-variant text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[18px]">sync</span>
            </button>
          </div>
        </div>
      </section>

      {/* Campus Context Banner */}
      <section className="w-full px-margin-desktop py-space-sm">
        <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full pointer-events-none blur-2xl"></div>
          <div className="flex items-center gap-space-md z-10">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-[28px]">domain</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider block">Acropolis Institutional Hub</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Transit Command Center • Indore Campus Terminal</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Fleet vehicle attached to morning ingress pattern. Monitoring headway intervals, safe corridor ingress speeds, and seating headroom.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm z-10 w-full md:w-auto shrink-0">
            <div className="px-3 py-2 rounded-lg bg-surface-container text-center">
              <div className="font-label-sm text-label-sm text-outline">Target Campus Gate</div>
              <div className="font-headline-md text-headline-md text-primary font-bold">09:25 AM</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-surface-container text-center">
              <div className="font-label-sm text-label-sm text-outline">Scheduled Departure</div>
              <div className="font-headline-md text-headline-md text-on-surface font-bold">02:40 PM</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main 12-Column Canvas */}
      <div className="w-full px-margin-desktop py-space-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* LEFT COLUMN: Driver Controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            {/* GPS Broadcast Controller */}
            <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">sensors</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface leading-tight">GPS Broadcast & Telemetry</h3>
                    <span className="font-label-sm text-label-sm text-outline">NMEA High-Precision Dual Band L1/L5</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked type="checkbox" className="sr-only peer" />
                  <div className="w-12 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Telemetry Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                <div className="rounded-lg bg-surface-container p-space-sm flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Stream Rate</span>
                  <span className="font-telemetry-metric text-telemetry-metric text-primary">1.0 Hz</span>
                  <span className="font-label-sm text-label-sm text-outline mt-0.5">Continuous</span>
                </div>
                <div className="rounded-lg bg-surface-container p-space-sm flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Accuracy</span>
                  <span className="font-telemetry-metric text-telemetry-metric text-tertiary">±3.8 m</span>
                  <span className="font-label-sm text-label-sm text-outline mt-0.5">High Precision</span>
                </div>
                <div className="rounded-lg bg-surface-container p-space-sm flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Ground Speed</span>
                  <span className="font-telemetry-metric text-telemetry-metric text-on-surface">38 km/h</span>
                  <span className="font-label-sm text-label-sm text-outline mt-0.5">Optimal Range</span>
                </div>
                <div className="rounded-lg bg-surface-container p-space-sm flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Battery Optim.</span>
                  <span className="font-telemetry-metric text-telemetry-metric text-tertiary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">battery_saver</span> ACTIVE
                  </span>
                  <span className="font-label-sm text-label-sm text-outline mt-0.5">Wakelock Held</span>
                </div>
              </div>

              {/* Trip Action Triggers */}
              <div className="flex flex-col sm:flex-row items-center gap-space-sm pt-space-xs">
                <button className="w-full sm:flex-1 py-3 px-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-sm transition-all">
                  <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                  <span>Active Trip in Progress (Bypass Ingress)</span>
                </button>
                <button className="w-full sm:w-auto py-3 px-space-md rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-colors">
                  <span className="material-symbols-outlined text-[20px]">history</span>
                  <span>Trip Logs</span>
                </button>
              </div>

              {/* Live Broadcast Audit */}
              <div className="flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant pt-space-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                  Broadcasting to Central Transit Telematics & Passenger Radar
                </span>
                <span className="font-mono text-outline">Lat 22.8124°N, Long 75.9271°E</span>
              </div>
            </div>

            {/* Waypoint Timeline */}
            <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-tertiary-container text-on-tertiary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">pin_drop</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Ordered Corridor Waypoints</h3>
                </div>
                <span className="font-label-sm text-label-sm px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant">Step 4 of 5 Active</span>
              </div>

              {/* Vertical Timeline */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-container-highest">
                {waypoints.map((waypoint) => (
                  <div key={waypoint.order} className="relative flex items-start gap-space-md">
                    {waypoint.active ? (
                      <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary ring-4 ring-primary-fixed shadow-md animate-pulse">
                        <span className="material-symbols-outlined text-[13px]">navigation</span>
                      </span>
                    ) : waypoint.done ? (
                      <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary shadow-sm">
                        <span className="material-symbols-outlined text-[13px]">check</span>
                      </span>
                    ) : (
                      <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center text-outline">
                        <span className="material-symbols-outlined text-[13px]">flag</span>
                      </span>
                    )}
                    <div
                      className={`flex-1 rounded-lg p-space-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        waypoint.active ? 'bg-primary-fixed/30' : 'bg-surface-container-low'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-label-lg text-label-lg ${waypoint.active ? 'text-primary font-bold' : 'text-on-surface font-semibold'}`}>
                            Stop {waypoint.order}: {waypoint.name}
                          </span>
                          <span
                            className={`font-label-sm text-label-sm px-2 py-0.5 rounded font-mono ${
                              waypoint.active
                                ? 'bg-primary text-on-primary font-bold'
                                : 'bg-surface-container-lowest text-tertiary'
                            }`}
                          >
                            {waypoint.status}
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-outline">
                          {waypoint.boarded ? `${waypoint.boarded} Boarded` : 'Final drop-off'}
                        </span>
                      </div>
                      <div className="flex items-center gap-space-sm">
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-mono block">{waypoint.time}</span>
                        {waypoint.active && (
                          <button className="px-2.5 py-1 rounded bg-primary text-on-primary text-label-sm font-label-sm hover:bg-primary-container transition-all">
                            Mark Depart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campus Context Image */}
            <div className="rounded-xl overflow-hidden shadow-sm relative h-48 bg-surface-container">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSgxb_DcC3vxeW_-cin1qmZGtjOeJ4L_ETMgr2VDxZekfbchBOTRszeRk0HnAcv5Xs6CFlqaewKdIGkBdhAeHB07jnXq2fRCZEIEfqnH7mjpaMKGBx2WCgcVEUz9GJNo_4B3ApifODxCzJB4QJl7lFcPbpsIH5QOvZwZddIexlq_MRqX6coBING7Rcu18fTGXY4aQ-uYqlKIWh5ByC3Poz0jEka9nIA6soQGsahHvV6tl2KTT36e4fIA"
                alt="AITR Campus"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent flex items-end p-space-md text-inverse-on-surface">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <span className="font-label-sm text-label-sm tracking-wider uppercase text-tertiary-fixed-dim">Institutional Destination</span>
                    <p className="font-headline-md text-headline-md font-bold text-inverse-on-surface">Acropolis Institute (AITR) Terminal Bay 04</p>
                    <p className="font-body-sm text-body-sm text-inverse-on-surface/80">
                      Manglia Bypass Corridor • Speed Regulation: 25 km/h within gate radius
                    </p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="font-label-sm text-label-sm bg-surface-container-highest/20 backdrop-blur-md px-2.5 py-1 rounded text-inverse-on-surface">
                      Geofence Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Conductor Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            {/* Occupancy Counter Card */}
            <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-secondary text-on-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">groups</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface leading-tight">Occupancy Counter</h3>
                    <span className="font-label-sm text-label-sm text-outline">Conductor Live Manifest Intake</span>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed uppercase tracking-wider font-semibold">
                  Dual Conductor Auth
                </span>
              </div>

              {/* Large Metric Gauge */}
              <div className="rounded-xl bg-surface-container-low p-space-md flex flex-col gap-space-sm text-center">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Boarded Passengers</span>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="font-display-lg text-display-lg text-primary font-extrabold tracking-tight leading-none">{passengerCount}</span>
                  <span className="font-headline-xl text-headline-xl text-outline font-semibold">/ 50</span>
                </div>

                {/* Capacity Bar */}
                <div className="w-full flex flex-col gap-1.5 px-space-xs mt-1">
                  <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden flex">
                    <div className="bg-primary h-full transition-all duration-300 rounded-full" style={{ width: `${(passengerCount / 50) * 100}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-outline px-1">
                    <span>Safe Nominal Headroom ({Math.round((passengerCount / 50) * 100)}%)</span>
                    <span>{50 - passengerCount} Seats Remaining</span>
                  </div>
                </div>

                <div className="mt-1 flex items-center justify-center gap-space-sm text-label-sm font-label-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">airline_seat_recline_normal</span>
                    <span>50 Stated Seating Capacity</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-secondary">
                    <span className="material-symbols-outlined text-[16px]">security</span>
                    <span>+2 Transport Staff</span>
                  </span>
                </div>
              </div>

              {/* Adjustment Buttons */}
              <div className="grid grid-cols-3 gap-space-sm">
                <button
                  onClick={() => handleAdjustCount(-1)}
                  className="h-16 rounded-xl bg-surface-container hover:bg-surface-container-high text-error font-headline-xl text-headline-xl flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                >
                  -1
                </button>
                <button
                  onClick={() => handleAdjustCount(1)}
                  className="h-16 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-headline-xl text-headline-xl flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                >
                  +1
                </button>
                <button
                  onClick={() => handleAdjustCount(5)}
                  className="h-16 rounded-xl bg-surface-container-highest hover:bg-surface-variant text-primary font-headline-xl text-headline-xl flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                >
                  +5
                </button>
              </div>

              {/* Confirm Button */}
              <button onClick={handleConfirmOccupancy} className="w-full py-3.5 px-space-md rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm">
                <span className="material-symbols-outlined text-tertiary text-[20px]">verified</span>
                <span className="font-bold">Quick Confirm Capacity Broadcast</span>
              </button>

              {/* Audit Timestamp */}
              <div className="p-space-sm rounded-lg bg-surface-container text-on-surface-variant text-label-sm font-label-sm flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">history_toggle_off</span>
                  <span>Last confirmed sync:</span>
                </span>
                <span className="font-mono font-semibold text-on-surface">10:24 AM by Conductor</span>
              </div>
            </div>

            {/* Incident Dispatch Reporter */}
            <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">warning</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface leading-tight">One-Click Dispatch Reporter</h3>
                    <span className="font-label-sm text-label-sm text-outline">Instantly Broadcasts to Admin & Student HUD</span>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Tap any contingency event below to report route anomalies without typing during vehicle operation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                {incidentOptions.map((incident) => (
                  <button
                    key={incident.id}
                    onClick={() => handleReportIncident(incident.label, incident.label)}
                    className={`p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex flex-col items-center gap-2 transition-colors`}
                  >
                    <span className={`material-symbols-outlined text-[24px]`}>{incident.icon}</span>
                    <span className="font-bold text-center leading-tight">{incident.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
