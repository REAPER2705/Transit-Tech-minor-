import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Bus from '../src/models/Bus.js';
import Stop from '../src/models/Stop.js';
import Route from '../src/models/Route.js';
import ShiftSchedule from '../src/models/ShiftSchedule.js';
import AuditLog from '../src/models/AuditLog.js';

// Acropolis campus location: Bypass Road, Manglia Square, Manglia, Indore
// Source: https://www.scribd.com/document/703073096/BusRoute-Sep23-1
// Source Date: 1 September 2023
// Verification Status: Unverified (demo/historical data)

const SOURCE_URL = 'https://www.scribd.com/document/703073096/BusRoute-Sep23-1';
const SOURCE_DATE = new Date('2023-09-01');

// Known Acropolis stops with approximate Indore city coordinates
// Coordinates are approximate and not field-verified
const acropolicStops = [
  {
    stopCode: 'NAVLAKHA',
    name: 'Navlakha Bus Stand',
    coordinates: [75.8333, 23.1800], // approx
  },
  {
    stopCode: 'GPO_CHOURAHA',
    name: 'GPO Chouraha Petrol Pump',
    coordinates: [75.8367, 23.1808],
  },
  {
    stopCode: 'JAORA_COMPOUND',
    name: 'Jaora Compound (BJP Office)',
    coordinates: [75.8392, 23.1823],
  },
  {
    stopCode: 'MY_CHAURAHA',
    name: 'M.Y. Chauraha',
    coordinates: [75.8408, 23.1842],
  },
  {
    stopCode: 'ST_PAUL_SCHOOL',
    name: 'St. Paul School',
    coordinates: [75.8433, 23.1867],
  },
  {
    stopCode: 'SHIVAJI_VATIKA',
    name: 'Shivaji Vatika',
    coordinates: [75.8458, 23.1883],
  },
  {
    stopCode: 'GEETA_BHAWAN',
    name: 'Geeta Bhawan Chouraha',
    coordinates: [75.8483, 23.1908],
  },
  {
    stopCode: 'PALASIA',
    name: 'Palasia Chouraha',
    coordinates: [75.8508, 23.1925],
  },
  {
    stopCode: 'BENGALI_CHOURAHA',
    name: 'Bengali Chouraha',
    coordinates: [75.8533, 23.1950],
  },
  {
    stopCode: 'VAIBHAV_NAGAR',
    name: 'Vaibhav Nagar Chouraha',
    coordinates: [75.8558, 23.1967],
  },
  {
    stopCode: 'SANCHAR_NAGAR',
    name: 'Sanchar Nagar',
    coordinates: [75.8583, 23.1992],
  },
  {
    stopCode: 'MANAVTA_NAGAR',
    name: 'Manavta Nagar Chouraha',
    coordinates: [75.8608, 23.2017],
  },
  {
    stopCode: 'KANADIYA_BYPASS',
    name: 'Kanadiya Bypass',
    coordinates: [75.8633, 23.2042],
  },
  {
    stopCode: 'JHALARIYA',
    name: 'Jhalariya Village',
    coordinates: [75.8658, 23.2067],
  },
  {
    stopCode: 'ACROPOLIS',
    name: 'Acropolis Institutes',
    coordinates: [75.8683, 23.2092], // Bypass Road, Manglia Square
  },
];

// Buses: G-50, G-42, G-17 with first and second shift schedules
// First shift: 8:30 AM - 2:40 PM
// Second shift: 10:30 AM - 5:00 PM
const acropolicBuses = [
  {
    busCode: 'G-50',
    registrationNumber: 'MP-09-AB-5000',
    capacity: 48,
  },
  {
    busCode: 'G-42',
    registrationNumber: 'MP-09-AB-4200',
    capacity: 48,
  },
  {
    busCode: 'G-17',
    registrationNumber: 'MP-09-AB-1700',
    capacity: 48,
  },
];

// Route configuration with timetables
// Each bus has two routes per day (Shift 1 and Shift 2)
const routeConfigurations = [
  {
    busCode: 'G-50',
    routeCode: 'ACRO-G50-S1',
    name: 'G-50 Route (Shift 1)',
    direction: 'inbound',
    shiftCode: 'SHIFT_1',
    startTime: '08:30',
    endTime: '14:40',
    // Shift 1 timings for each stop
    stopTimings: {
      NAVLAKHA: '08:30',
      GPO_CHOURAHA: '08:38',
      JAORA_COMPOUND: '08:46',
      MY_CHAURAHA: '08:54',
      ST_PAUL_SCHOOL: '09:02',
      SHIVAJI_VATIKA: '09:10',
      GEETA_BHAWAN: '09:18',
      PALASIA: '09:26',
      BENGALI_CHOURAHA: '09:34',
      VAIBHAV_NAGAR: '09:42',
      SANCHAR_NAGAR: '09:50',
      MANAVTA_NAGAR: '09:58',
      KANADIYA_BYPASS: '10:06',
      JHALARIYA: '10:14',
      ACROPOLIS: '10:22',
    },
  },
  {
    busCode: 'G-50',
    routeCode: 'ACRO-G50-S2',
    name: 'G-50 Route (Shift 2)',
    direction: 'inbound',
    shiftCode: 'SHIFT_2',
    startTime: '10:30',
    endTime: '17:00',
    // Shift 2 timings
    stopTimings: {
      NAVLAKHA: '10:30',
      GPO_CHOURAHA: '10:38',
      JAORA_COMPOUND: '10:46',
      MY_CHAURAHA: '10:54',
      ST_PAUL_SCHOOL: '11:02',
      SHIVAJI_VATIKA: '11:10',
      GEETA_BHAWAN: '11:18',
      PALASIA: '11:26',
      BENGALI_CHOURAHA: '11:34',
      VAIBHAV_NAGAR: '11:42',
      SANCHAR_NAGAR: '11:50',
      MANAVTA_NAGAR: '11:58',
      KANADIYA_BYPASS: '12:06',
      JHALARIYA: '12:14',
      ACROPOLIS: '12:22',
    },
  },
  {
    busCode: 'G-42',
    routeCode: 'ACRO-G42-S1',
    name: 'G-42 Route (Shift 1)',
    direction: 'inbound',
    shiftCode: 'SHIFT_1',
    startTime: '08:30',
    endTime: '14:40',
    stopTimings: {
      NAVLAKHA: '08:35',
      GPO_CHOURAHA: '08:43',
      JAORA_COMPOUND: '08:51',
      MY_CHAURAHA: '08:59',
      ST_PAUL_SCHOOL: '09:07',
      SHIVAJI_VATIKA: '09:15',
      GEETA_BHAWAN: '09:23',
      PALASIA: '09:31',
      BENGALI_CHOURAHA: '09:39',
      VAIBHAV_NAGAR: '09:47',
      SANCHAR_NAGAR: '09:55',
      MANAVTA_NAGAR: '10:03',
      KANADIYA_BYPASS: '10:11',
      JHALARIYA: '10:19',
      ACROPOLIS: '10:27',
    },
  },
  {
    busCode: 'G-42',
    routeCode: 'ACRO-G42-S2',
    name: 'G-42 Route (Shift 2)',
    direction: 'inbound',
    shiftCode: 'SHIFT_2',
    startTime: '10:30',
    endTime: '17:00',
    stopTimings: {
      NAVLAKHA: '10:35',
      GPO_CHOURAHA: '10:43',
      JAORA_COMPOUND: '10:51',
      MY_CHAURAHA: '10:59',
      ST_PAUL_SCHOOL: '11:07',
      SHIVAJI_VATIKA: '11:15',
      GEETA_BHAWAN: '11:23',
      PALASIA: '11:31',
      BENGALI_CHOURAHA: '11:39',
      VAIBHAV_NAGAR: '11:47',
      SANCHAR_NAGAR: '11:55',
      MANAVTA_NAGAR: '12:03',
      KANADIYA_BYPASS: '12:11',
      JHALARIYA: '12:19',
      ACROPOLIS: '12:27',
    },
  },
  {
    busCode: 'G-17',
    routeCode: 'ACRO-G17-S1',
    name: 'G-17 Route (Shift 1)',
    direction: 'inbound',
    shiftCode: 'SHIFT_1',
    startTime: '08:30',
    endTime: '14:40',
    stopTimings: {
      NAVLAKHA: '08:40',
      GPO_CHOURAHA: '08:48',
      JAORA_COMPOUND: '08:56',
      MY_CHAURAHA: '09:04',
      ST_PAUL_SCHOOL: '09:12',
      SHIVAJI_VATIKA: '09:20',
      GEETA_BHAWAN: '09:28',
      PALASIA: '09:36',
      BENGALI_CHOURAHA: '09:44',
      VAIBHAV_NAGAR: '09:52',
      SANCHAR_NAGAR: '10:00',
      MANAVTA_NAGAR: '10:08',
      KANADIYA_BYPASS: '10:16',
      JHALARIYA: '10:24',
      ACROPOLIS: '10:32',
    },
  },
  {
    busCode: 'G-17',
    routeCode: 'ACRO-G17-S2',
    name: 'G-17 Route (Shift 2)',
    direction: 'inbound',
    shiftCode: 'SHIFT_2',
    startTime: '10:30',
    endTime: '17:00',
    stopTimings: {
      NAVLAKHA: '10:40',
      GPO_CHOURAHA: '10:48',
      JAORA_COMPOUND: '10:56',
      MY_CHAURAHA: '11:04',
      ST_PAUL_SCHOOL: '11:12',
      SHIVAJI_VATIKA: '11:20',
      GEETA_BHAWAN: '11:28',
      PALASIA: '11:36',
      BENGALI_CHOURAHA: '11:44',
      VAIBHAV_NAGAR: '11:52',
      SANCHAR_NAGAR: '12:00',
      MANAVTA_NAGAR: '12:08',
      KANADIYA_BYPASS: '12:16',
      JHALARIYA: '12:24',
      ACROPOLIS: '12:32',
    },
  },
];

async function seedAcropolicData() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/transit-tech';
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Get or create system admin user for audit logs
    let adminUser = await User.findOne({ email: 'system@transit.local' });
    if (!adminUser) {
      adminUser = await User.create({
        email: 'system@transit.local',
        displayName: 'System',
        passwordHash: 'system',
        roles: ['admin'],
      });
    }

    // Create stops
    console.log('\n📍 Creating stops...');
    const createdStops = {};
    for (const stopData of acropolicStops) {
      let stop = await Stop.findOne({ stopCode: stopData.stopCode });
      if (!stop) {
        stop = await Stop.create({
          stopCode: stopData.stopCode,
          name: stopData.name,
          location: {
            type: 'Point',
            coordinates: stopData.coordinates,
          },
          coordinatesVerified: false,
          sourceUrl: SOURCE_URL,
          sourceDate: SOURCE_DATE,
          verificationStatus: 'unverified',
        });
        await AuditLog.create({
          actorId: adminUser._id,
          action: 'create',
          entityType: 'Stop',
          entityId: stop._id,
          after: {
            stopCode: stop.stopCode,
            name: stop.name,
            source: SOURCE_URL,
            sourceDate: SOURCE_DATE.toISOString(),
          },
        });
      }
      createdStops[stopData.stopCode] = stop._id;
      console.log(`  • ${stopData.name}`);
    }

    // Create buses
    console.log('\n🚌 Creating buses...');
    const createdBuses = {};
    for (const busData of acropolicBuses) {
      let bus = await Bus.findOne({ busCode: busData.busCode });
      if (!bus) {
        bus = await Bus.create({
          busCode: busData.busCode,
          registrationNumber: busData.registrationNumber,
          capacity: busData.capacity,
          sourceUrl: SOURCE_URL,
          sourceDate: SOURCE_DATE,
          verificationStatus: 'unverified',
        });
        await AuditLog.create({
          actorId: adminUser._id,
          action: 'create',
          entityType: 'Bus',
          entityId: bus._id,
          after: {
            busCode: bus.busCode,
            source: SOURCE_URL,
            sourceDate: SOURCE_DATE.toISOString(),
          },
        });
      }
      createdBuses[busData.busCode] = bus._id;
      console.log(`  • ${busData.busCode} (${busData.capacity} capacity)`);
    }

    // Create routes with schedules
    console.log('\n📋 Creating routes and schedules...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const routeConfig of routeConfigurations) {
      let route = await Route.findOne({ routeCode: routeConfig.routeCode });
      if (!route) {
        const stopIds = acropolicStops.map(s => createdStops[s.stopCode]);
        route = await Route.create({
          routeCode: routeConfig.routeCode,
          name: routeConfig.name,
          direction: routeConfig.direction,
          stopIds: stopIds,
          sourceUrl: SOURCE_URL,
          sourceDate: SOURCE_DATE,
          verificationStatus: 'unverified',
        });
        await AuditLog.create({
          actorId: adminUser._id,
          action: 'create',
          entityType: 'Route',
          entityId: route._id,
          after: {
            routeCode: route.routeCode,
            name: route.name,
            source: SOURCE_URL,
            sourceDate: SOURCE_DATE.toISOString(),
          },
        });
      }

      // Create schedule
      let schedule = await ShiftSchedule.findOne({ scheduleCode: `${routeConfig.routeCode}-${today.toISOString().split('T')[0]}` });
      if (!schedule) {
        schedule = await ShiftSchedule.create({
          scheduleCode: `${routeConfig.routeCode}-${today.toISOString().split('T')[0]}`,
          shiftCode: routeConfig.shiftCode,
          startTimeLocal: routeConfig.startTime,
          endTimeLocal: routeConfig.endTime,
          serviceDate: today,
          routeId: route._id,
          busId: createdBuses[routeConfig.busCode],
          driverId: adminUser._id,
          conductorId: adminUser._id,
          status: 'scheduled',
        });
        await AuditLog.create({
          actorId: adminUser._id,
          action: 'create',
          entityType: 'ShiftSchedule',
          entityId: schedule._id,
          after: {
            scheduleCode: schedule.scheduleCode,
            shiftCode: routeConfig.shiftCode,
            busCode: routeConfig.busCode,
            source: SOURCE_URL,
            sourceDate: SOURCE_DATE.toISOString(),
          },
        });
      }

      console.log(`  • ${routeConfig.name} (${routeConfig.shiftCode})`);
    }

    console.log('\n✓ Acropolis data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`  • ${Object.keys(createdStops).length} stops created`);
    console.log(`  • ${Object.keys(createdBuses).length} buses created`);
    console.log(`  • ${routeConfigurations.length} route/schedule pairs created`);
    console.log('\n📌 Data Source:');
    console.log(`  • URL: ${SOURCE_URL}`);
    console.log(`  • Date: ${SOURCE_DATE.toISOString().split('T')[0]}`);
    console.log(`  • Status: Unverified (demo/historical data)`);
    console.log('\n⚠️  Important:');
    console.log('  This is historical timetable data dated 1 September 2023.');
    console.log('  Current timings and availability are unverified.');
    console.log('  Always verify with the transport office for current schedules.');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding Acropolis data:', error);
    process.exit(1);
  }
}

seedAcropolicData();
