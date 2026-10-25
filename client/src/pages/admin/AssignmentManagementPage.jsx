import { useState } from 'react';
import { mockAssignments } from '../../store/mockData';

export default function AssignmentManagementPage() {
  const [assignments] = useState(mockAssignments);

  return (
    <div className="glass p-6 rounded-xl overflow-x-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Passenger Assignments</h2>

      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-3 font-semibold">Code</th>
            <th className="px-4 py-3 font-semibold">Passenger</th>
            <th className="px-4 py-3 font-semibold">Bus</th>
            <th className="px-4 py-3 font-semibold">Boarding Stop</th>
            <th className="px-4 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(assignment => (
            <tr key={assignment._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs">{assignment.assignmentCode}</td>
              <td className="px-4 py-3">Priya Sharma</td>
              <td className="px-4 py-3">{assignment.busId?.busCode}</td>
              <td className="px-4 py-3">Palasia Square</td>
              <td className="px-4 py-3"><span className="badge badge-success">{assignment.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
