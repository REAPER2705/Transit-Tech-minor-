import { useState } from 'react';
import { mockComplaints } from '../../store/mockData';

const complaintCategories = [
  { value: 'safety', label: 'Safety Concern' },
  { value: 'cleanliness', label: 'Cleanliness' },
  { value: 'driver_behavior', label: 'Driver Behavior' },
  { value: 'schedule_issue', label: 'Schedule Issue' },
  { value: 'vehicle_condition', label: 'Vehicle Condition' },
  { value: 'other', label: 'Other' },
];

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.description) {
      alert('Please fill all fields');
      return;
    }

    const newComplaint = {
      _id: String(complaints.length + 1),
      complaintCode: `COMP-${String(complaints.length + 2).padStart(3, '0')}`,
      category: formData.category,
      description: formData.description,
      status: 'submitted',
      submittedBy: { displayName: 'You' },
      adminResponse: null,
      createdAt: new Date().toISOString(),
    };

    setComplaints([newComplaint, ...complaints]);
    setFormData({ category: '', description: '' });
    setShowForm(false);
    alert('Complaint submitted successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Submit Form */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Requests & Complaints</h2>

        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + New Complaint
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Category</label>
              <select
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select category</option>
                {complaintCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
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
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
      <div className="glass p-6 rounded-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">My Complaints</h3>

        {complaints.length === 0 ? (
          <p className="text-gray-600">No complaints yet</p>
        ) : (
          <div className="space-y-4">
            {complaints.map(complaint => (
              <div key={complaint._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-smooth">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {complaintCategories.find(c => c.value === complaint.category)?.label}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(complaint.createdAt).toLocaleDateString()} • {complaint.complaintCode}
                    </p>
                  </div>
                  <span className={`badge whitespace-nowrap ${
                    complaint.status === 'resolved'
                      ? 'badge-success'
                      : complaint.status === 'in_progress'
                      ? 'badge-warning'
                      : complaint.status === 'submitted'
                      ? 'badge-info'
                      : 'badge-danger'
                  }`}>
                    {complaint.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{complaint.description}</p>
                {complaint.adminResponse && (
                  <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="text-sm font-semibold text-blue-900">Admin Response:</p>
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
