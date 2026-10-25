import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';

export default function BusManagement() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    busCode: '',
    registrationNumber: '',
    capacity: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      const res = await adminAPI.listBuses();
      setBuses(res.data.data);
    } catch (err) {
      setError('Failed to load buses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createBus(formData);
      setFormData({ busCode: '', registrationNumber: '', capacity: '' });
      setShowForm(false);
      loadBuses();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create bus');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      {error && <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      <div className="glass p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Bus Management</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : '+ New Bus'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <input
              type="text"
              placeholder="Bus Code"
              className="input-field"
              value={formData.busCode}
              onChange={(e) => setFormData({ ...formData, busCode: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Registration Number"
              className="input-field"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
            />
            <input
              type="number"
              placeholder="Capacity"
              className="input-field"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary w-full">
              Create Bus
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buses.map(bus => (
            <div key={bus._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800">{bus.busCode}</h3>
              <p className="text-sm text-gray-600">{bus.registrationNumber}</p>
              <p className="text-sm mt-2">
                <strong>Capacity:</strong> {bus.capacity}
              </p>
              <span className={`badge mt-2 ${bus.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                {bus.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
