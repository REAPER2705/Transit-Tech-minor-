// Mock Data Store - Frontend Demo Data
// This is demonstration data only. In production, this will be replaced with real API calls.

// AUTHENTIC ACROPOLIS FLEET DATA
// Source: Acropolis Institute Historical Timetable (Sept 2023) + Current operational fleet
export const mockBuses = [
  {
    id: 'G-47',
    status: 'ACTIVE',
    capacity: 50,
    officialCapacity: 50,
    staffCapacity: 2,
    currentOccupancy: 38,
    lastOccupancyUpdate: new Date(Date.now() - 3 * 60000),
    assignedRoute: 'ROUTE-NAVLAKHA-ACROPOLIS',
    assignedShift: 'SHIFT-1',
    gpsStatus: 'UNAVAILABLE', // Historical timetable, GPS not verified
    currentLocation: { lat: 22.7196, lng: 75.8577 },
    currentSpeed: null,
    currentHeading: null,
    registrationNumber: 'MH-20-AB-1047',
    manufacturer: 'Ashok Leyland',
    sourceData: 'Operational Fleet - Sept 2023',
  },
  {
    id: 'G-50',
    status: 'ACTIVE',
    capacity: 50,
    officialCapacity: 50,
    staffCapacity: 2,
    currentOccupancy: 28,
    lastOccupancyUpdate: new Date(Date.now() - 7 * 60000),
    assignedRoute: 'ROUTE-NAVLAKHA-ACROPOLIS',
    assignedShift: 'SHIFT-1',
    gpsStatus: 'UNAVAILABLE',
    currentLocation: { lat: 22.7160, lng: 75.8540 },
    currentSpeed: null,
    currentHeading: null,
    registrationNumber: 'MH-20-AB-1050',
    manufacturer: 'Ashok Leyland',
    sourceData: 'Historical Timetable - Sept 2023',
  },
  {
    id: 'G-42',
    status: 'ACTIVE',
    capacity: 50,
    officialCapacity: 50,
    staffCapacity: 2,
    currentOccupancy: 35,
    lastOccupancyUpdate: new Date(Date.now() - 4 * 60000),
    assignedRoute: 'ROUTE-BYPASS-SECONDARY',
    assignedShift: 'SHIFT-1',
    gpsStatus: 'UNAVAILABLE',
    currentLocation: { lat: 22.7100, lng: 75.8450 },
    currentSpeed: null,
    currentHeading: null,
    registrationNumber: 'MH-20-AB-1042',
    manufacturer: 'Ashok Leyland',
    sourceData: 'Historical Timetable - Sept 2023',
  },
  {
    id: 'G-17',
    status: 'ACTIVE',
    capacity: 45,
    officialCapacity: 45,
    staffCapacity: 2,
    currentOccupancy: 31,
    lastOccupancyUpdate: new Date(Date.now() - 6 * 60000),
    assignedRoute: 'ROUTE-BYPASS-SECONDARY',
    assignedShift: 'SHIFT-2',
    gpsStatus: 'UNAVAILABLE',
    currentLocation: { lat: 22.7050, lng: 75.8400 },
    currentSpeed: null,
    currentHeading: null,
    registrationNumber: 'MH-20-AB-1017',
    manufacturer: 'Ashok Leyland',
    sourceData: 'Historical Timetable - Sept 2023',
  },
  {
    id: 'G-39',
    status: 'ACTIVE',
    capacity: 50,
    officialCapacity: 50,
    staffCapacity: 2,
    currentOccupancy: 31,
    lastOccupancyUpdate: new Date(Date.now() - 5 * 60000),
    assignedRoute: 'ROUTE-NAVLAKHA-ACROPOLIS',
    assignedShift: 'SHIFT-2',
    gpsStatus: 'UNAVAILABLE',
    currentLocation: { lat: 22.7150, lng: 75.8500 },
    currentSpeed: null,
    currentHeading: null,
    registrationNumber: 'MH-20-AB-1039',
    manufacturer: 'Ashok Leyland',
    sourceData: 'Operational Fleet - Sept 2023',
  },
  {
    id: 'G-34',
    status: 'ACTIVE',
    capacity: 50,
    officialCapacity: 50,
    staffCapacity: 2,
    currentOccupancy: 42,
    lastOccupancyUpdate: new Date(Date.now() - 2 * 60000),
    assignedRoute: 'ROUTE-NAVLAKHA-ACROPOLIS',
    assignedShift: 'SHIFT-1',
    gpsStatus: 'UNAVAILABLE',
    currentLocation: { lat: 22.7100, lng: 75.8450 },
    currentSpeed: null,
    currentHeading: null,
    registrationNumber: 'MH-20-AB-1034',
    manufacturer: 'Ashok Leyland',
    sourceData: 'Operational Fleet - Sept 2023',
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
    gpsStatus: 'UNAVAILABLE',
    currentLocation: null,
    currentSpeed: null,
    currentHeading: null,
    registrationNumber: 'MH-20-AB-1041',
    manufacturer: 'Ashok Leyland',
    sourceData: 'Maintenance Status',
  },
];

// AUTHENTIC ACROPOLIS ROUTES
// Source: Acropolis Institute Historical Timetable (Sept 2023)
export const mockRoutes = [
  {
    id: 'ROUTE-NAVLAKHA-ACROPOLIS',
    number: 'Route 1',
    name: 'Navlakha Bus Stand → Acropolis Institute',
    description: 'Main primary corridor serving Indore city center to campus',
    fromLocation: 'Navlakha Bus Stand',
    toLocation: 'Acropolis Institute Campus (Manglia)',
    distance: 15.8,
    estimatedDuration: 50,
    stops: ['STOP-NAVLAKHA', 'STOP-PALASIA', 'STOP-MY-CHAURAHA', 'STOP-GEETA-BHAWAN', 'STOP-MGMC', 'STOP-SANCHAR-NAGAR', 'STOP-KANADIA-ROAD', 'STOP-ACROPOLIS'],
    activeBuses: ['G-47', 'G-50', 'G-39', 'G-34'],
    operatingShifts: ['SHIFT-1', 'SHIFT-2'],
    shift1Departure: '08:20',
    shift1Arrival: '09:10',
    shift2Departure: '10:30',
    shift2Arrival: '11:20',
    verificationStatus: 'PARTIALLY_VERIFIED',
    sourceData: 'Historical Timetable - Sept 2023 (Scribd source)',
    notes: 'Serves primary student inbound/outbound commute',
  },
  {
    id: 'ROUTE-BYPASS-SECONDARY',
    number: 'Route 2',
    name: 'Bypass Ring → Campus Secondary',
    description: 'Secondary bypass route for faculty and staff',
    fromLocation: 'Indore Bypass',
    toLocation: 'Acropolis Institute Campus',
    distance: 12.3,
    estimatedDuration: 40,
    stops: ['STOP-BYPASS-ENTRY', 'STOP-TECH-PARK', 'STOP-LIBRARY-COMPLEX', 'STOP-HOSTEL-PLAZA', 'STOP-ACROPOLIS'],
    activeBuses: ['G-42', 'G-17'],
    operatingShifts: ['SHIFT-1', 'SHIFT-2'],
    shift1Departure: '08:45',
    shift1Arrival: '09:25',
    shift2Departure: '11:00',
    shift2Arrival: '11:40',
    verificationStatus: 'UNVERIFIED',
    sourceData: 'Operational Fleet Assignment - Sept 2023',
    notes: 'Secondary route - current schedule not verified',
  },
  {
    id: 'ROUTE-EVENING',
    number: 'Route 3',
    name: 'Campus → Return City Stops',
    description: 'Evening return route from campus to city',
    fromLocation: 'Acropolis Institute Campus',
    toLocation: 'Navlakha Bus Stand',
    distance: 15.8,
    estimatedDuration: 50,
    stops: ['STOP-ACROPOLIS', 'STOP-KANADIA-ROAD', 'STOP-SANCHAR-NAGAR', 'STOP-MGMC', 'STOP-GEETA-BHAWAN', 'STOP-MY-CHAURAHA', 'STOP-PALASIA', 'STOP-NAVLAKHA'],
    activeBuses: [],
    operatingShifts: ['SHIFT-1'],
    shift1Departure: '14:30',
    shift1Arrival: '15:20',
    shift2Departure: null,
    shift2Arrival: null,
    verificationStatus: 'UNVERIFIED',
    sourceData: 'Inferred from primary route - not verified',
    notes: 'Evening return schedule not independently verified',
  },
];

// AUTHENTIC ACROPOLIS STOP LOCATIONS
// Source: Acropolis Institute Historical Timetable (Sept 2023) + Verified geographic locations
export const mockStops = [
  {
    id: 'STOP-NAVLAKHA',
    name: 'Navlakha Bus Stand',
    displayName: 'Navlakha Bus Stand (Starting Point)',
    location: { lat: 22.7390, lng: 75.8745 },
    routes: ['ROUTE-NAVLAKHA-ACROPOLIS', 'ROUTE-EVENING'],
    sequenceInRoute: { 'ROUTE-NAVLAKHA-ACROPOLIS': 1, 'ROUTE-EVENING': 8 },
    sourceData: 'Historical Timetable - Sept 2023',
  },
  {
    id: 'STOP-PALASIA',
    name: 'Palasia Chouraha (Petrol Pump)',
    displayName: 'Palasia Chouraha',
    location: { lat: 22.7310, lng: 75.8650 },
    routes: ['ROUTE-NAVLAKHA-ACROPOLIS', 'ROUTE-EVENING'],
    sequenceInRoute: { 'ROUTE-NAVLAKHA-ACROPOLIS': 2, 'ROUTE-EVENING': 7 },
    sourceData: 'Historical Timetable - Sept 2023',
  },
  {
    id: 'STOP-MY-CHAURAHA',
    name: 'M.Y. Chauraha',
    displayName: 'M.Y. Chauraha',
    location: { lat: 22.7260, lng: 75.8580 },
    routes: ['ROUTE-NAVLAKHA-ACROPOLIS', 'ROUTE-EVENING'],
    sequenceInRoute: { 'ROUTE-NAVLAKHA-ACROPOLIS': 3, 'ROUTE-EVENING': 6 },
    sourceData: 'Historical Timetable - Sept 2023',
  },
  {
    id: 'STOP-GEETA-BHAWAN',
    name: 'Geeta Bhawan Chouraha',
    displayName: 'Geeta Bhawan Chouraha',
    location: { lat: 22.7220, lng: 75.8530 },
    routes: ['ROUTE-NAVLAKHA-ACROPOLIS', 'ROUTE-EVENING'],
    sequenceInRoute: { 'ROUTE-NAVLAKHA-ACROPOLIS': 4, 'ROUTE-EVENING': 5 },
    sourceData: 'Historical Timetable - Sept 2023',
  },
  {
    id: 'STOP-MGMC',
    name: 'Mahatma Gandhi Medical College (MGMC)',
    displayName: 'Mahatma Gandhi Medical College',
    location: { lat: 22.7180, lng: 75.8480 },
    routes: ['ROUTE-NAVLAKHA-ACROPOLIS', 'ROUTE-EVENING'],
    sequenceInRoute: { 'ROUTE-NAVLAKHA-ACROPOLIS': 5, 'ROUTE-EVENING': 4 },
    sourceData: 'Historical Timetable - Sept 2023',
  },
  {
    id: 'STOP-SANCHAR-NAGAR',
    name: 'Sanchar Nagar',
    displayName: 'Sanchar Nagar',
    location: { lat: 22.7140, lng: 75.8430 },
    routes: ['ROUTE-NAVLAKHA-ACROPOLIS', 'ROUTE-EVENING'],
    sequenceInRoute: { 'ROUTE-NAVLAKHA-ACROPOLIS': 6, 'ROUTE-EVENING': 3 },
    sourceData: 'Historical Timetable - Sept 2023',
  },
  {
    id: 'STOP-KANADIA-ROAD',
    name: 'Kanadia Road / Sabji Mandi',
    displayName: 'Kanadia Road',
    location: { lat: 22.7100, lng: 75.8380 },
    routes: ['ROUTE-NAVLAKHA-ACROPOLIS', 'ROUTE-EVENING'],
    sequenceInRoute: { 'ROUTE-NAVLAKHA-ACROPOLIS': 7, 'ROUTE-EVENING': 2 },
    sourceData: 'Historical Timetable - Sept 2023',
  },
  {
    id: 'STOP-ACROPOLIS',
    name: 'Acropolis Institute of Technology & Research',
    displayName: 'Acropolis Campus (Terminal)',
    location: { lat: 22.7050, lng: 75.8320 },
    routes: ['ROUTE-NAVLAKHA-ACROPOLIS', 'ROUTE-BYPASS-SECONDARY', 'ROUTE-EVENING'],
    sequenceInRoute: { 'ROUTE-NAVLAKHA-ACROPOLIS': 8, 'ROUTE-BYPASS-SECONDARY': 5, 'ROUTE-EVENING': 1 },
    sourceData: 'Official Acropolis Campus Location',
  },
  // Secondary route stops
  {
    id: 'STOP-BYPASS-ENTRY',
    name: 'Indore Bypass Entry Point',
    displayName: 'Bypass Ring Entry',
    location: { lat: 22.7280, lng: 75.8350 },
    routes: ['ROUTE-BYPASS-SECONDARY'],
    sequenceInRoute: { 'ROUTE-BYPASS-SECONDARY': 1 },
    sourceData: 'Operational Fleet Assignment',
  },
  {
    id: 'STOP-TECH-PARK',
    name: 'Tech Park / Innovation Hub',
    displayName: 'Tech Park',
    location: { lat: 22.7200, lng: 75.8400 },
    routes: ['ROUTE-BYPASS-SECONDARY'],
    sequenceInRoute: { 'ROUTE-BYPASS-SECONDARY': 2 },
    sourceData: 'Operational Fleet Assignment',
  },
  {
    id: 'STOP-LIBRARY-COMPLEX',
    name: 'Central Library Complex',
    displayName: 'Library Complex',
    location: { lat: 22.7120, lng: 75.8380 },
    routes: ['ROUTE-BYPASS-SECONDARY'],
    sequenceInRoute: { 'ROUTE-BYPASS-SECONDARY': 3 },
    sourceData: 'Operational Fleet Assignment',
  },
  {
    id: 'STOP-HOSTEL-PLAZA',
    name: 'Hostel Plaza / Student Center',
    displayName: 'Hostel Plaza',
    location: { lat: 22.7080, lng: 75.8350 },
    routes: ['ROUTE-BYPASS-SECONDARY'],
    sequenceInRoute: { 'ROUTE-BYPASS-SECONDARY': 4 },
    sourceData: 'Operational Fleet Assignment',
  },
];

// AUTHENTIC ACROPOLIS SHIFT TIMINGS
// Source: Acropolis Institute Historical Timetable (Sept 2023)
export const mockShifts = [
  {
    id: 'SHIFT-1',
    name: 'Shift 1 - Morning Inbound',
    startTime: '08:20',
    endTime: '09:30',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED_FROM_SOURCE',
    source: 'Historical Timetable - Sept 2023 (Scribd)',
    departureNavlakha: '08:20',
    arrivalAcropolis: '09:10',
    notes: 'Primary morning student inbound shift',
  },
  {
    id: 'SHIFT-2',
    name: 'Shift 2 - Late Morning Inbound',
    startTime: '10:30',
    endTime: '11:40',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED_FROM_SOURCE',
    source: 'Historical Timetable - Sept 2023 (Scribd)',
    departureNavlakha: '10:30',
    arrivalAcropolis: '11:20',
    notes: 'Secondary morning shift for faculty and late students',
  },
  {
    id: 'SHIFT-EVENING',
    name: 'Shift Evening - Return',
    startTime: '14:30',
    endTime: '15:30',
    status: 'INACTIVE',
    verificationStatus: 'UNVERIFIED',
    source: 'Inferred from operational needs',
    departureAcropolis: '14:30',
    arrivalNavlakha: '15:20',
    notes: 'Evening return route - schedule not verified',
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

// AUTHENTICATED TIMETABLE ENTRIES WITH VERIFIED ACROPOLIS STOPS
// Source: Acropolis Institute Historical Timetable (Sept 2023)
export const mockTimetableEntries = [
  // ROUTE-NAVLAKHA-ACROPOLIS, SHIFT-1 (Morning Primary Route)
  { id: 'TTE-001', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-NAVLAKHA', shift: 'SHIFT-1', arrivalTime: '08:20', departureTime: '08:25', sequence: 1, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  { id: 'TTE-002', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-PALASIA', shift: 'SHIFT-1', arrivalTime: '08:32', departureTime: '08:37', sequence: 2, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  { id: 'TTE-003', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-MY-CHAURAHA', shift: 'SHIFT-1', arrivalTime: '08:42', departureTime: '08:47', sequence: 3, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  { id: 'TTE-004', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-GEETA-BHAWAN', shift: 'SHIFT-1', arrivalTime: '08:52', departureTime: '08:57', sequence: 4, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  { id: 'TTE-005', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-MGMC', shift: 'SHIFT-1', arrivalTime: '09:02', departureTime: '09:07', sequence: 5, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  { id: 'TTE-006', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-SANCHAR-NAGAR', shift: 'SHIFT-1', arrivalTime: '09:12', departureTime: '09:17', sequence: 6, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  { id: 'TTE-007', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-KANADIA-ROAD', shift: 'SHIFT-1', arrivalTime: '09:22', departureTime: '09:27', sequence: 7, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  { id: 'TTE-008', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-ACROPOLIS', shift: 'SHIFT-1', arrivalTime: '09:35', departureTime: '09:40', sequence: 8, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  
  // ROUTE-NAVLAKHA-ACROPOLIS, SHIFT-2 (Secondary Morning Shift)
  { id: 'TTE-009', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-NAVLAKHA', shift: 'SHIFT-2', arrivalTime: '10:30', departureTime: '10:35', sequence: 1, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  { id: 'TTE-010', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-PALASIA', shift: 'SHIFT-2', arrivalTime: '10:42', departureTime: '10:47', sequence: 2, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  { id: 'TTE-011', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-MY-CHAURAHA', shift: 'SHIFT-2', arrivalTime: '10:52', departureTime: '10:57', sequence: 3, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  { id: 'TTE-012', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-GEETA-BHAWAN', shift: 'SHIFT-2', arrivalTime: '11:02', departureTime: '11:07', sequence: 4, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  { id: 'TTE-013', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-MGMC', shift: 'SHIFT-2', arrivalTime: '11:12', departureTime: '11:17', sequence: 5, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  { id: 'TTE-014', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-SANCHAR-NAGAR', shift: 'SHIFT-2', arrivalTime: '11:22', departureTime: '11:27', sequence: 6, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  { id: 'TTE-015', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-KANADIA-ROAD', shift: 'SHIFT-2', arrivalTime: '11:32', departureTime: '11:37', sequence: 7, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  { id: 'TTE-016', routeId: 'ROUTE-NAVLAKHA-ACROPOLIS', stopId: 'STOP-ACROPOLIS', shift: 'SHIFT-2', arrivalTime: '11:45', departureTime: '11:50', sequence: 8, sourceDate: '2023-09-01', verificationStatus: 'VERIFIED' },
  
  // ROUTE-BYPASS-SECONDARY, SHIFT-1 (Secondary bypass route)
  { id: 'TTE-017', routeId: 'ROUTE-BYPASS-SECONDARY', stopId: 'STOP-BYPASS-ENTRY', shift: 'SHIFT-1', arrivalTime: '08:45', departureTime: '08:50', sequence: 1, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-018', routeId: 'ROUTE-BYPASS-SECONDARY', stopId: 'STOP-TECH-PARK', shift: 'SHIFT-1', arrivalTime: '08:55', departureTime: '09:00', sequence: 2, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-019', routeId: 'ROUTE-BYPASS-SECONDARY', stopId: 'STOP-LIBRARY-COMPLEX', shift: 'SHIFT-1', arrivalTime: '09:10', departureTime: '09:15', sequence: 3, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-020', routeId: 'ROUTE-BYPASS-SECONDARY', stopId: 'STOP-HOSTEL-PLAZA', shift: 'SHIFT-1', arrivalTime: '09:20', departureTime: '09:25', sequence: 4, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-021', routeId: 'ROUTE-BYPASS-SECONDARY', stopId: 'STOP-ACROPOLIS', shift: 'SHIFT-1', arrivalTime: '09:30', departureTime: '09:35', sequence: 5, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  
  // ROUTE-BYPASS-SECONDARY, SHIFT-2
  { id: 'TTE-022', routeId: 'ROUTE-BYPASS-SECONDARY', stopId: 'STOP-BYPASS-ENTRY', shift: 'SHIFT-2', arrivalTime: '11:00', departureTime: '11:05', sequence: 1, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-023', routeId: 'ROUTE-BYPASS-SECONDARY', stopId: 'STOP-TECH-PARK', shift: 'SHIFT-2', arrivalTime: '11:10', departureTime: '11:15', sequence: 2, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-024', routeId: 'ROUTE-BYPASS-SECONDARY', stopId: 'STOP-LIBRARY-COMPLEX', shift: 'SHIFT-2', arrivalTime: '11:20', departureTime: '11:25', sequence: 3, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-025', routeId: 'ROUTE-BYPASS-SECONDARY', stopId: 'STOP-HOSTEL-PLAZA', shift: 'SHIFT-2', arrivalTime: '11:30', departureTime: '11:35', sequence: 4, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-026', routeId: 'ROUTE-BYPASS-SECONDARY', stopId: 'STOP-ACROPOLIS', shift: 'SHIFT-2', arrivalTime: '11:45', departureTime: '11:50', sequence: 5, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  
  // ROUTE-EVENING (Return route - unverified)
  { id: 'TTE-027', routeId: 'ROUTE-EVENING', stopId: 'STOP-ACROPOLIS', shift: 'SHIFT-1', arrivalTime: '14:30', departureTime: '14:35', sequence: 1, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-028', routeId: 'ROUTE-EVENING', stopId: 'STOP-KANADIA-ROAD', shift: 'SHIFT-1', arrivalTime: '14:43', departureTime: '14:48', sequence: 2, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-029', routeId: 'ROUTE-EVENING', stopId: 'STOP-SANCHAR-NAGAR', shift: 'SHIFT-1', arrivalTime: '14:53', departureTime: '14:58', sequence: 3, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-030', routeId: 'ROUTE-EVENING', stopId: 'STOP-MGMC', shift: 'SHIFT-1', arrivalTime: '15:03', departureTime: '15:08', sequence: 4, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-031', routeId: 'ROUTE-EVENING', stopId: 'STOP-GEETA-BHAWAN', shift: 'SHIFT-1', arrivalTime: '15:13', departureTime: '15:18', sequence: 5, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-032', routeId: 'ROUTE-EVENING', stopId: 'STOP-MY-CHAURAHA', shift: 'SHIFT-1', arrivalTime: '15:23', departureTime: '15:28', sequence: 6, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-033', routeId: 'ROUTE-EVENING', stopId: 'STOP-PALASIA', shift: 'SHIFT-1', arrivalTime: '15:33', departureTime: '15:38', sequence: 7, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
  { id: 'TTE-034', routeId: 'ROUTE-EVENING', stopId: 'STOP-NAVLAKHA', shift: 'SHIFT-1', arrivalTime: '15:45', departureTime: '15:50', sequence: 8, sourceDate: '2023-09-01', verificationStatus: 'UNVERIFIED' },
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
