# TransitTech Frontend - Complete Implementation

A complete, fully functional frontend for the TransitTech smart campus transport management system. This is a **frontend-only application** with mock data—no backend server required to run.

## Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Installation & Running

```bash
# Navigate to client directory
cd client

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Access:** http://localhost:5173/

### Demo Logins
At the login screen, select your role:
- **Passenger Portal** - View buses, live tracking, submit complaints
- **Transport Staff Portal** - Start trips, manage occupancy, submit reports
- **Admin Portal** - Manage users, buses, routes, schedules, and imports

## Feature Overview

### 🚌 Passenger Portal
- **Live Tracking Map** - Interactive Leaflet map with real-time bus location
- **Bus Availability** - View seat status, alternative buses, request transfers
- **Complaints** - Submit and track complaints with admin responses
- **Notifications** - Real-time alerts (bus full, assignments approved, etc.)

### 👨‍💼 Transport Staff Portal
- **Trip Control (Driver)** - Start/end trips with GPS-enabled tracking
- **Occupancy Management (Conductor)** - Update passenger count with full/capacity detection
- **Operational Reports** - Submit route obstruction, vehicle, and GPS issues

### ⚙️ Admin Portal
- **User Management** - Create users with assigned roles
- **Bus Management** - Create and manage bus fleet with capacity
- **Route Management** - View and configure routes with stops
- **Schedule Management** - Shift-based schedule creation and management
- **Assignment Management** - Assign passengers to buses and routes
- **Data Import** - Upload Excel/CSV with validation and error reporting
- **Complaint Management** - Review and respond to passenger complaints
- **Audit Logs** - Track all admin actions with timestamps

## Design Features

✨ **Glassmorphism UI** - Modern frosted glass effect containers  
📱 **Fully Responsive** - Works on mobile, tablet, and desktop  
🎨 **Tailwind CSS** - Clean, consistent styling throughout  
🗺️ **Interactive Maps** - Leaflet/OpenStreetMap integration  
⚡ **Smooth Animations** - Transitions and responsive feedback  
♿ **Accessible** - Semantic HTML, keyboard navigation support

## Technology Stack

- **React 18** - UI library
- **React Router** - Client-side routing
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Leaflet** - Interactive maps
- **Zustand** - Lightweight state management
- **Mock Data** - Frontend-only data (no backend needed)

## Project Structure

```
client/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── passenger/
│   │   ├── staff/
│   │   ├── admin/
│   │   └── portals/
│   ├── store/
│   │   ├── mockData.js        # All demo data
│   │   ├── authStore.js       # Auth state
│   │   └── realtimeStore.js   # Real-time events
│   ├── utils/
│   │   └── api.js             # Ready for backend
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── styles/
│   │   └── index.css
│   └── App.jsx
└── public/
```

## Building for Production

```bash
npm run build
```

Output: `dist/` directory with optimized production build (~377 KB JS, 25 KB CSS)

```bash
npm run preview
```

Preview the production build locally.

## Mock Data

All data is provided by `src/store/mockData.js`:
- **Users:** Passenger, Staff, Admin accounts
- **Buses:** G-47, G-39, G-34 (realistic capacities)
- **Routes:** Palasia Square ↔ AITR Campus
- **Stops:** 4 major transit stops
- **Occupancy:** 38/50 seats (real-time simulation)
- **Complaints:** Real examples with responses
- **Schedules:** Shift 1 & Shift 2

## Backend Integration Ready

The frontend is structured for easy backend integration:

1. **API Layer** - `src/utils/api.js` has clean integration points
2. **State Management** - Zustand stores can be replaced with API calls
3. **Authentication** - Role-based access control ready
4. **Data Flow** - Component structure supports real backend data

Simply replace mock data calls with actual API endpoints—no UI changes needed.

## Responsive Design

| Breakpoint | Size | Layout |
|-----------|------|--------|
| Mobile | < 640px | Single column, optimized touch targets |
| Tablet | 640-1024px | Two column where appropriate |
| Desktop | > 1024px | Full multi-column layouts |

Maps, tables, and forms are fully responsive.

## Accessibility

- ✅ Semantic HTML throughout
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Color contrast compliance
- ✅ Form validation messages

## Known Limitations (Frontend-Only)

- ❌ No real GPS data (mock location only)
- ❌ No real-time backend updates (simulated)
- ❌ Data persists only in session (localStorage backup)
- ❌ No actual file uploads (import flow is UI mockup)
- ❌ No email notifications (UI ready, needs backend)

## Future Enhancements

- [ ] Connect to backend API
- [ ] Real WebSocket/Socket.IO for live updates
- [ ] Actual file upload and import processing
- [ ] Push notifications
- [ ] Offline mode with service workers
- [ ] Advanced analytics dashboard
- [ ] Mobile-specific optimizations

## Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

### Blank page or 404 on routes
- Clear browser cache
- Reload page with `Ctrl+Shift+R` (hard refresh)
- Check browser console for errors

### Styles not loading
- Restart dev server
- Verify Tailwind CSS build

## Support & Questions

For frontend-related issues:
1. Check browser DevTools console for errors
2. Verify all dependencies installed: `npm install`
3. Try clearing node_modules and reinstalling

## License

© 2025 AITR Campus Transit. All rights reserved.

---

**Last Updated:** October 24, 2025  
**Version:** 1.0 Frontend Complete  
**Status:** Production Ready for Backend Integration
