import { useState } from 'react';
import { mockOccupancy } from '../../store/mockData';

export default function OccupancyPage() {
  const [occupancy, setOccupancy] = useState(mockOccupancy);
  const [passengerCount, setPassengerCount] = useState(occupancy.passengerCount);
  const [reason, setReason] = useState('');

  const handleUpdateOccupancy = () => {
    if (passengerCount < 0 || passengerCount > occupancy.capacity) {
      alert(`Passenger count must be between 0 and ${occupancy.capacity}`);
      return;
    }

    const newOccupancy = {
      ...occupancy,
      passengerCount: parseInt(passengerCount),
      availableSeats: occupancy.capacity - parseInt(passengerCount),
      percentFilled: Math.round((parseInt(passengerCount) / occupancy.capacity) * 100),
      lastUpdated: new Date().toISOString(),
    };

    setOccupancy(newOccupancy);
    alert('Occupancy updated successfully!');
    setReason('');
  };

  const isFull = occupancy.availableSeats === 0;

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Occupancy Management</h2>

        {/* Current Status */}
        <div className={`p-6 rounded-lg border-l-4 mb-6 ${
          isFull
            ? 'bg-red-50 border-red-500'
            : occupancy.percentFilled > 80
            ? 'bg-yellow-50 border-yellow-500'
            : 'bg-green-50 border-green-500'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className={`text-sm uppercase tracking-wide font-semibold ${
                isFull ? 'text-red-700' : occupancy.percentFilled > 80 ? 'text-yellow-700' : 'text-green-700'
              }`}>
                Current Occupancy
              </p>
              <p className={`text-4xl font-bold mt-2 ${
                isFull ? 'text-red-900' : occupancy.percentFilled > 80 ? 'text-yellow-900' : 'text-green-900'
              }`}>
                {occupancy.passengerCount} / {occupancy.capacity}
              </p>
            </div>
            {isFull && (
              <span className="badge badge-danger">🚫 BUS FULL</span>
            )}
          </div>

          <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden mb-2">
            <div
              className={`h-full transition-all ${
                isFull
                  ? 'bg-red-600'
                  : occupancy.percentFilled > 80
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${occupancy.percentFilled}%` }}
            />
          </div>
          <p className="text-sm font-semibold">
            {occupancy.percentFilled}% Filled • {occupancy.availableSeats} Seats Available
          </p>
        </div>

        {/* Manual Entry */}
        <div className="p-4 bg-gray-50 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Update Passenger Count</h3>

          <div className="space-y-4">
            <div>
              <label className="label">Passenger Count</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  className="input-field flex-1"
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(e.target.value)}
                  min="0"
                  max={occupancy.capacity}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPassengerCount(Math.max(0, passengerCount - 1))}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-bold"
                  >
                    −
                  </button>
                  <button
                    onClick={() => setPassengerCount(Math.min(occupancy.capacity, parseInt(passengerCount) + 1))}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-bold"
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
              onClick={handleUpdateOccupancy}
              className="btn-primary w-full"
            >
              Update Occupancy
            </button>
          </div>
        </div>

        {/* Status Message */}
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Last Updated:</strong> {new Date(occupancy.lastUpdated).toLocaleTimeString()}
          </p>
          <p className="text-sm text-blue-800 mt-1">
            Changes are broadcast to passengers and admins in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
