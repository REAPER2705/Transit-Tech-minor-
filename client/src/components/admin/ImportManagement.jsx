import { useState } from 'react';
import { adminAPI } from '../../utils/api';

export default function ImportManagement() {
  const [importType, setImportType] = useState('');
  const [shiftCode, setShiftCode] = useState('');
  const [file, setFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0]);
  };

  const handleValidate = async (e) => {
    e.preventDefault();
    if (!importType || !file) {
      setError('Please select import type and file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('importType', importType);
      if (shiftCode) formData.append('shiftCode', shiftCode);
      formData.append('file', file);

      const res = await adminAPI.validateImport(formData);
      setValidationResult(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Validation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      <div className="glass p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Import</h2>

        <form onSubmit={handleValidate} className="space-y-4">
          <div>
            <label className="label">Import Type</label>
            <select
              className="input-field"
              value={importType}
              onChange={(e) => setImportType(e.target.value)}
              required
            >
              <option value="">Select import type</option>
              <option value="buses">Buses</option>
              <option value="routes_stops">Routes & Stops</option>
              <option value="schedules">Schedules</option>
              <option value="passenger_assignments">Passenger Assignments</option>
              <option value="staff_assignments">Staff Assignments</option>
            </select>
          </div>

          {['passenger_assignments', 'staff_assignments'].includes(importType) && (
            <div>
              <label className="label">Shift</label>
              <select
                className="input-field"
                value={shiftCode}
                onChange={(e) => setShiftCode(e.target.value)}
                required
              >
                <option value="">Select shift</option>
                <option value="SHIFT_1">Shift 1 (08:20 - 14:40)</option>
                <option value="SHIFT_2">Shift 2 (10:30 - 17:00)</option>
              </select>
            </div>
          )}

          <div>
            <label className="label">File (Excel or CSV)</label>
            <input
              type="file"
              className="input-field"
              onChange={handleFileChange}
              accept=".xlsx,.csv"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Validating...' : 'Validate & Preview'}
          </button>
        </form>
      </div>

      {validationResult && (
        <div className="glass p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Validation Result</h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded">
              <p className="text-sm text-blue-700">Total Rows</p>
              <p className="text-2xl font-bold text-blue-900">{validationResult.importJob.rowCount}</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <p className="text-sm text-green-700">Valid</p>
              <p className="text-2xl font-bold text-green-900">{validationResult.importJob.validCount}</p>
            </div>
            <div className="p-4 bg-red-50 rounded">
              <p className="text-sm text-red-700">Errors</p>
              <p className="text-2xl font-bold text-red-900">{validationResult.importJob.errorCount}</p>
            </div>
          </div>

          {validationResult.importJob.errors.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Errors:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {validationResult.importJob.errors.map((err, idx) => (
                  <p key={idx} className="text-sm text-red-600">
                    Row {err.rowNumber}: {err.message}
                  </p>
                ))}
              </div>
            </div>
          )}

          <button className="btn-primary w-full">
            Commit Import
          </button>
        </div>
      )}
    </div>
  );
}
