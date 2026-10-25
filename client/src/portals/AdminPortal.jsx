import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';

export default function AdminPortal() {
  const [activeShift, setActiveShift] = useState('shift1');
  const { buses, complaints, incidents, getStats, updateComplaintStatus, updateIncidentStatus } = useAppStore();

  const stats = getStats();
  const activeBuses = buses.filter(b => b.status === 'ACTIVE').length;

  const kpis = [
    {
      title: 'Active Fleet Network',
      value: activeBuses,
      total: buses.length,
      metric: `${buses.length > 0 ? ((activeBuses / buses.length) * 100).toFixed(1) : 0}% Operational`,
      icon: 'directions_bus',
      bgColor: 'bg-primary-fixed',
      textColor: 'text-on-primary-fixed',
    },
    {
      title: 'Active Trips',
      value: stats.activeTrips,
      metric: 'In Progress',
      icon: 'trip_origin',
      bgColor: 'bg-secondary-fixed',
      textColor: 'text-on-secondary-fixed',
    },
    {
      title: 'Open Incidents',
      value: stats.openIncidents,
      metric: 'Require Action',
      icon: 'warning',
      bgColor: 'bg-error-fixed',
      textColor: 'text-on-error-fixed',
    },
    {
      title: 'Pending Complaints',
      value: complaints.filter(c => c.status === 'SUBMITTED').length,
      metric: 'Awaiting Review',
      icon: 'feedback',
      bgColor: 'bg-tertiary-fixed',
      textColor: 'text-on-tertiary-fixed',
    },
    {
      title: 'Total Routes',
      value: stats.totalRoutes,
      metric: `${stats.totalStops} Campus Stops`,
      icon: 'route',
      bgColor: 'bg-primary-fixed',
      textColor: 'text-on-primary-fixed',
    },
    {
      title: 'Unverified Schedules',
      value: stats.unverifiedTimetables,
      metric: 'Pending Verification',
      icon: 'schedule',
      bgColor: 'bg-tertiary-fixed',
      textColor: 'text-on-tertiary-fixed',
      hasBorder: true,
    },
  ];

  // Use actual bus data from store instead of mock fleetData

  return (
    <div className="w-full pt-16 bg-surface min-h-[calc(100vh-14rem)]">
      {/* Top Command Ribbon */}
      <section className="w-full px-margin-desktop py-space-md bg-surface-container-low">
        <div className="w-full flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-md">
          <div className="flex flex-col md:flex-row md:items-center gap-space-md">
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                TRANSPORT ADMINISTRATOR
              </span>
              <span className="font-body-sm text-body-sm text-outline">|</span>
              <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-tertiary">domain</span>
                Acropolis Institute (AITR) Manglia Bypass Depot
              </span>
            </div>
            <div className="flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant">
              <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface">SYS-OPS REV: 2025.4.19</span>
              <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> GPS TELEMETRY SYNCED
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-space-sm w-full xl:w-auto">
            <button className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">download</span> Export Daily Roster
            </button>
            <button className="px-space-md py-2 rounded-lg bg-error-container hover:bg-error hover:text-on-error text-on-error-container font-label-lg text-label-lg transition-colors flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">cell_tower</span> Dispatch Broadcast
            </button>
            <button className="px-space-md py-2 rounded-lg bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-lg text-label-lg transition-colors flex items-center gap-1.5 shadow-md">
              <span className="material-symbols-outlined text-[18px]">verified</span> Verify & Publish Master Portal
            </button>
          </div>
        </div>
      </section>

      {/* KPI Telemetry Bento Matrix */}
      <div className="w-full px-margin-desktop py-space-xl">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-md">
          {kpis.map((kpi, idx) => (
            <div
              key={idx}
              className={`p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between relative overflow-hidden ${kpi.hasBorder ? 'border-l-4 border-l-error' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md uppercase tracking-wider text-outline">{kpi.title}</span>
                {kpi.icon && (
                  <span className={`w-8 h-8 rounded-lg ${kpi.bgColor || 'bg-primary-fixed'} ${kpi.textColor || 'text-on-primary-fixed'} flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-[18px]">{kpi.icon}</span>
                  </span>
                )}
              </div>

              <div className="my-space-md">
                {kpi.value && (
                  <div className="flex items-baseline gap-2">
                    <span className={`font-headline-xl text-headline-xl text-on-surface ${kpi.valueColor || ''}`}>{kpi.value}</span>
                    {kpi.total && <span className="font-headline-md text-headline-md text-outline">/ {kpi.total}</span>}
                  </div>
                )}
                <p className={`font-body-sm text-body-sm ${kpi.valueColor ? kpi.valueColor : 'text-tertiary'} flex items-center gap-1 mt-1`}>
                  {kpi.metric === '90.4% Operational Readiness' && (
                    <>
                      <span className="material-symbols-outlined text-[16px]">check_circle</span> {kpi.metric}
                    </>
                  )}
                  {kpi.metric !== '90.4% Operational Readiness' && kpi.metric}
                </p>
              </div>

              {kpi.status && (
                <span className={`px-2 py-0.5 rounded-full ${kpi.statusBg} ${kpi.statusText} font-label-sm text-label-sm uppercase font-bold`}>
                  {kpi.status}
                </span>
              )}

              {kpi.value === '38' && (
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden flex gap-0.5 mt-2">
                  <div className="bg-tertiary h-full w-[85%] rounded-full"></div>
                  <div className="bg-secondary-container h-full w-[5%]"></div>
                  <div className="bg-error-container h-full w-[10%]"></div>
                </div>
              )}

              {kpi.hasBorder && (
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-outline">Publication Guard:</span>
                  <span className="text-primary font-bold">Lock Active</span>
                </div>
              )}
            </div>
          ))}
        </section>
      </div>

      {/* Context Section: Campus & Flow Analytics */}
      <div className="w-full px-margin-desktop py-space-lg">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Campus Context */}
          <div className="lg:col-span-8 p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col md:flex-row gap-space-lg items-center">
            <div className="w-full md:w-1/2 h-56 rounded-lg overflow-hidden relative shadow-sm">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuufXekciwjl6pejt5EuQzj4S4VIVgQuaJ-vEgHsryQYsXXAyIit_Xk41X3yv8jfd8-ZRPO5fIVm8K_4lrAMW1SYnpTfmlzWSuzKy5i632o_WUShbKnCJufHcpxf8yfek7D5LybC3Dc6UgOGutV9N4FfVdemKAjAkQBcoxByRlSoKlyV3Yrl5Atkyy-TMJ3qgYwO0vvZ2q3STrmDVhG7lm5bvU23mxDxBtW7IvbT82xHDLPQfpNKYiVg"
                alt="AITR Campus"
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface font-label-sm text-label-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-tertiary-fixed">location_on</span>
                AITR Main Campus Gateway & Ring Parking
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between h-full space-y-space-sm">
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm uppercase">
                  Operational Fleet Depot
                </div>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mt-2">Bypass Terminal Fleet Coordination</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Serving undergraduate, postgraduate, and faculty transport schedules across Indore metropolis, Rau, Dewas Naka, and Vijay Nagar corridors.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                <div className="p-space-sm rounded-lg bg-surface-container-low">
                  <span className="font-label-sm text-label-sm text-outline uppercase block">Campus Fleet Capacity</span>
                  <span className="font-headline-md text-headline-md text-on-surface">2,184 Seats</span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low">
                  <span className="font-label-sm text-label-sm text-outline uppercase block">Active GPS Trackers</span>
                  <span className="font-headline-md text-headline-md text-tertiary">38 Units (95%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Peak Flow Analytics */}
          <div className="lg:col-span-4 p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-lg text-label-lg font-bold text-on-surface">Peak Congestion & Fleet Flow</span>
              <span className="font-label-sm text-label-sm text-outline">Real-Time Sensor Array</span>
            </div>

            {/* Flow Chart SVG */}
            <div className="w-full my-space-md">
              <svg className="w-full h-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 320 100">
                <defs>
                  <linearGradient id="fleetGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.0"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M0,80 Q40,65 80,45 T160,20 T240,40 T320,70 L320,100 L0,100 Z"
                  fill="url(#fleetGradient)"
                  stroke="none"
                ></path>
                <path d="M0,80 Q40,65 80,45 T160,20 T240,40 T320,70" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                <circle className="fill-surface stroke-primary" cx="80" cy="45" r="4" strokeWidth="2"></circle>
                <circle className="fill-surface stroke-primary" cx="160" cy="20" r="4" strokeWidth="2"></circle>
                <circle className="fill-surface stroke-primary" cx="240" cy="40" r="4" strokeWidth="2"></circle>
              </svg>
              <div className="flex justify-between text-label-sm font-label-sm text-outline px-1">
                <span>07:30 AM (Inbound)</span>
                <span className="font-bold text-primary">08:15 AM (Peak Peak)</span>
                <span>02:40 PM (Shift 1 Out)</span>
              </div>
            </div>

            <div className="p-space-sm rounded-lg bg-surface-container-high flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
                <span className="font-label-md text-label-md text-on-surface">Average Bypass Corridor Speed</span>
              </div>
              <span className="font-headline-md text-headline-md text-on-surface">41.8 km/h</span>
            </div>
          </div>
        </section>
      </div>

      {/* Isolated Shift Import Center */}
      <div className="w-full px-margin-desktop py-space-lg">
        <section className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md space-y-space-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Isolated Shift Import Center</h2>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold uppercase">
                  Safe Mode
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Prevent accidental timetable cross-contamination with shift-isolated parsing engines.
              </p>
            </div>

            {/* Shift Toggle */}
            <div className="flex items-center p-1 bg-surface-container rounded-lg">
              <button
                onClick={() => setActiveShift('shift1')}
                className={`shift-toggle-btn px-space-md py-1.5 rounded-md font-label-md text-label-md font-bold transition-all flex items-center gap-1.5 ${
                  activeShift === 'shift1'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed"></span> Shift 1 Import (08:20 AM)
              </button>
              <button
                onClick={() => setActiveShift('shift2')}
                className={`shift-toggle-btn px-space-md py-1.5 rounded-md font-label-md text-label-md transition-all flex items-center gap-1.5 ${
                  activeShift === 'shift2'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-outline"></span> Shift 2 Import (10:30 AM)
              </button>
            </div>
          </div>

          {/* Import Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
            {/* Drag & Drop Area */}
            <div className="lg:col-span-5 p-space-lg rounded-xl bg-surface-container-low flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-surface-container transition-all">
              <div className="w-14 h-14 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-space-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">upload_file</span>
              </div>
              <span className="font-label-lg text-label-lg font-bold text-on-surface">Drop Master CSV / Excel Timetable</span>
              <span className="font-body-sm text-body-sm text-outline mt-1">Accepts UTF-8 formatted CSV or XLSX exports from Institutional ERP</span>
              <div className="mt-space-md flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm">ISO-2015 SCHEMA</span>
                <span className="px-2.5 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">MAX 5MB</span>
              </div>
              <p className="mt-space-md font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">lock</span> Currently Targeting: {activeShift === 'shift1' ? 'Shift 1' : 'Shift 2'} Routing Matrix
              </p>
            </div>

            {/* Validation Buffer & Fleet Table */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-surface-container-lowest p-space-md rounded-xl">
              <div className="flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">task_alt</span>
                  <span className="font-label-lg text-label-lg font-bold text-on-surface">Validation Buffer & Conflict Verification</span>
                </div>
                <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                  ✓ No Active Vehicle Overlap Detected
                </span>
              </div>

              {/* Fleet Validation Table */}
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase">
                    <tr>
                      <th className="px-space-sm py-2">Bus Identifier</th>
                      <th className="px-space-sm py-2">Status</th>
                      <th className="px-space-sm py-2">Route</th>
                      <th className="px-space-sm py-2">Occupancy</th>
                      <th className="px-space-sm py-2">Last Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-0 text-on-surface font-body-sm">
                    {buses.map((bus) => (
                      <tr key={bus.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-space-sm py-2 font-bold font-mono text-primary">{bus.id}</td>
                        <td className="px-space-sm py-2">
                          <span className={`px-2 py-0.5 rounded text-label-sm font-bold ${
                            bus.status === 'ACTIVE' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container text-on-surface'
                          }`}>
                            {bus.status}
                          </span>
                        </td>
                        <td className="px-space-sm py-2">{bus.assignedRoute || 'Unassigned'}</td>
                        <td className="px-space-sm py-2">{bus.currentOccupancy}/{bus.capacity}</td>
                        <td className="px-space-sm py-2 text-on-surface-variant">
                          {bus.lastOccupancyUpdate ? new Date(bus.lastOccupancyUpdate).toLocaleTimeString() : 'Never'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-space-sm flex items-center justify-between">
                <span className="text-outline font-label-sm text-label-sm">Parser Engine: AITR-V2 (Strict Non-Destructive Ingest)</span>
                <button className="px-space-md py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-variant text-on-surface font-label-md text-label-md font-bold transition-colors">
                  Execute Isolated Ingestion
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Legacy Timetable Verification */}
      <div className="w-full px-margin-desktop py-space-lg pb-space-xl">
        <section className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md space-y-space-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-sm">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Legacy Timetable Verification & Publication</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span> Legacy Schedule - Admin Verification Required
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Archival Roster Source: <span className="font-semibold text-on-surface">July 2015 Timetable Ledger</span>. Fleet identifiers must map to current road
                registration codes before passenger application visibility is granted.
              </p>
            </div>
            <div className="flex items-center gap-space-sm">
              <div className="flex items-center gap-1 bg-surface-container px-3 py-1.5 rounded-lg text-label-sm font-label-sm text-on-surface-variant">
                <span>Filter Shift:</span>
                <select className="bg-transparent font-bold text-on-surface outline-none cursor-pointer">
                  <option>All Pending (14 Routes)</option>
                  <option>Shift 1 Only (9)</option>
                  <option>Shift 2 Only (5)</option>
                </select>
              </div>
              <button className="px-space-md py-1.5 rounded-lg bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-md text-label-md transition-all shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">done_all</span> Batch Certify
              </button>
            </div>
          </div>

          {/* Verification Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container text-on-surface font-label-sm text-label-sm uppercase tracking-wider">
                <tr>
                  <th className="px-space-md py-3">Bus Identifier</th>
                  <th className="px-space-md py-3">Official RTO Registration</th>
                  <th className="px-space-md py-3">Vehicle Capacity Model</th>
                  <th className="px-space-md py-3">Legacy Route Stops</th>
                  <th className="px-space-md py-3">Audit State</th>
                  <th className="px-space-md py-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-0 text-on-surface font-body-sm" id="legacy-table-body">
                {buses.slice(0, 3).map((bus, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-space-md py-3 font-bold font-mono text-primary flex items-center gap-2">
                      <span className="w-7 h-7 rounded bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-xs">
                        {bus.id.split('-')[1]}
                      </span>
                      {bus.id}
                    </td>
                    <td className="px-space-md py-3 font-mono font-semibold text-on-surface">MH-RTO-{bus.id.replace('G-', '00')}</td>
                    <td className="px-space-md py-3">
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                        {bus.capacity} Seats
                      </span>
                    </td>
                    <td className="px-space-md py-3 text-on-surface-variant">{bus.assignedRoute || 'Main Route'}</td>
                    <td className="px-space-md py-3">
                      <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                        ✓ Verified
                      </span>
                    </td>
                    <td className="px-space-md py-3 text-right">
                      <button className="px-3 py-1 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm hover:bg-primary-container transition-colors">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
