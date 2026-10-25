import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';

export default function AssignmentManagement() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const res = await adminAPI.listAssignments();
      setAssignments(res.data.data);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="glass p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Passenger Assignments</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Passenger</th>
              <th className="px-4 py-2">Bus</th>
              <th className="px-4 py-2">Boarding Stop</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(assignment => (
              <tr key={assignment._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{assignment.passengerId?.displayName}</td>
                <td className="px-4 py-2">{assignment.busId?.busCode}</td>
                <td className="px-4 py-2">{assignment.boardingStopId?.name}</td>
                <td className="px-4 py-2">
                  <span className={`badge ${assignment.status === 'approved' ? 'badge-success' : 'badge-info'}`}>
                    {assignment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
