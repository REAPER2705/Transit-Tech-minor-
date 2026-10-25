import { useState } from 'react';
import { mockComplaints } from '../../store/mockData';

export default function ComplaintManagementPage() {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');

  const handleUpdateComplaint = (complaintId, status) => {
    setComplaints(complaints.map(c =>
      c._id === complaintId
        ? { ...c, status, adminResponse: response || c.adminResponse }
        : c
    ));
    setSelectedComplaint(null);
    setResponse('');
    alert('Complaint updated!');
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Complaint Management</h2>

        <div className="space-y-3">
          {complaints.map(complaint => (
            <button
              key={complaint._id}
              onClick={() => setSelectedComplaint(complaint)}
              className="w-full p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300 hover:border-blue-500 transition-smooth text-left"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {complaint.category.replace(/_/g, ' ').toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {complaint.submittedBy?.displayName} • {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`badge whitespace-nowrap ${
                  complaint.status === 'resolved'
                    ? 'badge-success'
                    : complaint.status === 'in_progress'
                    ? 'badge-warning'
                    : 'badge-info'
                }`}>
                  {complaint.status.toUpperCase()}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedComplaint && (
        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Update Complaint</h3>

          <div className="p-4 bg-blue-50 rounded-lg mb-6">
            <p><strong>Category:</strong> {selectedComplaint.category}</p>
            <p className="mt-2"><strong>Description:</strong> {selectedComplaint.description}</p>
            <p className="mt-2"><strong>Submitted by:</strong> {selectedComplaint.submittedBy?.displayName}</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="label">Status</label>
              <select defaultValue={selectedComplaint.status} className="input-field">
                <option value="submitted">Submitted</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="label">Admin Response</label>
              <textarea
                className="input-field"
                rows="3"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Provide a response..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => handleUpdateComplaint(selectedComplaint._id, 'in_progress')}
                className="flex-1 btn-primary"
              >
                Mark In Progress
              </button>
              <button
                type="button"
                onClick={() => handleUpdateComplaint(selectedComplaint._id, 'resolved')}
                className="flex-1 btn-primary"
              >
                Mark Resolved
              </button>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="flex-1 btn-secondary"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
