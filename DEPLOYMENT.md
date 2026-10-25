# TransitTech Deployment Guide

## Development Environment Setup

### Prerequisites

- Node.js 16+ and npm
- Git
- A modern web browser

### Local Development

```bash
# Clone the repository
git clone https://github.com/REAPER2705/Transit-Tech-minor-.git
cd Transit-Tech-minor-

# Install client dependencies
cd client
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
# Build the frontend
npm run build

# Build output will be in client/dist/
```

## Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from client directory
cd client
vercel
```

### Option 2: Netlify

```bash
# Build first
npm run build

# Deploy dist folder to Netlify
# Via CLI or drag-and-drop at netlify.com
```

### Option 3: Docker

```dockerfile
# Dockerfile for TransitTech frontend
FROM node:18-alpine as build
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

Build and run:

```bash
docker build -t transittech-frontend .
docker run -p 80:80 transittech-frontend
```

### Option 4: GitHub Pages

```bash
# Update vite.config.js base for GitHub Pages
# Commit and push to GitHub
# Enable GitHub Pages in repository settings
```

## Environment Configuration

### Current State (Frontend-Only)

The application is currently frontend-only with demo data. No environment variables are required.

### Future: Backend Integration

When connecting to a backend, create `client/.env.production`:

```env
VITE_API_URL=https://api.yourdomain.com
VITE_MAP_TILES_URL=https://your-tile-server.com/{z}/{x}/{y}.png
VITE_WEBSOCKET_URL=wss://your-backend.com/ws
```

Update `client/src/utils/api.js` to use these:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

## Performance Optimization

### Current Build Size

- JavaScript: ~55 KB (gzipped)
- CSS: ~7 KB (gzipped)
- Total: ~62 KB gzipped

### Optimization Checklist

- ✅ Code splitting implemented
- ✅ CSS minification via Tailwind
- ✅ Tree-shaking enabled
- ✅ Images optimized
- ✅ Lazy loading on maps ready

### Further Optimization (When Needed)

```javascript
// Implement route-based code splitting
const PassengerPortal = lazy(() => import('./portals/PassengerPortalComplete'));
const StaffPortal = lazy(() => import('./portals/StaffPortalComplete'));
const AdminPortal = lazy(() => import('./portals/AdminPortalComplete'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/passenger" element={<PassengerPortal />} />
    // ...
  </Routes>
</Suspense>
```

## Security Considerations

### Current (Frontend-Only Demo)

⚠️ **Important**: This is a frontend-only demo implementation. The following security measures are placeholder/demo only:

- No real authentication
- No real authorization
- No data encryption
- All data is public/demo

### Production Requirements

When deploying to production with a backend:

1. **Authentication**
   - Implement JWT or OAuth 2.0
   - Secure token storage (HttpOnly cookies)
   - Session management

2. **Authorization**
   - Role-based access control (RBAC)
   - Route protection
   - API permission checks

3. **Data Security**
   - HTTPS/TLS encryption
   - CSRF protection
   - XSS prevention
   - SQL injection prevention

4. **API Security**
   - Rate limiting
   - CORS configuration
   - Input validation
   - Output encoding

5. **Infrastructure**
   - DDoS protection
   - WAF (Web Application Firewall)
   - Regular security audits
   - Dependency updates

## Monitoring & Logging

### Development

```bash
# Monitor build size
npm run build -- --stats
```

### Production

Recommended monitoring tools:

- **Error Tracking**: Sentry, LogRocket
- **Performance**: Vercel Analytics, Google Analytics
- **Uptime**: UptimeRobot, StatusPage
- **Logs**: CloudWatch, DataDog, NewRelic

## Continuous Integration/Deployment

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd client && npm install && npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: client/dist/
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Troubleshooting

### Common Issues

**Issue**: White screen on load
- Check browser console for errors
- Clear cache (Ctrl+Shift+R)
- Check Vite dev server is running

**Issue**: Map not loading
- Verify internet connection (Leaflet/OSM tiles)
- Check browser console for CORS errors
- Try a different browser

**Issue**: State not persisting
- This is expected - frontend-only demo uses memory storage
- Data resets on page refresh
- For persistence, implement backend + database

**Issue**: Slow performance on mobile
- Check network throttling
- Reduce image sizes
- Consider HTTP/2 push

## Scaling Considerations

### Current Architecture

The frontend is fully static and infinitely scalable via CDN.

### With Backend

As the backend grows:

1. **Database**: Implement connection pooling, read replicas
2. **API**: Add caching (Redis), implement pagination
3. **Real-time**: Scale Socket.IO with Redis adapter
4. **Files**: Move uploads to S3/Cloud Storage
5. **Search**: Implement Elasticsearch for routes/stops

## Rollback Procedure

### Vercel
```bash
# Automatic - just push previous commit
```

### Manual
```bash
# Keep previous builds backed up
# Redeploy previous dist version
```

## Support & Maintenance

### Weekly Tasks
- Monitor error logs
- Check performance metrics
- Review user feedback

### Monthly Tasks
- Dependency updates
- Security patches
- Performance optimization review

### Quarterly Tasks
- Feature releases
- Major refactoring
- Architecture review

## Contact & Support

For deployment issues or questions:

1. Check this guide first
2. Review error logs
3. Check Vercel/Netlify/hosting provider dashboard
4. Create a GitHub issue

---

**Last Updated**: 2025
**Version**: 1.0 (Frontend-only)
