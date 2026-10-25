import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Bus from '../src/models/Bus.js';
import Stop from '../src/models/Stop.js';
import Route from '../src/models/Route.js';
import ShiftSchedule from '../src/models/ShiftSchedule.js';
import PassengerAssignment from '../src/models/PassengerAssignment.js';
import Trip from '../src/models/Trip.js';

const demoUsers = [
  {
    email: 'passenger@transit.local',
    displayName: 'Priya Sharma',
    passwordHash: 'demo123',
    roles: ['passenger'],
    passengerType: 'student',
  },
  {
    email: 'staff@transit.local',
    displayName: 'Rajesh Kumar',
    passwordHash: 'demo123',
    roles: ['driver', 'conductor'],
  },
  {
    email: 'admin@transit.local',
    displayName: 'Admin User',
    passwordHash: 'demo123',
    roles: ['admin'],
  },
];

const demoBuses = [
  {
    busCode: 'G-47',
    registrationNumber: 'MP-09-AB-4700',
    capacity: 50,
    capacityType: 'total_passengers',
  },
  {
    busCode: 'G-39',
    registrationNumber: 'MP-09-AB-3900',
    capacity: 50,
    capacityType: 'total_passengers',
  },
  {
    busCode: 'G-34',
    registrationNumber: 'MP-09-AB-3400',
    capacity: 42,
    capacityType: 'total_passengers',
  },
];

const demoStops = [
  {
    stopCode: 'PALASIA',
    name: 'Palasia Square',
    location: {
      type: 'Point',
      coordinates: [75.8483, 23.1815],
    },
  },
  {
    stopCode: 'TRIBUNAL',
    name: 'Tribunal Square',
    location: {
      type: 'Point',
      coordinates: [75.8508, 23.1842],
    },
  },
  {
    stopCode: 'LIBRARY',
    name: 'Central Library',
    location: {
      type: 'Point',
      coordinates: [75.8531, 23.1898],
    },
  },
  {
    stopCode: 'AITR',
    name: 'AITR Campus',
    location: {
      type: 'Point',
      coordinates: [75.8654, 23.1942],
    },
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/transit-tech';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Bus.deleteMany({}),
      Stop.deleteMany({}),
      Route.deleteMany({}),
      ShiftSchedule.deleteMany({}),
      PassengerAssignment.deleteMany({}),
      Trip.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.insertMany(demoUsers);
    console.log('Created users:', createdUsers.map(u => u.email));

    // Create buses
    const createdBuses = await Bus.insertMany(demoBuses);
    console.log('Created buses:', createdBuses.map(b => b.busCode));

    // Create stops
    const createdStops = await Stop.insertMany(demoStops);
    console.log('Created stops:', createdStops.map(s => s.stopCode));

    // Create route
    const route = await Route.create({
      routeCode: 'RT-47',
      name: 'Palasia Square → AITR Campus',
      stopIds: createdStops.map(s => s._id),
      direction: 'inbound',
    });
    console.log('Created route:', route.routeCode);

    // Create schedules and trips
    const [passenger, staff, admin] = createdUsers;
    const [bus1, bus2, bus3] = createdBuses;
    const [stop1, stop2, stop3, stop4] = createdStops;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const schedule = await ShiftSchedule.create({
      scheduleCode: 'SCHED-001',
      shiftCode: 'SHIFT_1',
      startTimeLocal: '08:20',
      endTimeLocal: '14:40',
      serviceDate: today,
      routeId: route._id,
      busId: bus1._id,
      driverId: staff._id,
      conductorId: staff._id,
    });
    console.log('Created schedule:', schedule.scheduleCode);

    // Create trip
    const trip = await Trip.create({
      tripCode: 'TRIP-001',
      scheduleId: schedule._id,
      busId: bus1._id,
      routeId: route._id,
      driverId: staff._id,
      conductorId: staff._id,
      status: 'scheduled',
    });
    console.log('Created trip:', trip.tripCode);

    // Create passenger assignment
    const assignment = await PassengerAssignment.create({
      assignmentCode: 'ASSIGN-001',
      passengerId: passenger._id,
      scheduleId: schedule._id,
      routeId: route._id,
      busId: bus1._id,
      boardingStopId: stop1._id,
      status: 'approved',
      createdBy: admin._id,
    });
    console.log('Created assignment:', assignment.assignmentCode);

    console.log('\n✓ Database seeded successfully!');
    console.log('\nDemo Login Credentials:');
    console.log('  Passenger: passenger@transit.local / demo123');
    console.log('  Staff: staff@transit.local / demo123');
    console.log('  Admin: admin@transit.local / demo123');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
