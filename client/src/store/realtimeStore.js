import { create } from 'zustand';
import io from 'socket.io-client';

const realtimeStore = create((set, get) => ({
  socket: null,
  currentTripId: null,
  tripLocation: null,
  tripOccupancy: null,

  initSocket: () => {
    const socket = io('/', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('trip:location.updated', (data) => {
      set({ tripLocation: data.data });
    });

    socket.on('trip:occupancy.updated', (data) => {
      set({ tripOccupancy: data.data });
    });

    set({ socket });
    return socket;
  },

  joinTrip: (tripId) => {
    const socket = get().socket;
    if (socket) {
      socket.emit('join-trip', tripId);
      set({ currentTripId: tripId });
    }
  },

  leaveTrip: (tripId) => {
    const socket = get().socket;
    if (socket) {
      socket.emit('leave-trip', tripId);
      set({ currentTripId: null, tripLocation: null, tripOccupancy: null });
    }
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

export default realtimeStore;
