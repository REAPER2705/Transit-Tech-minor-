import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api/v1';

export default function ScheduleConflictDetector() {
  const [schedules, setSchedules] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getToken = () => localStorage.getItem('authToken');

  // Fetch schedules on component mount and date change
  useEffect(() => {
    fetchSchedules();
  }, [selectedDate]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/schedules`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch schedules');
      const json = await response.json();
      const filtered = json.data.filter(s => s.serviceDate?.startsWith(selectedDate));
      setSchedules(filtered);
      detectConflicts(filtered);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const detectConflicts = (scheduleList) => {
    const foundConflicts = [];

    // Check for bus conflicts (same bus in overlapping time slots)
    for (let i = 0; i < scheduleList.length; i++) {
      for (let j = i + 1; j < scheduleList.length; j++) {
        const s1 = scheduleList[i];
        const s2 = scheduleList[j];

        // Same bus check
        if (s1.busId?._id === s2.busId?._id || s1.busId === s2.busId) {
          if (timesOverlap(s1.startTimeLocal, s1.endTimeLocal, s2.startTimeLocal, s2.endTimeLocal)) {
            foundConflicts.push({
              type: 'BUS_OVERLAP',
              severity: 'HIGH',
              description: `Bus ${s1.busId?.busCode || 'N/A'} assigned to overlapping schedules`,
              schedules: [s1.scheduleCode, s2.scheduleCode],
              times: [`${s1.startTimeLocal}-${s1.endTimeLocal}`, `${s2.startTimeLocal}-${s2.endTimeLocal}`],
            });
          }
        }

        // Driver conflicts
        if (s1.driverId === s2.driverId) {
          if (timesOverlap(s1.startTimeLocal, s1.endTimeLocal, s2.startTimeLocal, s2.endTimeLocal)) {
            foundConflicts.push({
              type: 'DRIVER_OVERLAP',
              severity: 'CRITICAL',
              description: `Driver assigned to overlapping schedules`,
              schedules: [s1.scheduleCode, s2.scheduleCode],
              times: [`${s1.startTimeLocal}-${s1.endTimeLocal}`, `${s2.startTimeLocal}-${s2.endTimeLocal}`],
            });
          }
        }

        // Conductor conflicts
        if (s1.conductorId === s2.conductorId) {
          if (timesOverlap(s1.startTimeLocal, s1.endTimeLocal, s2.startTimeLocal, s2.endTimeLocal)) {
            foundConflicts.push({
              type: 'CONDUCTOR_OVERLAP',
              severity: 'CRITICAL',
              description: `Conductor assigned to overlapping schedules`,
              schedules: [s1.scheduleCode, s2.scheduleCode],
              times: [`${s1.startTimeLocal}-${s1.endTimeLocal}`, `${s2.startTimeLocal}-${s2.endTimeLocal}`],
            });
          }
        }

        // Route conflicts (different routes at same time with insufficient gap)
        if (s1.routeId?.routeCode === s2.routeId?.routeCode) {
          const minGap = 15; // 15 minute minimum gap between same route schedules
          if (timesOverlapWithGap(s1.startTimeLocal, s1.endTimeLocal, s2.startTimeLocal, s2.endTimeLocal, minGap)) {
            foundConflicts.push({
              type: 'ROUTE_INSUFFICIENT_GAP',
              severity: 'MEDIUM',
              description: `Insufficient gap between same route schedules (min ${minGap} min required)`,
              schedules: [s1.scheduleCode, s2.scheduleCode],
              times: [`${s1.startTimeLocal}-${s1.endTimeLocal}`, `${s2.startTimeLocal}-${s2.endTimeLocal}`],
            });
          }
        }
      }
    }

    // Check for missing staff
    scheduleList.forEach((schedule) => {
      if (!schedule.driverId) {
        foundConflicts.push({
          type: 'MISSING_DRIVER',
          severity: 'HIGH',
          description: `Schedule missing driver assignment`,
          schedules: [schedule.scheduleCode],
          times: [`${schedule.startTimeLocal}-${schedule.endTimeLocal}`],
        });
      }
      if (!schedule.conductorId) {
        foundConflicts.push({
          type: 'MISSING_CONDUCTOR',
          severity: 'HIGH',
          description: `Schedule missing conductor assignment`,
          schedules: [schedule.scheduleCode],
          times: [`${schedule.startTimeLocal}-${schedule.endTimeLocal}`],
        });
      }
    });

    setConflicts(foundConflicts);
  };

  const timesOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && end1 > start2;
  };

  const timesOverlapWithGap = (start1, end1, start2, end2, gapMinutes) => {
    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);

    if (s1 < s2) {
      return s2 - e1 < gapMinutes;
    } else {
      return s1 - e2 < gapMinutes;
    }
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getConflictColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-error-container text-on-error-container';
      case 'HIGH':
        return 'bg-error-fixed text-on-error-fixed';
      case 'MEDIUM':
        return 'bg-tertiary-container text-on-tertiary-container';
      default:
        return 'bg-secondary-container text-on-secondary-container';
    }
  };

  const getConflictIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'error';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'info';
      default:
        return 'check_circle';
    }
  };

  return (
    <div className="w-full p-space-lg bg-surface-container-lowest rounded-xl space-y-space-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Schedule Conflict Detector</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Real-time conflict detection for bus assignments, staff scheduling, and resource conflicts.
          </p>
        </div>
        <div className="flex items-center gap-space-sm">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface font-label-sm"
          />
          <button
            onClick={fetchSchedules}
            disabled={loading}
            className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-on-primary-fixed-variant disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
        <div className="p-space-md rounded-lg bg-surface-container">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block">Total Schedules</span>
          <span className="font-headline-md text-headline-md text-on-surface">{schedules.length}</span>
        </div>
        <div className="p-space-md rounded-lg bg-error-container">
          <span className="font-label-sm text-label-sm text-on-error-container uppercase block">Critical Conflicts</span>
          <span className="font-headline-md text-headline-md text-on-error-container">
            {conflicts.filter(c => c.severity === 'CRITICAL').length}
          </span>
        </div>
        <div className="p-space-md rounded-lg bg-tertiary-container">
          <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase block">High Priority</span>
          <span className="font-headline-md text-headline-md text-on-tertiary-container">
            {conflicts.filter(c => c.severity === 'HIGH').length}
          </span>
        </div>
        <div className="p-space-md rounded-lg bg-secondary-container">
          <span className="font-label-sm text-label-sm text-on-secondary-container uppercase block">Medium Priority</span>
          <span className="font-headline-md text-headline-md text-on-secondary-container">
            {conflicts.filter(c => c.severity === 'MEDIUM').length}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-space-md rounded-lg bg-error-container text-on-error-container flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-space-md rounded-lg bg-surface-container text-on-surface-variant text-center">
          <span className="material-symbols-outlined text-[20px] animate-spin inline-block">refresh</span> Analyzing schedules...
        </div>
      )}

      {/* Conflicts List */}
      {!loading && conflicts.length > 0 && (
        <div className="space-y-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-[24px]">warning</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">
              {conflicts.length} Conflict{conflicts.length !== 1 ? 's' : ''} Found
            </h3>
          </div>

          <div className="space-y-space-sm">
            {conflicts.map((conflict, idx) => (
              <div
                key={idx}
                className={`p-space-md rounded-lg border-l-4 ${
                  conflict.severity === 'CRITICAL'
                    ? 'border-l-error bg-error-container/20'
                    : conflict.severity === 'HIGH'
                    ? 'border-l-tertiary bg-tertiary-container/20'
                    : 'border-l-secondary bg-secondary-container/20'
                }`}
              >
                <div className="flex items-start gap-space-md">
                  <span className={`material-symbols-outlined text-[20px] mt-0.5 flex-shrink-0 ${
                    conflict.severity === 'CRITICAL' ? 'text-error' :
                    conflict.severity === 'HIGH' ? 'text-tertiary' :
                    'text-secondary'
                  }`}>
                    {getConflictIcon(conflict.severity)}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-lg text-label-lg font-bold text-on-surface">
                        {conflict.description}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-label-sm font-bold ${getConflictColor(conflict.severity)}`}>
                        {conflict.severity}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-label-sm text-on-surface-variant">
                        <strong>Schedules:</strong> {conflict.schedules.join(', ')}
                      </span>
                      {conflict.times.length > 0 && (
                        <span className="text-label-sm text-on-surface-variant">
                          <strong>Times:</strong> {conflict.times.join(' vs ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Conflicts */}
      {!loading && conflicts.length === 0 && schedules.length > 0 && (
        <div className="p-space-lg rounded-lg bg-tertiary-fixed/20 border-l-4 border-l-tertiary-fixed text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="material-symbols-outlined text-tertiary-fixed text-[24px]">check_circle</span>
            <span className="font-headline-md text-headline-md text-on-surface">All Clear!</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            No scheduling conflicts detected for {selectedDate}. All {schedules.length} schedules are valid.
          </p>
        </div>
      )}

      {/* No Schedules */}
      {!loading && schedules.length === 0 && (
        <div className="p-space-lg rounded-lg bg-surface-container text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            No schedules found for {selectedDate}. Create schedules to begin conflict detection.
          </p>
        </div>
      )}
    </div>
  );
}
