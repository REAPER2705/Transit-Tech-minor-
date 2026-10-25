import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api/v1';

export default function IncidentManagement() {
  const [activeTab, setActiveTab] = useState('incidents');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [complaintList, setComplaintList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Incident Form State
  const [incidentForm, setIncidentForm] = useState({
    busId: '',
    title: '',
    description: '',
    severity: 'MEDIUM',
    actionTaken: '',
  });

  const getToken = () => localStorage.getItem('authToken');

  // Fetch data on tab change
  useEffect(() => {
    if (activeTab === 'incidents' || activeTab === 'complaints') {
      fetchComplaints();
    } else if (activeTab === 'audit') {
      fetchAuditLogs();
    }
  }, [activeTab]);

  // ===== COMPLAINT MANAGEMENT =====
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/complaints`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch complaints');
      const json = await response.json();
      setComplaintList(json.data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (complaintId, status, adminResponse) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/complaints/${complaintId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, adminResponse }),
      });
      if (!response.ok) throw new Error('Failed to update complaint');
      const json = await response.json();
      setComplaintList(complaintList.map(c => c._id === complaintId ? json.data : c));
      setSuccess(`Complaint ${status.toLowerCase()}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating complaint:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== AUDIT LOGS =====
  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admin/audit-logs`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      const json = await response.json();
      setAuditLogs(json.data);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-space-lg bg-surface-container-lowest rounded-xl space-y-space-lg">
      {/* Tab Navigation */}
      <div className="flex items-center gap-space-sm border-b border-outline-variant">
        {['incidents', 'complaints', 'audit'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-space-md py-2 font-label-md text-label-md border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary text-on-surface'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Error & Success Messages */}
      {error && (
        <div className="p-space-sm rounded-lg bg-error-container text-on-error-container flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}
      {success && (
        <div className="p-space-sm rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {success}
        </div>
      )}

      {/* Incidents Tab */}
      {activeTab === 'incidents' && (
        <div className="space-y-space-lg">
          <div className="p-space-md bg-surface-container rounded-lg space-y-space-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface">Report Incident</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Log operational incidents requiring immediate attention and action tracking.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
              <input
                type="text"
                placeholder="Incident Title"
                value={incidentForm.title}
                onChange={(e) => setIncidentForm({ ...incidentForm, title: e.target.value })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
              />
              <select
                value={incidentForm.severity}
                onChange={(e) => setIncidentForm({ ...incidentForm, severity: e.target.value })}
                className="px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
              >
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
                <option>CRITICAL</option>
              </select>
            </div>
            <textarea
              placeholder="Incident Description"
              value={incidentForm.description}
              onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
              rows="3"
            />
            <textarea
              placeholder="Action Taken / Resolution"
              value={incidentForm.actionTaken}
              onChange={(e) => setIncidentForm({ ...incidentForm, actionTaken: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-outline bg-surface text-on-surface"
              rows="2"
            />
            <button
              disabled={loading || !incidentForm.title || !incidentForm.description}
              className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-on-primary-fixed-variant disabled:opacity-50"
            >
              Log Incident
            </button>
          </div>
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === 'complaints' && (
        <div className="space-y-space-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase">
                <tr>
                  <th className="px-3 py-2">Complaint ID</th>
                  <th className="px-3 py-2">Submitted By</th>
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {complaintList.map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-surface-container-high transition-colors">
                    <td className="px-3 py-2 font-bold text-primary">{complaint._id?.slice(-8) || 'N/A'}</td>
                    <td className="px-3 py-2">{complaint.submittedBy?.displayName || complaint.submittedBy?.email || 'Unknown'}</td>
                    <td className="px-3 py-2">{complaint.subject || complaint.title || 'N/A'}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-label-sm font-bold ${
                        complaint.status === 'resolved' ? 'bg-tertiary-fixed text-on-tertiary-fixed' :
                        complaint.status === 'in_progress' ? 'bg-secondary-fixed text-on-secondary-fixed' :
                        'bg-error-container text-on-error-container'
                      }`}>
                        {complaint.status?.toUpperCase() || 'SUBMITTED'}
                      </span>
                    </td>
                    <td className="px-3 py-2 flex items-center gap-1">
                      <button
                        onClick={() => updateComplaintStatus(complaint._id, 'in_progress', 'We are investigating this matter.')}
                        disabled={loading || complaint.status === 'in_progress'}
                        className="px-2 py-1 rounded bg-secondary-container hover:bg-secondary text-on-secondary-container text-label-sm disabled:opacity-50"
                      >
                        Start
                      </button>
                      <button
                        onClick={() => updateComplaintStatus(complaint._id, 'resolved', 'This issue has been resolved.')}
                        disabled={loading}
                        className="px-2 py-1 rounded bg-tertiary-container hover:bg-tertiary text-on-tertiary-container text-label-sm"
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-space-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase">
                <tr>
                  <th className="px-3 py-2">Timestamp</th>
                  <th className="px-3 py-2">Actor</th>
                  <th className="px-3 py-2">Action</th>
                  <th className="px-3 py-2">Entity Type</th>
                  <th className="px-3 py-2">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {auditLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-surface-container-high transition-colors">
                    <td className="px-3 py-2 text-on-surface-variant text-[12px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{log.actorId?.displayName || log.actorId?.email || 'System'}</td>
                    <td className="px-3 py-2 font-mono text-[12px]">{log.action}</td>
                    <td className="px-3 py-2">{log.entityType}</td>
                    <td className="px-3 py-2 text-on-surface-variant text-[12px] max-w-[200px] truncate">
                      {JSON.stringify(log.after || {}).slice(0, 50)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
