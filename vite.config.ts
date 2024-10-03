import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/web-2024-template/", // Add this line
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['react/jsx-dev-runtime']
  },
  server: {
    hmr: {
      overlay: false
    }
  }
});
