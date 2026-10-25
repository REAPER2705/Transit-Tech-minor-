import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const res = await adminAPI.listSchedules();
      setSchedules(res.data.data);
    } catch (err) {
      console.error('Failed to load schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="glass p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule Management</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Schedule Code</th>
              <th className="px-4 py-2">Shift</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Bus</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(schedule => (
              <tr key={schedule._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{schedule.scheduleCode}</td>
                <td className="px-4 py-2">{schedule.shiftCode}</td>
                <td className="px-4 py-2">{new Date(schedule.serviceDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  {schedule.startTimeLocal} - {schedule.endTimeLocal}
                </td>
                <td className="px-4 py-2">{schedule.busId?.busCode}</td>
                <td className="px-4 py-2">
                  <span className={`badge ${schedule.status === 'scheduled' ? 'badge-info' : 'badge-success'}`}>
                    {schedule.status}
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
