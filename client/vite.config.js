import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forward API calls to the Express backend during development.
      "/api": {
        target: process.env.VITE_DEV_API_PROXY || "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
