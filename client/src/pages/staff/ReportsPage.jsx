import { useState } from 'react';

const reportTypes = [
  { value: 'route_obstruction', label: 'Route Obstruction' },
  { value: 'location_issue', label: 'Location/GPS Issue' },
  { value: 'vehicle_issue', label: 'Vehicle Issue' },
  { value: 'safety_concern', label: 'Safety Concern' },
  { value: 'other', label: 'Other' },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reportType || !description) {
      alert('Please fill all fields');
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setReportType('');
      setDescription('');
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Operational Reports</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Report Type</label>
            <select
              className="input-field"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              required
            >
              <option value="">Select report type</option>
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Describe the operational issue..."
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Submit Report
          </button>
        </form>

        {submitted && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-pulse">
            ✓ Report submitted successfully
          </div>
        )}
      </div>

      {/* Recent Reports */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Reports</h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <p className="font-semibold text-gray-800">Route Obstruction - 2 hrs ago</p>
            <p className="text-gray-600">Traffic jam near Tribunal Square</p>
          </div>
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <p className="font-semibold text-gray-800">Vehicle Issue - 4 hrs ago</p>
            <p className="text-gray-600">AC not functioning properly</p>
          </div>
        </div>
      </div>
    </div>
  );
}
