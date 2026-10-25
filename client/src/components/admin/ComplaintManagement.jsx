import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const res = await adminAPI.listComplaints();
      setComplaints(res.data.data);
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComplaint = async (complaintId, status) => {
    setSubmitting(true);
    try {
      await adminAPI.updateComplaint(complaintId, {
        status,
        adminResponse: response || undefined,
      });
      setResponse('');
      setSelectedComplaint(null);
      loadComplaints();
    } catch (err) {
      console.error('Failed to update complaint:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="glass p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Complaint Management</h2>

        <div className="space-y-4">
          {complaints.map(complaint => (
            <div
              key={complaint._id}
              className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300 cursor-pointer hover:border-blue-500 transition-smooth"
              onClick={() => setSelectedComplaint(complaint)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {complaint.category.replace(/_/g, ' ').toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600">{complaint.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
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
                  {complaint.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedComplaint && (
        <div className="glass p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Update Complaint</h3>

          <div className="space-y-4 mb-6 p-4 bg-blue-50 rounded">
            <p>
              <strong>Category:</strong> {selectedComplaint.category.replace(/_/g, ' ').toUpperCase()}
            </p>
            <p>
              <strong>Description:</strong> {selectedComplaint.description}
            </p>
            <p>
              <strong>Submitted by:</strong> {selectedComplaint.submittedBy?.displayName}
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="label">Status</label>
              <select className="input-field" defaultValue={selectedComplaint.status}>
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
                rows="4"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Provide a response to the complainant..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => handleUpdateComplaint(selectedComplaint._id, 'in_progress')}
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Updating...' : 'Mark In Progress'}
              </button>
              <button
                type="button"
                onClick={() => handleUpdateComplaint(selectedComplaint._id, 'resolved')}
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Updating...' : 'Mark Resolved'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="btn-secondary"
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
