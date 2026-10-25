import { useState } from 'react';
import { mockSchedules, mockTrips } from '../../store/mockData';

export default function TripControlPage() {
  const [assignments] = useState(mockSchedules);
  const [activeTrip, setActiveTrip] = useState(mockTrips[0]);
  const [showStartModal, setShowStartModal] = useState(false);

  const handleStartTrip = (schedule) => {
    setActiveTrip({ ...mockTrips[0], scheduleId: schedule._id });
    setShowStartModal(false);
    alert('Trip started successfully!');
  };

  const handleEndTrip = () => {
    setActiveTrip(null);
    alert('Trip ended successfully!');
  };

  return (
    <div className="space-y-6">
      {activeTrip && activeTrip.status === 'active' ? (
        <div className="glass p-6 rounded-xl bg-green-50 border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-900 mb-6">Active Trip</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <p className="text-sm text-green-700 uppercase tracking-wide">Bus Unit</p>
              <p className="text-2xl font-bold text-green-900">G-47</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <p className="text-sm text-green-700 uppercase tracking-wide">Trip Status</p>
              <p className="text-2xl font-bold text-green-900">ACTIVE</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <p className="text-sm text-green-700 uppercase tracking-wide">Elapsed Time</p>
              <p className="text-2xl font-bold text-green-900">37 mins</p>
            </div>
          </div>

          <div className="p-4 bg-green-100 rounded-lg mb-6">
            <p className="text-sm text-green-800">GPS enabled • Conductor active • 38/50 passengers</p>
          </div>

          <button
            onClick={handleEndTrip}
            className="btn-danger w-full"
          >
            End Trip
          </button>
        </div>
      ) : (
        <div className="glass p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Scheduled Trips</h2>
          <p className="text-gray-600 mb-4">Select a trip to start</p>

          <div className="space-y-3">
            {assignments.map(assign => (
              <button
                key={assign._id}
                onClick={() => { setShowStartModal(true); }}
                className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-smooth text-left"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-800">{assign.busId?.busCode}</p>
                    <p className="text-sm text-gray-600">
                      {assign.startTimeLocal} - {assign.endTimeLocal} • {new Date(assign.serviceDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{assign.routeId?.name}</p>
                  </div>
                  <span className="badge badge-info">{assign.status.toUpperCase()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Start Trip Modal */}
      {showStartModal && (
        <div className="modal-overlay" onClick={() => setShowStartModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Start Trip</h3>
              <div className="p-4 bg-blue-50 rounded-lg mb-6">
                <p className="text-sm text-blue-900"><strong>Bus:</strong> G-47</p>
                <p className="text-sm text-blue-900"><strong>Route:</strong> Palasia Square → AITR Campus</p>
                <p className="text-sm text-blue-900"><strong>Time:</strong> 08:20 - 14:40</p>
              </div>
              <p className="text-gray-600 mb-6">Enable GPS tracking?</p>
              <div className="flex space-x-3">
                <button onClick={() => setShowStartModal(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={() => handleStartTrip(assignments[0])}
                  className="flex-1 btn-primary"
                >
                  Start Trip with GPS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
