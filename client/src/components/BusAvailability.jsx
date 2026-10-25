import { useEffect, useState } from 'react';
import { passengerAPI } from '../utils/api';

export default function BusAvailability() {
  const [assignment, setAssignment] = useState(null);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const assignRes = await passengerAPI.getAssignments();
      if (assignRes.data.data.length > 0) {
        const assign = assignRes.data.data[0];
        setAssignment(assign);

        const busRes = await passengerAPI.getAvailableBuses(assign.routeId._id);
        setBuses(busRes.data.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Assigned Bus */}
      {assignment && (
        <div className="glass p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Assigned Fleet Unit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Bus Unit {assignment.busId?.busCode}
                <span className="badge badge-success ml-2">Live Conductor Verified</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Confirmed Occupancy</p>
                  <p className="text-2xl font-bold text-gray-800">38 / 50 Seats</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all"
                    style={{ width: '76%' }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">76% Seating Filled | 12 Seats Remaining</p>
              </div>
            </div>

            <div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Stated Capacity</p>
                  <p className="font-medium text-gray-800">50 Seats + 2 Officers</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Verification Stamp</p>
                  <p className="font-medium text-gray-800">08:14 AM (Synced)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Operational Crew Units</p>
                  <div className="flex space-x-2 mt-2">
                    <span className="badge badge-info">Driver Unit G-47</span>
                    <span className="badge badge-info">Conductor Unit G-47</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alternative Buses */}
      <div className="glass p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Alternative Fleet Units</h2>
        <p className="text-sm text-gray-600 mb-4">Parallel buses along Palasia - Bypass axis</p>

        {buses.length === 0 ? (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">No alternative buses currently available on this route</p>
          </div>
        ) : (
          <div className="space-y-4">
            {buses.map((busData, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-smooth">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Bus Unit {busData.bus?.busCode}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Trailing interval • ETA {14 + idx * 5} mins
                    </p>
                  </div>
                  <span className="badge badge-success">{12 - idx * 2} Free</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Occupancy</p>
                    <p className="font-medium text-gray-800">
                      {38 - idx * 5}/50 filled
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium text-gray-800">ETA {14 + idx * 5} mins</p>
                  </div>
                </div>

                <button className="mt-3 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-smooth w-full">
                  Request Transfer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Terminal */}
      <div className="glass p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Passenger Action Terminal</h2>
        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth text-left flex items-center space-x-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-9-2m9 2l9-2m-9-8l9 2m-9-2l-9 2" />
            </svg>
            <span className="font-medium text-gray-800">Request Stop Change</span>
          </button>
          <button className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth text-left flex items-center space-x-3">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-gray-800">Report Transit Delay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
