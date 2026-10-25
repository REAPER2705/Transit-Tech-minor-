import { useEffect, useState } from 'react';
import { passengerAPI } from '../utils/api';

export default function LiveTrackingMap() {
  const [assignment, setAssignment] = useState(null);
  const [timetableInfo, setTimetableInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assignRes, infoRes] = await Promise.all([
        passengerAPI.getAssignments().catch(() => ({ data: { data: [] } })),
        passengerAPI.getTimetableInfo().catch(() => ({ data: { data: {} } })),
      ]);

      if (assignRes.data.data?.length > 0) {
        setAssignment(assignRes.data.data[0]);
      }
      setTimetableInfo(infoRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass p-8 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-r-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Tracking Status */}
      <div className="glass p-6 bg-amber-50 border-l-4 border-amber-600">
        <div className="flex items-start gap-4">
          <svg className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-amber-900 mb-2">📍 Live Location Tracking Unavailable</h2>
            <p className="text-amber-800 mb-3">
              GPS-based real-time bus location tracking is not currently available. Please refer to the published timetable for bus schedules and estimated arrival times.
            </p>
            <div className="space-y-2 text-sm text-amber-800">
              <p>
                <strong>What you can do:</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Use the Timetable & Routes section to view published bus schedules</li>
                <li>Plan your journey based on scheduled stop arrival times</li>
                <li>Arrive 10 minutes early at your stop as recommended</li>
                <li>Check for service updates and incident reports</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Info */}
      {assignment && (
        <div className="glass p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Assignment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Assigned Bus</p>
              <p className="text-2xl font-bold text-gray-800">{assignment.busId?.busCode}</p>
              <p className="text-xs text-gray-500 mt-1">Capacity: {assignment.busId?.capacity} passengers</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Boarding Stop</p>
              <p className="text-lg font-semibold text-gray-800">{assignment.boardingStopId?.name}</p>
              <p className="text-xs text-gray-500 mt-1">Stop Code: {assignment.boardingStopId?.stopCode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Route</p>
              <p className="text-lg font-semibold text-gray-800">{assignment.routeId?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold text-green-600">✓ {assignment.status}</p>
            </div>
          </div>
        </div>
      )}

      {/* Timetable Info Card */}
      {timetableInfo && (
        <div className="glass p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Timetable Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Source</p>
              <p className="text-sm text-gray-800">
                {timetableInfo.sourceUrl && (
                  <a href={timetableInfo.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    View Source Document
                  </a>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Publication Date</p>
              <p className="text-sm text-gray-800">
                {timetableInfo.sourceDate ? new Date(timetableInfo.sourceDate).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Verification Status</p>
              <p className="text-sm">
                <span className="badge badge-warning">{timetableInfo.verificationStatus || 'Unverified'}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="glass p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-1">How do I find when my bus arrives?</h4>
            <p className="text-sm text-gray-600">
              Go to the "Timetable & Routes" section to search for your stop or route and view published schedules.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-1">What if my bus is late?</h4>
            <p className="text-sm text-gray-600">
              Check the "Requests & Complaints" section to report delays or service issues. Staff can help coordinate alternative arrangements.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-1">When will live tracking be available?</h4>
            <p className="text-sm text-gray-600">
              Live GPS tracking integration is planned for future updates. The transport office will announce its availability.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-1">How early should I arrive at my stop?</h4>
            <p className="text-sm text-gray-600">
              Arrive at least 10 minutes before the scheduled bus time to ensure you don't miss your bus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
