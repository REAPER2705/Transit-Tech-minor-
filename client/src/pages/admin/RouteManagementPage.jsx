import { useState } from 'react';
import { mockRoutes, mockStops } from '../../store/mockData';

export default function RouteManagementPage() {
  const [routes] = useState(mockRoutes);

  return (
    <div className="glass p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Route Management</h2>

      <div className="space-y-4">
        {routes.map(route => (
          <div key={route._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-smooth">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-gray-800">{route.name}</h3>
                <p className="text-sm text-gray-600">{route.routeCode}</p>
              </div>
              <span className="badge badge-info">{route.stopIds?.length || 0} stops</span>
            </div>
            <p className="text-sm text-gray-600">Direction: {route.direction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
