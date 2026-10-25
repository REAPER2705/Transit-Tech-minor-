import { useState } from 'react';

export default function ImportManagementPage() {
  const [importType, setImportType] = useState('');
  const [shiftCode, setShiftCode] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  const handleValidate = (e) => {
    e.preventDefault();
    if (!importType) {
      alert('Please select import type');
      return;
    }

    // Simulate file upload
    setValidationResult({
      importJob: {
        rowCount: 50,
        validCount: 48,
        errorCount: 2,
        errors: [
          { rowNumber: 12, message: 'Invalid bus code: Z-99' },
          { rowNumber: 34, message: 'Duplicate passenger email' },
        ],
      },
      preview: [
        { busCode: 'G-47', capacity: 50 },
        { busCode: 'G-39', capacity: 50 },
      ],
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-xl">
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
            <input type="file" className="input-field" accept=".xlsx,.csv" />
          </div>

          <button type="submit" className="btn-primary w-full">
            Validate & Preview
          </button>
        </form>
      </div>

      {validationResult && (
        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Validation Result</h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">Total Rows</p>
              <p className="text-3xl font-bold text-blue-900">{validationResult.importJob.rowCount}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">Valid</p>
              <p className="text-3xl font-bold text-green-900">{validationResult.importJob.validCount}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">Errors</p>
              <p className="text-3xl font-bold text-red-900">{validationResult.importJob.errorCount}</p>
            </div>
          </div>

          {validationResult.importJob.errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-900 mb-2">Errors:</h4>
              <div className="space-y-1 text-sm text-red-800">
                {validationResult.importJob.errors.map((err, idx) => (
                  <p key={idx}>Row {err.rowNumber}: {err.message}</p>
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
