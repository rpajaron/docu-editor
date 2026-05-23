import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API_TARGET = "http://localhost:3001";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Leading dot allows any subdomain (ngrok URLs change per session).
    allowedHosts: [".ngrok-free.dev", ".ngrok.io", ".ngrok.app"],
    proxy: {
      "/api": { target: API_TARGET, changeOrigin: true },
      "/health": { target: API_TARGET, changeOrigin: true },
      "/ws": { target: API_TARGET, ws: true, changeOrigin: true },
    },
  },
});
