import { useState } from 'react';

export default function OperationalReports() {
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit to API
    setSubmitted(true);
    setTimeout(() => {
      setReportType('');
      setDescription('');
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6">
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
              <option value="route_obstruction">Route Obstruction</option>
              <option value="location_issue">Location/GPS Issue</option>
              <option value="vehicle_issue">Vehicle Issue</option>
              <option value="safety_concern">Safety Concern</option>
              <option value="other">Other</option>
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
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Report submitted successfully
          </div>
        )}
      </div>
    </div>
  );
}
