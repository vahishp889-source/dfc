import { create } from 'zustand';
import { io } from 'socket.io-client';
import { getSettings } from '../services/api';

const POLL_INTERVAL_MS = 60_000; // re-fetch every 60 seconds (fallback)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const RESTAURANT_ID = import.meta.env.VITE_RESTAURANT_ID;

const useSettingsStore = create((set, get) => ({
  settings: null,
  restaurant: null,

  /** Initial load — called once from App.jsx */
  load: async () => {
    await get()._fetch();

    // 1. Start polling fallback so admin changes reflect even if socket fails
    if (!get()._pollTimer) {
      const timer = setInterval(() => get()._fetch(), POLL_INTERVAL_MS);
      set({ _pollTimer: timer });
    }

    // 2. Establish live WebSocket for instant settings updates
    if (!get()._socket && RESTAURANT_ID) {
      try {
        const socket = io(SOCKET_URL);
        
        socket.on('connect', () => {
          socket.emit('join-restaurant', RESTAURANT_ID);
        });

        socket.on('settings-updated', () => {
          get()._fetch();
        });

        set({ _socket: socket });
      } catch (err) {
        console.error('Failed to initialize settings socket:', err);
      }
    }
  },

  /** Internal fetch — updates state with latest settings from backend */
  _fetch: async () => {
    try {
      const data = await getSettings();
      set({
        settings:   data?.settings   ?? null,
        restaurant: data?.restaurant ?? null,
      });
    } catch {
      // keep existing values on network error
    }
  },

  _pollTimer: null,
  _socket: null,
}));

export default useSettingsStore;
