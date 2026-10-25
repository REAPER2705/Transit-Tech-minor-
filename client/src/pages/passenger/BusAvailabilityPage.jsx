import { useState } from 'react';
import { mockAssignments, mockBuses, mockAlternativeBuses } from '../../store/mockData';

export default function BusAvailabilityPage() {
  const [assignment] = useState(mockAssignments[0]);
  const [showTransferModal, setShowTransferModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Assigned Fleet Unit */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Assigned Fleet Unit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Bus Unit G-47
              <span className="badge badge-success ml-3">Live Conductor Verified</span>
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide">Confirmed Occupancy</p>
                <p className="text-4xl font-bold text-gray-800">38 / 50 Seats</p>
              </div>
              <div>
                <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full" style={{ width: '76%' }} />
                </div>
                <p className="text-sm text-gray-600 mt-2">76% Seating Filled • 12 Seats Remaining</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Stated Capacity</p>
              <p className="font-bold text-gray-800">50 Seats + 2 Officers</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Verification Stamp</p>
              <p className="font-bold text-gray-800">08:14 AM (Synced)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Operational Crew Units</p>
              <div className="flex space-x-2 mt-2">
                <span className="badge badge-info text-xs">Driver Unit G-47</span>
                <span className="badge badge-info text-xs">Conductor Unit G-47</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Buses */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Alternative Fleet Units</h2>
        <p className="text-sm text-gray-600 mb-4">Parallel buses along Palasia - Bypass axis</p>

        <div className="space-y-4">
          {mockAlternativeBuses.map((bus, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 transition-smooth">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">Bus Unit {bus.busCode}</h3>
                  <p className="text-sm text-gray-600">Trailing interval • ETA {bus.eta}</p>
                </div>
                <span className="badge badge-success">{bus.availableSeats} Free</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                <div>
                  <p className="text-gray-600">Occupancy</p>
                  <p className="font-bold text-gray-800">{bus.occupancy}/{bus.capacity} filled</p>
                </div>
                <div>
                  <p className="text-gray-600">ETA</p>
                  <p className="font-bold text-gray-800">{bus.eta}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Update</p>
                  <p className="font-bold text-gray-800">{bus.lastUpdate}</p>
                </div>
              </div>

              <button
                onClick={() => setShowTransferModal(true)}
                className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-smooth"
              >
                Request Transfer
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Terminal */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Passenger Action Terminal</h2>
        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth text-left flex items-center space-x-3 font-medium text-gray-800">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-9-2m9 2l9-2" />
            </svg>
            <span>Request Stop Change</span>
          </button>
          <button className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth text-left flex items-center space-x-3 font-medium text-gray-800">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Report Transit Delay</span>
          </button>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Request Transfer</h3>
              <p className="text-gray-600 mb-4">Transfer to Bus G-39?</p>
              <p className="text-sm text-gray-500 mb-6">
                This action will be sent for approval by the Conductor. You may proceed to the next stop for boarding.
              </p>
              <div className="flex space-x-3">
                <button onClick={() => setShowTransferModal(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button onClick={() => { setShowTransferModal(false); alert('Transfer request submitted!'); }} className="flex-1 btn-primary">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
