import { useState, useEffect } from 'react';
import { staffAPI } from '../utils/api';

export default function OccupancyManagement() {
  const [assignments, setAssignments] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [occupancy, setOccupancy] = useState(null);
  const [passengerCount, setPassengerCount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await staffAPI.getAssignments();
      setAssignments(res.data.data);
    } catch (err) {
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTrip = async (trip) => {
    setSelectedTrip(trip);
    try {
      const res = await staffAPI.getOccupancy(trip._id);
      setOccupancy(res.data.data);
      setPassengerCount(res.data.data?.passengerCount || '');
    } catch (err) {
      console.error('Error fetching occupancy:', err);
    }
  };

  const handleUpdateOccupancy = async (e) => {
    e.preventDefault();
    if (!selectedTrip || passengerCount === '') {
      setError('Please enter passenger count');
      return;
    }

    setSubmitting(true);
    try {
      const res = await staffAPI.updateOccupancy(
        selectedTrip._id,
        parseInt(passengerCount),
        reason
      );
      setOccupancy(res.data.data);
      setReason('');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update occupancy');
    } finally {
      setSubmitting(false);
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

      <div className="glass p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Occupancy Management</h2>

        {!selectedTrip ? (
          <div>
            <p className="text-gray-600 mb-4">Select a trip to manage occupancy</p>
            <div className="space-y-3">
              {assignments.map(assign => (
                <button
                  key={assign._id}
                  onClick={() => handleSelectTrip(assign)}
                  className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-500 transition-smooth text-left"
                >
                  <p className="font-semibold text-gray-800">{assign.busId?.busCode}</p>
                  <p className="text-sm text-gray-600">
                    {assign.startTimeLocal} - {assign.endTimeLocal}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedTrip(null)}
              className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedTrip.busId?.busCode}
            </h3>

            {occupancy && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                <p className="text-sm text-blue-700">Current Count</p>
                <p className="text-2xl font-bold text-blue-900">
                  {occupancy.passengerCount} / {occupancy.capacitySnapshot}
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  {occupancy.availableSeats} seats available
                </p>
              </div>
            )}

            <form onSubmit={handleUpdateOccupancy} className="space-y-4">
              <div>
                <label className="label">Passenger Count</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    className="input-field flex-1"
                    value={passengerCount}
                    onChange={(e) => setPassengerCount(e.target.value)}
                    min="0"
                    max={selectedTrip.busId?.capacity}
                    required
                  />
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        setPassengerCount(Math.max(0, parseInt(passengerCount || 0) - 1))
                      }
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPassengerCount(
                          Math.min(selectedTrip.busId?.capacity, parseInt(passengerCount || 0) + 1)
                        )
                      }
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Correction Reason (optional)</label>
                <textarea
                  className="input-field"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="2"
                  placeholder="If updating from previous count, explain why..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full"
              >
                {submitting ? 'Updating...' : 'Update Occupancy'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
