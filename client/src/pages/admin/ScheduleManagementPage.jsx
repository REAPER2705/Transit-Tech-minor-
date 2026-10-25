import { useState } from 'react';
import { mockSchedules } from '../../store/mockData';

export default function ScheduleManagementPage() {
  const [schedules] = useState(mockSchedules);

  return (
    <div className="glass p-6 rounded-xl overflow-x-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule Management</h2>

      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-3 font-semibold">Code</th>
            <th className="px-4 py-3 font-semibold">Shift</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Time</th>
            <th className="px-4 py-3 font-semibold">Bus</th>
            <th className="px-4 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(schedule => (
            <tr key={schedule._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-mono">{schedule.scheduleCode}</td>
              <td className="px-4 py-3">{schedule.shiftCode}</td>
              <td className="px-4 py-3">{new Date(schedule.serviceDate).toLocaleDateString()}</td>
              <td className="px-4 py-3">{schedule.startTimeLocal} - {schedule.endTimeLocal}</td>
              <td className="px-4 py-3">{schedule.busId?.busCode}</td>
              <td className="px-4 py-3"><span className="badge badge-info">{schedule.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
