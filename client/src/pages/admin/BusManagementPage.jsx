import { useState } from 'react';
import { mockBuses } from '../../store/mockData';

export default function BusManagementPage() {
  const [buses, setBuses] = useState(mockBuses);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ busCode: '', registrationNumber: '', capacity: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.busCode || !formData.capacity) {
      alert('Please fill required fields');
      return;
    }

    const newBus = {
      _id: String(buses.length + 1),
      ...formData,
      capacity: parseInt(formData.capacity),
      status: 'active',
    };

    setBuses([...buses, newBus]);
    setFormData({ busCode: '', registrationNumber: '', capacity: '' });
    setShowForm(false);
    alert('Bus created successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Bus Management</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? '✕ Cancel' : '+ New Bus'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg space-y-4 mb-6">
            <input
              type="text"
              placeholder="Bus Code (e.g., G-47)"
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buses.map(bus => (
          <div key={bus._id} className="glass p-4 rounded-xl">
            <h3 className="font-bold text-gray-800 text-lg">{bus.busCode}</h3>
            <p className="text-sm text-gray-600">{bus.registrationNumber}</p>
            <p className="text-sm mt-2"><strong>Capacity:</strong> {bus.capacity}</p>
            <span className={`badge mt-2 ${bus.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
              {bus.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
