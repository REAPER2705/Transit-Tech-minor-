import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';

export default function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stops, setStops] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const routeRes = await adminAPI.listRoutes();
      setRoutes(routeRes.data.data);
      const stopRes = await adminAPI.listStops();
      setStops(stopRes.data.data);
    } catch (err) {
      console.error('Failed to load routes:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="glass p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Route Management</h2>

      <div className="space-y-4">
        {routes.map(route => (
          <div key={route._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800">{route.name}</h3>
            <p className="text-sm text-gray-600">{route.routeCode}</p>
            <div className="mt-2">
              <p className="text-sm text-gray-700">Stops: {route.stopIds?.length || 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
