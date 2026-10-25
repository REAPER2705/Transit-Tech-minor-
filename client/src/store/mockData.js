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
  sourceFile: 'July 2015 Timetable Archive',
  verificationStatus: 'NEEDS_VERIFICATION',
  shifts: [
    {
      shiftId: 'SHIFT-1',
      schedules: [
        { routeId: 'ROUTE-01', departureTime: '08:20', status: 'SCHEDULED' },
        { routeId: 'ROUTE-02', departureTime: '09:00', status: 'SCHEDULED' },
      ],
    },
    {
      shiftId: 'SHIFT-2',
      schedules: [
        { routeId: 'ROUTE-01', departureTime: '10:30', status: 'SCHEDULED' },
      ],
    },
  ],
};

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
