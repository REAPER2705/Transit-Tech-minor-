import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';

export default function StaffPortalComplete() {
  const {
    buses,
    routes,
    stops,
    trips,
    incidents,
    updateBusOccupancy,
    startTrip,
    completeTrip,
    updateTripProgress,
    addIncident,
    addNotification,
    getActiveTrips,
    getIncidentsForRoute,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('control');
  const [selectedBus, setSelectedBus] = useState(buses[0]?.id || 'G-47');
  const [occupancyInput, setOccupancyInput] = useState(0);
  const [gpsSharing, setGpsSharing] = useState(true);
  const [tripActive, setTripActive] = useState(false);
  const [currentTripId, setCurrentTripId] = useState(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [incidentForm, setIncidentForm] = useState({ category: '', description: '', location: '' });
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  const selectedBusData = buses.find((b) => b.id === selectedBus);
  const assignedRoute = routes.find((r) => r.id === selectedBusData?.assignedRoute);
  const routeStops = assignedRoute ? stops.filter((s) => s.routes?.includes(assignedRoute.id)) : [];
  const routeIncidents = assignedRoute ? getIncidentsForRoute(assignedRoute.id) : [];
  const activeTrips = getActiveTrips();

  const handleStartTrip = () => {
    if (!selectedBusData || !assignedRoute) {
      alert('Bus or route not configured properly');
      return;
    }

    const trip = {
      busId: selectedBusData.id,
      routeId: assignedRoute.id,
      shiftId: selectedBusData.assignedShift || 'SHIFT-1',
      startedBy: 'STAFF',
    };

    startTrip(trip);
    setTripActive(true);
    setCurrentStopIndex(0);
    addNotification({
      type: 'TRIP_STARTED',
      title: 'Trip Started',
      message: `Bus ${selectedBusData.id} trip started on route ${assignedRoute.name}`,
    });
  };

  const handleCompleteTrip = () => {
    if (currentTripId) {
      completeTrip(currentTripId);
      setTripActive(false);
      setCurrentTripId(null);
      setCurrentStopIndex(0);
      addNotification({
        type: 'TRIP_COMPLETED',
        title: 'Trip Completed',
        message: `Bus ${selectedBusData.id} trip completed`,
      });
    }
  };

  const handleAdvanceStop = () => {
    if (currentTripId && currentStopIndex < routeStops.length - 1) {
      const nextIndex = currentStopIndex + 1;
      updateTripProgress(currentTripId, nextIndex);
      setCurrentStopIndex(nextIndex);
      addNotification({
        type: 'STOP_REACHED',
        title: 'Stop Reached',
        message: `Arrived at ${routeStops[nextIndex]?.name}`,
      });
    }
  };

  const handleUpdateOccupancy = () => {
    if (selectedBusData && occupancyInput >= 0 && occupancyInput <= selectedBusData.capacity) {
      updateBusOccupancy(selectedBusData.id, occupancyInput);
      addNotification({
        type: 'OCCUPANCY_UPDATED',
        title: 'Occupancy Updated',
        message: `Bus ${selectedBusData.id} occupancy: ${occupancyInput}/${selectedBusData.capacity}`,
      });
    }
  };

  const handleSubmitIncident = () => {
    if (incidentForm.category && incidentForm.description) {
      addIncident({
        category: incidentForm.category,
        description: incidentForm.description,
        location: incidentForm.location || 'En Route',
        routeId: assignedRoute?.id,
        busId: selectedBusData?.id,
        reportedBy: 'STAFF',
      });
      setIncidentForm({ category: '', description: '', location: '' });
      setShowIncidentForm(false);
      addNotification({
        type: 'INCIDENT_REPORTED',
        title: 'Incident Reported',
        message: `${incidentForm.category} incident logged for route ${assignedRoute?.name}`,
      });
    }
  };

  return (
    <div className="w-full pt-16 bg-surface min-h-screen">
      {/* Top Operational Sub-Bar */}
      <section className="w-full px-margin-desktop py-space-md bg-surface-container-low sticky top-16 z-30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center gap-space-xs px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface">
              <span className="material-symbols-outlined text-[20px] text-primary">directions_bus</span>
              <span className="font-headline-md text-headline-md tracking-tight">UNIT {selectedBus}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span>Route: {assignedRoute?.name || 'Unassigned'}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm ${
              tripActive 
                ? 'bg-tertiary-fixed text-on-tertiary-fixed' 
                : 'bg-surface-container-high text-on-surface-variant'
            }`}>
              <span className={`w-2 h-2 rounded-full ${tripActive ? 'bg-tertiary animate-pulse' : 'bg-outline'}`}></span>
              <span>{tripActive ? 'TRIP ACTIVE' : 'TRIP IDLE'}</span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm">
              <span className={`w-2.5 h-2.5 rounded-full ${gpsSharing ? 'bg-tertiary animate-pulse' : 'bg-outline'}`}></span>
              <span className="font-semibold">{gpsSharing ? 'GPS SHARING' : 'GPS INACTIVE'}</span>
              <button
                onClick={() => setGpsSharing(!gpsSharing)}
                className="ml-2 px-2 py-0.5 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-label-sm transition-colors"
              >
                {gpsSharing ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Navigation Tabs */}
      <div className="px-margin-desktop py-space-md bg-surface-container-low sticky top-[120px] z-20 shadow-sm">
        <div className="flex flex-wrap items-center gap-space-xs">
          <button
            onClick={() => setActiveTab('control')}
            className={`px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-space-xs transition-all ${
              activeTab === 'control'
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span>Trip Control</span>
          </button>
          <button
            onClick={() => setActiveTab('occupancy')}
            className={`px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-space-xs transition-all ${
              activeTab === 'occupancy'
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">groups</span>
            <span>Occupancy</span>
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
            <span>Incidents</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-margin-desktop py-space-lg">
        {/* TRIP CONTROL TAB */}
        {activeTab === 'control' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
            {/* Left: Trip Control */}
            <div className="lg:col-span-8 flex flex-col gap-space-lg">
              {/* Bus Selection */}
              <div className="glass rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                <h3 className="text-headline-md font-bold text-on-surface mb-space-md">Select Bus Unit</h3>
                <select
                  value={selectedBus}
                  onChange={(e) => {
                    setSelectedBus(e.target.value);
                    setOccupancyInput(0);
                  }}
                  className="w-full px-space-md py-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-label-lg"
                >
                  {buses.map((bus) => (
                    <option key={bus.id} value={bus.id}>
                      {bus.id} - {bus.status} ({bus.currentOccupancy}/{bus.capacity} passengers)
                    </option>
                  ))}
                </select>
              </div>

              {/* Trip Control Buttons */}
              <div className="glass rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                <h3 className="text-headline-md font-bold text-on-surface mb-space-md">Trip Control</h3>
                <div className="space-y-space-md">
                  {!tripActive ? (
                    <button
                      onClick={handleStartTrip}
                      className="w-full py-4 px-space-md rounded-lg bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-sm shadow-md transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                      Start Trip
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleAdvanceStop}
                        className="w-full py-4 px-space-md rounded-lg bg-tertiary hover:bg-tertiary-container text-on-tertiary font-label-lg text-label-lg flex items-center justify-center gap-space-sm shadow-md transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[20px]">navigate_next</span>
                        Advance to Next Stop
                      </button>
                      <button
                        onClick={handleCompleteTrip}
                        className="w-full py-4 px-space-md rounded-lg bg-error hover:bg-error-container text-on-error font-label-lg text-label-lg flex items-center justify-center gap-space-sm shadow-md transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[20px]">stop_circle</span>
                        Complete Trip
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Route Stops Timeline */}
              <div className="glass rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                <h3 className="text-headline-md font-bold text-on-surface mb-space-md">Route Stops</h3>
                <div className="space-y-2">
                  {routeStops.map((stop, idx) => (
                    <div
                      key={stop.id}
                      className={`p-space-md rounded-lg flex items-center justify-between ${
                        idx === currentStopIndex && tripActive
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : idx < currentStopIndex && tripActive
                          ? 'bg-tertiary-container text-on-tertiary'
                          : 'bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-space-sm">
                        <span className="material-symbols-outlined text-[20px]">pin_drop</span>
                        <div>
                          <p className="font-label-lg font-bold">{stop.name}</p>
                          <p className="text-label-sm opacity-75">{stop.stopCode}</p>
                        </div>
                      </div>
                      {idx === currentStopIndex && tripActive && (
                        <span className="px-3 py-1 rounded-full bg-on-primary-fixed text-primary-fixed font-label-sm font-bold animate-pulse">
                          CURRENT
                        </span>
                      )}
                      {idx < currentStopIndex && tripActive && (
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Status Summary */}
            <div className="lg:col-span-4 flex flex-col gap-space-lg">
              <div className="glass rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                <h3 className="text-headline-md font-bold text-on-surface mb-space-md">Trip Status</h3>
                <div className="space-y-space-md">
                  <div className="p-space-md rounded-lg bg-surface-container-low">
                    <p className="text-label-sm text-on-surface-variant uppercase">Current Stop</p>
                    <p className="text-headline-lg font-bold text-on-surface mt-1">
                      {currentStopIndex < routeStops.length ? routeStops[currentStopIndex]?.name : 'Trip Not Active'}
                    </p>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-low">
                    <p className="text-label-sm text-on-surface-variant uppercase">Bus Occupancy</p>
                    <p className="text-headline-lg font-bold text-on-surface mt-1">
                      {selectedBusData?.currentOccupancy || 0} / {selectedBusData?.capacity || 50}
                    </p>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-low">
                    <p className="text-label-sm text-on-surface-variant uppercase">Trip Progress</p>
                    <div className="mt-2 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: routeStops.length > 0 ? `${(currentStopIndex / routeStops.length) * 100}%` : '0%',
                        }}
                      />
                    </div>
                    <p className="text-label-sm text-on-surface-variant mt-1">
                      {currentStopIndex} / {routeStops.length} stops
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OCCUPANCY TAB */}
        {activeTab === 'occupancy' && (
          <div className="glass rounded-xl bg-surface-container-lowest p-space-lg shadow-sm max-w-2xl">
            <h2 className="text-headline-lg font-bold text-on-surface mb-space-lg">Update Bus Occupancy</h2>
            <div className="space-y-space-lg">
              <div>
                <p className="text-label-lg text-on-surface-variant uppercase mb-2">Bus: {selectedBus}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-display-lg font-bold text-primary">{occupancyInput}</span>
                  <span className="text-headline-lg text-on-surface-variant">/ {selectedBusData?.capacity}</span>
                </div>
              </div>

              <div className="flex items-center gap-space-md">
                <input
                  type="number"
                  min="0"
                  max={selectedBusData?.capacity || 50}
                  value={occupancyInput}
                  onChange={(e) => setOccupancyInput(Math.max(0, Math.min(selectedBusData?.capacity || 50, parseInt(e.target.value) || 0)))}
                  className="flex-1 px-space-md py-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-label-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-space-sm">
                <button
                  onClick={() => setOccupancyInput(Math.max(0, occupancyInput - 5))}
                  className="py-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-md transition-colors"
                >
                  -5
                </button>
                <button
                  onClick={() => setOccupancyInput(Math.max(0, occupancyInput - 1))}
                  className="py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-md transition-colors"
                >
                  -1
                </button>
                <button
                  onClick={() => setOccupancyInput(Math.min(selectedBusData?.capacity || 50, occupancyInput + 1))}
                  className="py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-md transition-colors"
                >
                  +1
                </button>
              </div>

              <button
                onClick={handleUpdateOccupancy}
                className="w-full py-4 px-space-md rounded-lg bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-lg text-label-lg shadow-md transition-all active:scale-95"
              >
                Confirm & Broadcast Occupancy
              </button>
            </div>
          </div>
        )}

        {/* INCIDENTS TAB */}
        {activeTab === 'incidents' && (
          <div className="space-y-space-lg">
            {/* Report Form */}
            <div className="glass rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
              <div className="flex items-center justify-between mb-space-md">
                <h2 className="text-headline-lg font-bold text-on-surface">Report Incident</h2>
                <button
                  onClick={() => setShowIncidentForm(!showIncidentForm)}
                  className="px-space-md py-2 rounded-lg bg-error text-on-error font-label-lg hover:bg-error-container transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  New Incident
                </button>
              </div>

              {showIncidentForm && (
                <div className="p-space-md rounded-lg bg-surface-container-low border-2 border-error-fixed mb-space-md space-y-space-sm">
                  <select
                    value={incidentForm.category}
                    onChange={(e) => setIncidentForm({ ...incidentForm, category: e.target.value })}
                    className="w-full px-space-md py-2 rounded-lg bg-surface-container-lowest border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-error"
                  >
                    <option value="">Select Incident Type</option>
                    <option value="TRAFFIC_CONGESTION">Traffic Congestion</option>
                    <option value="MECHANICAL_ISSUE">Mechanical Issue</option>
                    <option value="PASSENGER_INCIDENT">Passenger Incident</option>
                    <option value="WEATHER">Adverse Weather</option>
                    <option value="DELAY">Route Delay</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Incident location..."
                    value={incidentForm.location}
                    onChange={(e) => setIncidentForm({ ...incidentForm, location: e.target.value })}
                    className="w-full px-space-md py-2 rounded-lg bg-surface-container-lowest border border-surface-container text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-error"
                  />
                  <textarea
                    placeholder="Describe the incident..."
                    value={incidentForm.description}
                    onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                    className="w-full px-space-md py-2 rounded-lg bg-surface-container-lowest border border-surface-container text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-error"
                    rows="4"
                  />
                  <div className="flex gap-space-sm">
                    <button
                      onClick={handleSubmitIncident}
                      className="px-space-md py-2 rounded-lg bg-error text-on-error font-label-lg hover:bg-error-container transition-colors"
                    >
                      Submit Incident
                    </button>
                    <button
                      onClick={() => setShowIncidentForm(false)}
                      className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-lg hover:bg-surface-container-high transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Active Incidents */}
            <div className="glass rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
              <h3 className="text-headline-md font-bold text-on-surface mb-space-md">Route Incidents</h3>
              {routeIncidents.length > 0 ? (
                <div className="space-y-space-sm">
                  {routeIncidents.map((incident) => (
                    <div key={incident.id} className="p-space-md rounded-lg bg-surface-container-low border-l-4 border-error">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-label-lg font-bold text-on-surface">{incident.category}</p>
                          <p className="text-body-sm text-on-surface-variant mt-1">{incident.description}</p>
                          <p className="text-label-sm text-outline mt-2">{incident.location}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-label-sm font-bold whitespace-nowrap ${
                          incident.status === 'OPEN' ? 'bg-error-fixed text-on-error-fixed' :
                          'bg-tertiary-fixed text-on-tertiary-fixed'
                        }`}>
                          {incident.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-space-lg text-on-surface-variant">No incidents reported for this route</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
