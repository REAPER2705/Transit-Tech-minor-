import { useState, useEffect } from 'react';
import { staffAPI } from '../utils/api';
import realtimeStore from '../store/realtimeStore';

export default function TripControl() {
  const [assignments, setAssignments] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { joinTrip, leaveTrip } = realtimeStore();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const res = await staffAPI.getAssignments();
      setAssignments(res.data.data);
    } catch (err) {
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrip = async (tripId) => {
    try {
      const res = await staffAPI.startTrip(tripId);
      setActiveTrip(res.data.data);
      joinTrip(tripId);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to start trip');
    }
  };

  const handleEndTrip = async (tripId) => {
    try {
      const res = await staffAPI.endTrip(tripId);
      setActiveTrip(null);
      leaveTrip(tripId);
      loadAssignments();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to end trip');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {activeTrip ? (
        <div className="glass p-6 bg-green-50 border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-900 mb-6">Active Trip</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-green-700">Bus</p>
              <p className="font-semibold text-green-900">{activeTrip.busId?.busCode}</p>
            </div>
            <div>
              <p className="text-sm text-green-700">Status</p>
              <p className="font-semibold text-green-900">{activeTrip.status?.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-green-700">Started At</p>
              <p className="font-semibold text-green-900">
                {new Date(activeTrip.startedAt).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => handleEndTrip(activeTrip._id)}
              className="btn-danger w-full mt-4"
            >
              End Trip
            </button>
          </div>
        </div>
      ) : (
        <div className="glass p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Assignments</h2>

          {assignments.length === 0 ? (
            <p className="text-gray-600">No assignments found</p>
          ) : (
            <div className="space-y-4">
              {assignments.map(assign => (
                <div key={assign._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {assign.busId?.busCode}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(assign.serviceDate).toLocaleDateString()} |{' '}
                        {assign.startTimeLocal} - {assign.endTimeLocal}
                      </p>
                    </div>
                    <span className={`badge ${
                      assign.status === 'scheduled'
                        ? 'badge-info'
                        : assign.status === 'in_progress'
                        ? 'badge-warning'
                        : 'badge-success'
                    }`}>
                      {assign.status?.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    Route: {assign.routeId?.name}
                  </p>

                  {assign.status === 'scheduled' && (
                    <button
                      onClick={() => handleStartTrip(assign._id)}
                      className="btn-primary w-full"
                    >
                      Start Trip
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
