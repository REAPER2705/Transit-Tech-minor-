import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database.js';
import { authenticateToken } from './middleware/auth.js';

// Route imports
import authRoutes from './routes/auth.js';
import passengerRoutes from './routes/passenger.js';
import staffRoutes from './routes/staff.js';
import adminRoutes from './routes/admin.js';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/passenger', authenticateToken, passengerRoutes);
app.use('/api/v1/staff', authenticateToken, staffRoutes);
app.use('/api/v1/admin', authenticateToken, adminRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('join-trip', (tripId) => {
    socket.join(`trip:${tripId}`);
    console.log(`Socket ${socket.id} joined trip:${tripId}`);
  });

  socket.on('leave-trip', (tripId) => {
    socket.leave(`trip:${tripId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Make io available globally
app.locals.io = io;

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export { app, httpServer, io };
