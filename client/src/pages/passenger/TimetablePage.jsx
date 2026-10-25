import AcropolicTimetable from '../../components/AcropolicTimetable';

export default function TimetablePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bus Timetable</h1>
        <p className="text-gray-600 mt-1">Search stops and routes, view schedules and timings</p>
      </div>

      <AcropolicTimetable />
    </div>
  );
}
