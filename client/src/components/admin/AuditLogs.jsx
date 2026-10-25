import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const res = await adminAPI.getAuditLogs();
      setLogs(res.data.data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="glass p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Audit Logs</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Actor</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Entity</th>
              <th className="px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{log.actorId?.displayName || 'System'}</td>
                <td className="px-4 py-2 font-medium">{log.action.replace(/_/g, ' ').toUpperCase()}</td>
                <td className="px-4 py-2">
                  {log.entityType}
                </td>
                <td className="px-4 py-2 text-xs text-gray-600">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
