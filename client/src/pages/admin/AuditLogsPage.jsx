import { useState } from 'react';
import { mockAuditLogs } from '../../store/mockData';

export default function AuditLogsPage() {
  const [logs] = useState(mockAuditLogs);

  return (
    <div className="glass p-6 rounded-xl overflow-x-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Audit Logs</h2>

      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-3 font-semibold">Timestamp</th>
            <th className="px-4 py-3 font-semibold">Actor</th>
            <th className="px-4 py-3 font-semibold">Action</th>
            <th className="px-4 py-3 font-semibold">Entity Type</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 text-xs">
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3">{log.actorId?.displayName || 'System'}</td>
              <td className="px-4 py-3 font-medium">
                {log.action.replace(/_/g, ' ').toUpperCase()}
              </td>
              <td className="px-4 py-3">{log.entityType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
