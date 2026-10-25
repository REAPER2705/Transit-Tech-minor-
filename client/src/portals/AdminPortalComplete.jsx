import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/appStore';

export default function AdminPortalComplete() {
  const {
    buses,
    routes,
    stops,
    timetables,
    complaints,
    incidents,
    trips,
    updateComplaintStatus,
    updateIncidentStatus,
    updateTimetableEntry,
    getStats,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [filterComplaintStatus, setFilterComplaintStatus] = useState('all');
  const [filterIncidentStatus, setFilterIncidentStatus] = useState('all');

  // Calculate KPIs
  const stats = getStats();
  const fleetUtilization = stats.totalBuses > 0 ? ((stats.activeBuses / stats.totalBuses) * 100).toFixed(1) : 0;
  const totalCapacity = buses.reduce((sum, b) => sum + b.capacity, 0);
  const totalOccupancy = buses.reduce((sum, b) => sum + (b.currentOccupancy || 0), 0);
  const occupancyRate = totalCapacity > 0 ? ((totalOccupancy / totalCapacity) * 100).toFixed(1) : 0;

  const kpis = [
    {
      title: 'Active Fleet Network',
      value: stats.activeBuses,
      total: stats.totalBuses,
      metric: `${fleetUtilization}% Operational`,
      icon: 'directions_bus',
      bgColor: 'bg-primary-fixed',
      textColor: 'text-on-primary-fixed',
    },
    {
      title: 'Total Routes',
      value: stats.totalRoutes,
      metric: `${stats.totalStops} Campus Stops`,
      icon: 'route',
      bgColor: 'bg-tertiary-fixed',
      textColor: 'text-on-tertiary-fixed',
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
      title: 'Occupancy Rate',
      value: `${occupancyRate}%`,
      metric: `${totalOccupancy}/${totalCapacity} seats`,
      icon: 'airline_seat_recline_normal',
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

  // Filter complaints and incidents
  const filteredComplaints = useMemo(() => {
    if (filterComplaintStatus === 'all') return complaints;
    return complaints.filter((c) => c.status === filterComplaintStatus);
  }, [complaints, filterComplaintStatus]);

  const filteredIncidents = useMemo(() => {
    if (filterIncidentStatus === 'all') return incidents;
    return incidents.filter((i) => i.status === filterIncidentStatus);
  }, [incidents, filterIncidentStatus]);

  return (
    <div className="w-full pt-16 bg-surface min-h-screen">
      {/* Top Command Ribbon */}
      <section className="w-full px-margin-desktop py-space-md bg-surface-container-low sticky top-16 z-30">
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
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <button className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Report
            </button>
          </div>
        </div>
      </section>

      {/* Sub-Navigation Tabs */}
      <div className="px-margin-desktop py-space-md bg-surface-container-low sticky top-[120px] z-20 shadow-sm">
        <div className="flex flex-wrap items-center gap-space-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-space-xs transition-all ${
              activeTab === 'overview'
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span>Overview & KPIs</span>
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-space-xs transition-all ${
              activeTab === 'fleet'
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">directions_bus</span>
            <span>Fleet Management</span>
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-space-xs transition-all ${
              activeTab === 'complaints'
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">feedback</span>
            <span>Complaints ({complaints.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-space-xs transition-all ${
              activeTab === 'incidents'
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span>Incidents ({incidents.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-margin-desktop py-space-lg">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-space-lg">
            {/* KPI Telemetry Bento Matrix */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-space-md">
              {kpis.map((kpi, idx) => (
                <div
                  key={idx}
                  className={`p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between relative overflow-hidden ${
                    kpi.hasBorder ? 'border-l-4 border-l-error' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md uppercase tracking-wider text-outline">{kpi.title}</span>
                    {kpi.icon && (
                      <span
                        className={`w-8 h-8 rounded-lg ${kpi.bgColor} ${kpi.textColor} flex items-center justify-center`}
                      >
                        <span className="material-symbols-outlined text-[18px]">{kpi.icon}</span>
                      </span>
                    )}
                  </div>

                  <div className="my-space-md">
                    <div className="flex items-baseline gap-2">
                      <span className="font-headline-xl text-headline-xl text-on-surface">{kpi.value}</span>
                      {kpi.total && <span className="font-headline-md text-headline-md text-outline">/ {kpi.total}</span>}
                    </div>
                    <p className="font-body-sm text-body-sm text-tertiary mt-1">{kpi.metric}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Fleet Distribution & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
              {/* Active vs Inactive */}
              <div className="glass rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                <h3 className="text-headline-md font-bold text-on-surface mb-space-md">Fleet Status Distribution</h3>
                <div className="space-y-space-md">
                  {['ACTIVE', 'MAINTENANCE', 'INACTIVE'].map((status) => {
                    const count = buses.filter((b) => b.status === status).length;
                    const percentage = stats.totalBuses > 0 ? (count / stats.totalBuses) * 100 : 0;
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-label-md text-label-md text-on-surface">{status}</span>
                          <span className="font-bold text-on-surface">{count} units</span>
                        </div>
                        <div className="h-3 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              status === 'ACTIVE'
                                ? 'bg-tertiary'
                                : status === 'MAINTENANCE'
                                ? 'bg-tertiary-fixed'
                                : 'bg-surface-container'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Operations Summary */}
              <div className="glass rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                <h3 className="text-headline-md font-bold text-on-surface mb-space-md">Current Operations</h3>
                <div className="space-y-space-md">
                  <div className="p-space-md rounded-lg bg-surface-container-low">
                    <p className="text-label-sm text-on-surface-variant uppercase">Active Routes</p>
                    <p className="text-headline-lg font-bold text-on-surface mt-1">{stats.totalRoutes}</p>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-low">
                    <p className="text-label-sm text-on-surface-variant uppercase">Scheduled Stops</p>
                    <p className="text-headline-lg font-bold text-on-surface mt-1">{stats.totalStops}</p>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-low">
                    <p className="text-label-sm text-on-surface-variant uppercase">Average Occupancy</p>
                    <p className="text-headline-lg font-bold text-tertiary mt-1">{occupancyRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FLEET MANAGEMENT TAB */}
        {activeTab === 'fleet' && (
          <div className="glass rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
            <h2 className="text-headline-lg font-bold text-on-surface mb-space-md">Fleet Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead>
                  <tr className="border-b border-surface-container">
                    <th className="text-left p-3 font-bold text-on-surface">Bus ID</th>
                    <th className="text-left p-3 font-bold text-on-surface">Status</th>
                    <th className="text-left p-3 font-bold text-on-surface">Route</th>
                    <th className="text-left p-3 font-bold text-on-surface">Occupancy</th>
                    <th className="text-left p-3 font-bold text-on-surface">Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus) => (
                    <tr key={bus.id} className="border-b border-surface-container-low hover:bg-surface-container-low transition-colors">
                      <td className="p-3 font-bold text-primary">{bus.id}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-label-sm font-bold ${
                          bus.status === 'ACTIVE'
                            ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                            : 'bg-surface-container-high text-on-surface'
                        }`}>
                          {bus.status}
                        </span>
                      </td>
                      <td className="p-3 text-on-surface-variant">{bus.assignedRoute || 'Unassigned'}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{bus.currentOccupancy}/{bus.capacity}</span>
                          <div className="w-16 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${(bus.currentOccupancy / bus.capacity) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-on-surface-variant">
                        {bus.lastOccupancyUpdate
                          ? new Date(bus.lastOccupancyUpdate).toLocaleTimeString()
                          : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMPLAINTS TAB */}
        {activeTab === 'complaints' && (
          <div className="space-y-space-lg">
            <div className="flex items-center gap-space-sm mb-space-md">
              <select
                value={filterComplaintStatus}
                onChange={(e) => setFilterComplaintStatus(e.target.value)}
                className="px-space-md py-2 rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Complaints</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="RESOLVED">Resolved</option>
              </select>
              <span className="text-label-sm text-on-surface-variant">{filteredComplaints.length} complaints</span>
            </div>

            <div className="space-y-space-md">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <div key={complaint.id} className="glass rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
                    <div className="flex items-start justify-between mb-space-sm">
                      <div className="flex-1">
                        <p className="font-label-lg font-bold text-on-surface">{complaint.category}</p>
                        <p className="text-body-sm text-on-surface-variant mt-1">{complaint.description}</p>
                        <p className="text-label-sm text-outline mt-2">
                          Submitted: {new Date(complaint.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <select
                        value={complaint.status}
                        onChange={(e) => updateComplaintStatus(complaint.id, e.target.value)}
                        className="px-2 py-1 rounded text-label-sm font-bold bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="SUBMITTED">Submitted</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-space-lg text-on-surface-variant">
                  <p className="text-body-sm">No complaints found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* INCIDENTS TAB */}
        {activeTab === 'incidents' && (
          <div className="space-y-space-lg">
            <div className="flex items-center gap-space-sm mb-space-md">
              <select
                value={filterIncidentStatus}
                onChange={(e) => setFilterIncidentStatus(e.target.value)}
                className="px-space-md py-2 rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Incidents</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
              <span className="text-label-sm text-on-surface-variant">{filteredIncidents.length} incidents</span>
            </div>

            <div className="space-y-space-md">
              {filteredIncidents.length > 0 ? (
                filteredIncidents.map((incident) => (
                  <div key={incident.id} className="glass rounded-xl bg-surface-container-lowest p-space-md shadow-sm border-l-4 border-error">
                    <div className="flex items-start justify-between mb-space-sm">
                      <div className="flex-1">
                        <p className="font-label-lg font-bold text-on-surface">{incident.category}</p>
                        <p className="text-body-sm text-on-surface-variant mt-1">{incident.description}</p>
                        <p className="text-label-sm text-outline mt-2">
                          Location: {incident.location} | {new Date(incident.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <select
                        value={incident.status}
                        onChange={(e) => updateIncidentStatus(incident.id, e.target.value)}
                        className={`px-2 py-1 rounded text-label-sm font-bold border focus:outline-none focus:ring-2 ${
                          incident.status === 'OPEN'
                            ? 'bg-error-fixed text-on-error-fixed border-error'
                            : 'bg-surface-container-low border-surface-container text-on-surface'
                        }`}
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-space-lg text-on-surface-variant">
                  <p className="text-body-sm">No incidents found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
