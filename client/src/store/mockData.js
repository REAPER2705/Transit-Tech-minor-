// Mock Data Store - Frontend Demo Data
// This is demonstration data only. In production, this will be replaced with real API calls.

export const mockBuses = [
  {
    id: 'G-47',
    status: 'ACTIVE',
    capacity: 50,
    officialCapacity: 50,
    staffCapacity: 2,
    currentOccupancy: 38,
    lastOccupancyUpdate: new Date(Date.now() - 3 * 60000), // 3 mins ago
    assignedRoute: 'ROUTE-01',
    assignedShift: 'SHIFT-1',
    lastGPSUpdate: new Date(Date.now() - 8000), // 8 secs ago
    currentLocation: { lat: 22.7196, lng: 75.8577 },
    currentSpeed: 32,
    currentHeading: 42,
  },
  {
    id: 'G-39',
    status: 'ACTIVE',
    capacity: 50,
    officialCapacity: 50,
    staffCapacity: 2,
    currentOccupancy: 31,
    lastOccupancyUpdate: new Date(Date.now() - 5 * 60000),
    assignedRoute: 'ROUTE-01',
    assignedShift: 'SHIFT-1',
    lastGPSUpdate: new Date(Date.now() - 45000),
    currentLocation: { lat: 22.7150, lng: 75.8500 },
    currentSpeed: 28,
    currentHeading: 45,
  },
  {
    id: 'G-34',
    status: 'ACTIVE',
    capacity: 50,
    officialCapacity: 50,
    staffCapacity: 2,
    currentOccupancy: 42,
    lastOccupancyUpdate: new Date(Date.now() - 2 * 60000),
    assignedRoute: 'ROUTE-01',
    assignedShift: 'SHIFT-1',
    lastGPSUpdate: new Date(Date.now() - 60000),
    currentLocation: { lat: 22.7100, lng: 75.8450 },
    currentSpeed: 25,
    currentHeading: 40,
  },
  {
    id: 'G-41',
    status: 'MAINTENANCE',
    capacity: 50,
    officialCapacity: 50,
    staffCapacity: 2,
    currentOccupancy: 0,
    lastOccupancyUpdate: null,
    assignedRoute: null,
    assignedShift: null,
  },
];

export const mockRoutes = [
  {
    id: 'ROUTE-01',
    name: 'Main Campus Corridor',
    description: 'Palasia Square → AITR Campus Central',
    fromLocation: 'Palasia Square',
    toLocation: 'AITR Campus Central',
    distance: 12.5,
    estimatedDuration: 45,
    stops: ['STOP-01', 'STOP-02', 'STOP-03', 'STOP-04'],
    activeBuses: ['G-47', 'G-39', 'G-34'],
    shift: 'SHIFT-1',
  },
  {
    id: 'ROUTE-02',
    name: 'North Ring Bypass',
    description: 'Tech Park → Library Complex',
    fromLocation: 'Tech Park',
    toLocation: 'Library Complex',
    distance: 8.3,
    estimatedDuration: 30,
    stops: ['STOP-02', 'STOP-03', 'STOP-05'],
    activeBuses: [],
    shift: 'SHIFT-1',
  },
];

export const mockStops = [
  {
    id: 'STOP-01',
    name: 'Campus Main Gate',
    location: { lat: 22.7250, lng: 75.8600 },
    routes: ['ROUTE-01'],
    sequenceInRoute: { 'ROUTE-01': 1 },
  },
  {
    id: 'STOP-02',
    name: 'Central Library Bay 2',
    location: { lat: 22.7196, lng: 75.8577 },
    routes: ['ROUTE-01', 'ROUTE-02'],
    sequenceInRoute: { 'ROUTE-01': 2, 'ROUTE-02': 1 },
  },
  {
    id: 'STOP-03',
    name: 'Hostel Plaza',
    location: { lat: 22.7150, lng: 75.8500 },
    routes: ['ROUTE-01', 'ROUTE-02'],
    sequenceInRoute: { 'ROUTE-01': 3, 'ROUTE-02': 2 },
  },
  {
    id: 'STOP-04',
    name: 'Academic Block A',
    location: { lat: 22.7100, lng: 75.8450 },
    routes: ['ROUTE-01'],
    sequenceInRoute: { 'ROUTE-01': 4 },
  },
  {
    id: 'STOP-05',
    name: 'Innovation Block B',
    location: { lat: 22.7050, lng: 75.8400 },
    routes: ['ROUTE-02'],
    sequenceInRoute: { 'ROUTE-02': 3 },
  },
];

export const mockShifts = [
  {
    id: 'SHIFT-1',
    name: 'Shift 1 - Morning',
    startTime: '08:20',
    endTime: '14:40',
    status: 'ACTIVE',
    verificationStatus: 'PENDING_VERIFICATION',
    source: 'July 2015 Timetable Archive',
  },
  {
    id: 'SHIFT-2',
    name: 'Shift 2 - Afternoon',
    startTime: '10:30',
    endTime: '17:00',
    status: 'INACTIVE',
    verificationStatus: 'PENDING_VERIFICATION',
    source: 'July 2015 Timetable Archive',
  },
];

export const mockPassengers = [
  {
    id: 'PASS-001',
    name: 'Demo Passenger',
    role: 'Student',
    assignedBus: 'G-47',
    assignedRoute: 'ROUTE-01',
    assignedStop: 'STOP-02',
    assignedShift: 'SHIFT-1',
    status: 'ACTIVE',
  },
];

export const mockStaff = [
  {
    id: 'STAFF-001',
    name: 'Rajesh Kumar',
    role: ['DRIVER'],
    assignedBus: 'G-47',
    assignedRoute: 'ROUTE-01',
    assignedShift: 'SHIFT-1',
    status: 'ACTIVE',
  },
  {
    id: 'STAFF-002',
    name: 'Vikram Singh',
    role: ['CONDUCTOR'],
    assignedBus: 'G-47',
    assignedRoute: 'ROUTE-01',
    assignedShift: 'SHIFT-1',
    status: 'ACTIVE',
  },
];

export const mockRequests = [
  {
    id: 'REQ-001',
    type: 'ASSIGNMENT_REQUEST',
    submittedBy: 'PASS-001',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 24 * 60 * 60000),
    details: 'Request for bus assignment to Route 01',
  },
];

export const mockComplaints = [
  {
    id: 'COMP-001',
    submittedBy: 'PASS-001',
    category: 'DELAY',
    description: 'Bus was 10 minutes late',
    relatedBus: 'G-47',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 2 * 60 * 60000),
  },
];

export const mockNotifications = [
  {
    id: 'NOTIF-001',
    type: 'BUS_APPROACHING',
    message: 'Your bus G-47 is approaching Library Stop in 8 minutes',
    read: false,
    createdAt: new Date(),
  },
  {
    id: 'NOTIF-002',
    type: 'OCCUPANCY_UPDATE',
    message: 'Bus G-47 is 76% full - 12 seats available',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60000),
  },
];

export const mockTrips = [
  {
    id: 'TRIP-001',
    bus: 'G-47',
    route: 'ROUTE-01',
    shift: 'SHIFT-1',
    status: 'IN_PROGRESS',
    startTime: new Date(Date.now() - 2 * 60 * 60000),
    currentStop: 'STOP-02',
    nextStop: 'STOP-03',
    passengersAboard: 38,
  },
];

export const mockTimetable = {
  sourceFile: 'September 1, 2023 - Acropolis Institute Bus Schedule',
  sourceUrl: 'https://www.scribd.com/document/703073096/BusRoute-Sep23-1',
  sourceDate: '2023-09-01',
  verificationStatus: 'UNVERIFIED',
  disclaimer: 'Historical timetable — current timings unverified. Verify with transport office for current schedule.',
  shifts: [
    {
      shiftId: 'SHIFT-1',
      name: 'Shift 1 - Morning',
      startTime: '08:20',
      endTime: '14:40',
      schedules: [
        { routeId: 'ROUTE-01', departureTime: '08:20', status: 'SCHEDULED' },
        { routeId: 'ROUTE-02', departureTime: '08:45', status: 'SCHEDULED' },
        { routeId: 'ROUTE-01', departureTime: '09:00', status: 'SCHEDULED' },
      ],
    },
    {
      shiftId: 'SHIFT-2',
      name: 'Shift 2 - Afternoon',
      startTime: '10:30',
      endTime: '17:00',
      schedules: [
        { routeId: 'ROUTE-01', departureTime: '10:30', status: 'SCHEDULED' },
        { routeId: 'ROUTE-02', departureTime: '11:00', status: 'SCHEDULED' },
      ],
    },
  ],
};

// Timetable entries with stops and timings
export const mockTimetableEntries = [
  // ROUTE-01, SHIFT-1 timetable
  { id: 'TTE-001', routeId: 'ROUTE-01', stopId: 'STOP-01', shift: 'SHIFT-1', arrivalTime: '08:20', departureTime: '08:25', sequence: 1, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-002', routeId: 'ROUTE-01', stopId: 'STOP-02', shift: 'SHIFT-1', arrivalTime: '08:35', departureTime: '08:40', sequence: 2, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-003', routeId: 'ROUTE-01', stopId: 'STOP-03', shift: 'SHIFT-1', arrivalTime: '08:50', departureTime: '08:55', sequence: 3, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-004', routeId: 'ROUTE-01', stopId: 'STOP-04', shift: 'SHIFT-1', arrivalTime: '09:05', departureTime: '09:10', sequence: 4, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  
  // ROUTE-02, SHIFT-1 timetable
  { id: 'TTE-005', routeId: 'ROUTE-02', stopId: 'STOP-02', shift: 'SHIFT-1', arrivalTime: '08:45', departureTime: '08:50', sequence: 1, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-006', routeId: 'ROUTE-02', stopId: 'STOP-03', shift: 'SHIFT-1', arrivalTime: '09:00', departureTime: '09:05', sequence: 2, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-007', routeId: 'ROUTE-02', stopId: 'STOP-05', shift: 'SHIFT-1', arrivalTime: '09:15', departureTime: '09:20', sequence: 3, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  
  // ROUTE-01, SHIFT-2 timetable
  { id: 'TTE-008', routeId: 'ROUTE-01', stopId: 'STOP-01', shift: 'SHIFT-2', arrivalTime: '10:30', departureTime: '10:35', sequence: 1, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-009', routeId: 'ROUTE-01', stopId: 'STOP-02', shift: 'SHIFT-2', arrivalTime: '10:45', departureTime: '10:50', sequence: 2, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-010', routeId: 'ROUTE-01', stopId: 'STOP-03', shift: 'SHIFT-2', arrivalTime: '11:00', departureTime: '11:05', sequence: 3, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-011', routeId: 'ROUTE-01', stopId: 'STOP-04', shift: 'SHIFT-2', arrivalTime: '11:15', departureTime: '11:20', sequence: 4, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  
  // ROUTE-02, SHIFT-2 timetable
  { id: 'TTE-012', routeId: 'ROUTE-02', stopId: 'STOP-02', shift: 'SHIFT-2', arrivalTime: '11:00', departureTime: '11:05', sequence: 1, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-013', routeId: 'ROUTE-02', stopId: 'STOP-03', shift: 'SHIFT-2', arrivalTime: '11:15', departureTime: '11:20', sequence: 2, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-014', routeId: 'ROUTE-02', stopId: 'STOP-05', shift: 'SHIFT-2', arrivalTime: '11:30', departureTime: '11:35', sequence: 3, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
];

export const mockAuditLog = [
  {
    id: 'AUDIT-001',
    action: 'BUS_CREATED',
    entity: 'G-47',
    actor: 'ADMIN-001',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60000),
  },
  {
    id: 'AUDIT-002',
    action: 'OCCUPANCY_UPDATED',
    entity: 'G-47',
    actor: 'STAFF-002',
    timestamp: new Date(Date.now() - 3 * 60000),
  },
];

// Helper functions to ensure data consistency
export function getBusById(busId) {
  return mockBuses.find(b => b.id === busId);
}

export function getRouteById(routeId) {
  return mockRoutes.find(r => r.id === routeId);
}

export function getStopById(stopId) {
  return mockStops.find(s => s.id === stopId);
}

export function getStopsByRoute(routeId) {
  return mockStops.filter(stop => stop.routes.includes(routeId));
}

export function getBusesByRoute(routeId) {
  return mockBuses.filter(bus => bus.assignedRoute === routeId);
}

export function getPassengerAssignment(passengerId) {
  return mockPassengers.find(p => p.id === passengerId);
}
