import { useState, useEffect } from 'react';
import { passengerAPI } from '../utils/api';

const complaintCategories = [
  'safety',
  'cleanliness',
  'driver_behavior',
  'schedule_issue',
  'vehicle_condition',
  'other',
];

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const res = await passengerAPI.getComplaints();
      setComplaints(res.data.data);
    } catch (err) {
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.description) {
      setError('Please fill all fields');
      return;
    }

    try {
      await passengerAPI.submitComplaint(formData);
      setSuccess('Complaint submitted successfully');
      setFormData({ category: '', description: '' });
      setShowForm(false);
      loadComplaints();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to submit complaint');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Submit Form */}
      <div className="glass p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Requests & Complaints</h2>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            + New Complaint
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            <div>
              <label className="label">Category</label>
              <select
                className="input-field"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select category</option>
                {complaintCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                className="input-field"
                rows="4"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the issue..."
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Complaints List */}
      <div className="glass p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">My Complaints</h3>

        {complaints.length === 0 ? (
          <p className="text-gray-600">No complaints yet</p>
        ) : (
          <div className="space-y-4">
            {complaints.map(complaint => (
              <div key={complaint._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800">
                      {complaint.category.replace(/_/g, ' ').toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`badge ${
                    complaint.status === 'resolved'
                      ? 'badge-success'
                      : complaint.status === 'in_progress'
                      ? 'badge-warning'
                      : 'badge-info'
                  }`}>
                    {complaint.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{complaint.description}</p>
                {complaint.adminResponse && (
                  <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="text-sm font-medium text-blue-900">Admin Response:</p>
                    <p className="text-sm text-blue-800">{complaint.adminResponse}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
