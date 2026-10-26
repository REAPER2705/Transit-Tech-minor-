# TransitTech - Smart Campus Transit & Fleet Management System

**Frontend-only implementation** of a comprehensive campus bus tracking and fleet management platform for Acropolis Institute of Technology & Research (AITR), Indore.

## 🎯 Project Overview

TransitTech provides real-time campus bus tracking, route management, and operational oversight through three specialized portals:

- **Passenger Portal**: Track assigned buses, view routes, check occupancy, submit requests
- **Transport Staff Portal**: Manage trips, update occupancy, share GPS location
- **Admin Portal**: Manage fleet, routes, schedules, staff assignments, and data imports

## 🚀 Quick Start

### Installation

```bash
cd client
npm install
```

### Development

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Build

```bash
npm run build
```

## 📁 Project Structure

```
client/
├── src/
│   ├── App.jsx                          # Main application component
│   ├── main.jsx                         # React entry point
│   ├── components/
│   │   └── common/
│   │       ├── Header.jsx               # Global header with role switching
│   │       └── BusTrackingMap.jsx       # Leaflet-based interactive map
│   ├── portals/
│   │   ├── PassengerPortalComplete.jsx  # Passenger interface
│   │   ├── StaffPortalComplete.jsx      # Staff interface
│   │   └── AdminPortalComplete.jsx      # Admin interface
│   ├── pages/
│   │   └── LandingPage.jsx              # Public landing page
│   ├── store/
│   │   ├── appStore.js                  # Zustand state management
│   │   ├── mockData.js                  # Demo data for all entities
│   │   └── authStore.js                 # Authentication state
│   ├── utils/
│   │   ├── csvImport.js                 # CSV parsing and validation
│   │   └── api.js                       # API service layer
│   └── styles/
│       └── index.css                    # Global Tailwind CSS
├── vite.config.js                       # Vite configuration
├── tailwind.config.js                   # Tailwind CSS config
└── package.json
```

## 🎨 Design System

Built on **Tailwind CSS** with a premium, light theme:

- **Color Palette**: White/ivory backgrounds, deep navy text, blue accents
- **Typography**: Plus Jakarta Sans font family
- **Components**: Rounded cards, glassmorphism panels, smooth transitions
- **Responsive**: Mobile-first design, works on desktop/tablet/mobile

## 📊 Core Features

### Passenger Portal

- ✅ Live bus tracking with Leaflet map
- ✅ Real-time occupancy and seat availability
- ✅ Route browsing and schedule information
- ✅ Stop change requests
- ✅ Complaint submission and tracking
- ✅ Alternative bus recommendations
- ✅ Timetable advisory notices

### Transport Staff Portal

- ✅ Trip management (start/end)
- ✅ Occupancy updates with validation
- ✅ GPS sharing controls
- ✅ Alternative bus information
- ✅ Issue reporting
- ✅ Trip history

### Admin Portal

- ✅ Bus fleet management (CRUD)
- ✅ Route configuration
- ✅ Stop management
- ✅ Passenger assignment tracking
- ✅ Staff assignment management
- ✅ Request review and approval/rejection
- ✅ Complaint management
- ✅ CSV/Excel data imports (shift-isolated)
- ✅ Data exports
- ✅ Shift 1 & Shift 2 separation

## 🗺️ Map Integration

**Leaflet + OpenStreetMap** providing:

- Light, clean map tiles
- Yellow campus bus markers
- Interactive stop/route visualization
- Zoom and pan controls
- Real-time GPS telemetry display

## 💾 Data Management

### Demo Data

All data is local, frontend-only:

- **Buses**: G-47, G-39, G-34, G-41 (configurable)
- **Routes**: ROUTE-01, ROUTE-02 (configurable)
- **Stops**: 5 campus stops with coordinates
- **Shifts**: Shift 1 (08:20-14:40), Shift 2 (10:30-17:00)
- **Timetable**: July 2015 source marked "Needs Verification"

### State Managementt

**Zustand** store maintains:

- Bus locations and occupancy
- Route and stop data
- User assignments
- Requests and complaints
- Notifications

Updates are **immediately reflected** across all portals during the demo session.

### CSV Import (Demo)

The admin portal supports importing:

- **Buses**: Bus ID, Capacity, Status
- **Routes**: Route ID, Name, Distance, Duration
- **Timetables**: Route ID, Departure Time (shift-isolated)
- **Staff**: Staff ID, Name, Role, Bus ID, Shift

**Validation** includes:
- Required field checks
- Numeric validation
- Shift isolation (Shift 1 ≠ Shift 2)
- Duplicate detection
- Row-level error reporting

## 🔐 Authentication & Authorization

**Frontend-only demo** with role-based UI:

- No real authentication required
- Role selector in header
- Available roles:
  - Passenger (Shift 1)
  - Transport Officer (Driver)
  - Fleet Conductor
  - Admin Desk

**Note**: Real authentication should be added in production backend.

## 📱 Responsive Design

- **Desktop**: Full-featured interface with sidebars and complex layouts
- **Tablet**: Adapted grids, collapsible navigation
- **Mobile**: Stacked cards, touch-friendly buttons, simplified navigation

## 🛠️ Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **State**: Zustand 4
- **Mapping**: Leaflet 1.9 + OpenStreetMap
- **Routing**: React Router DOM 6
- **HTTP**: Axios (for future API integration)

## 📋 API Integration Points

Ready for backend connection via these service methods (in `appStore.js`):

- `updateBusOccupancy()` → `/api/buses/:id/occupancy`
- `startTrip()` / `endTrip()` → `/api/trips`
- `addRequest()` / `updateRequestStatus()` → `/api/requests`
- `addComplaint()` / `updateComplaintStatus()` → `/api/complaints`
- `updateBus()` / `addBus()` → `/api/buses`
- `updateRoute()` / `addRoute()` → `/api/routes`

## 🎯 Known Limitations (Frontend-Only)

- ❌ No real GPS integration (uses mock data)
- ❌ No live push notifications (demo state only)
- ❌ No real authentication/authorization backend
- ❌ No persistent database (data resets on page refresh)
- ❌ No real email/SMS for requests/complaints
- ❌ No occupancy sensor integration
- ❌ CSV imports are local preview only

**All marked as "Demo" in the UI.**

## 📝 Demo Workflow

1. **Start**: Enter Passenger Portal from header or landing page
2. **Track**: View your assigned bus (G-47) on the map
3. **Check**: See live occupancy, ETA, and alternative buses
4. **Request**: Submit a stop change or complaint (local state updated)
5. **Switch**: Use role selector to enter Staff or Admin portals
6. **Manage**: View or update trip status, occupancy, bus records

All changes persist during the session.

## 🧪 Testing

Recommended test flows:

1. **Passenger Flow**: Track bus → view routes → submit request → submit complaint
2. **Staff Flow**: Start trip → update occupancy → enable GPS → view history
3. **Admin Flow**: Add bus → add route → review requests → import data
4. **Role Switching**: Change role and verify UI/data consistency

## 🔄 Future Integration

When connecting to a backend:

1. Replace `mockData.js` with real API calls via Axios
2. Update `appStore.js` actions to call backend endpoints
3. Implement real authentication/JWT
4. Connect Leaflet to real GPS streaming service
5. Add WebSocket for real-time occupancy/GPS updates
6. Implement file upload for CSV/Excel imports

## 📄 License

Educational project for Acropolis Institute of Technology & Research

## 🎓 Credits

- **Design Reference**: Stitch design mockups
- **Framework**: React + Vite
- **Maps**: Leaflet + OpenStreetMap contributors
- **UI**: Tailwind CSS

## 📞 Support

For questions or issues:

1. Check the `01_PRODUCT_REQUIREMENTS.md` for feature specifications
2. Review `02_SYSTEM_ARCHITECTURE.md` for technical design
3. See `03_DATA_MODEL_AND_API_CONTRACT.md` for data structures

---

**Status**: Frontend implementation complete ✅
**Ready for**: Backend integration, production deployment
**Last Updated**: 2025
