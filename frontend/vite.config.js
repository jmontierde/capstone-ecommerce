import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        // Existing external dependencies
        /^node:/,

        // Add react-alert as an external dependency
        "react-alert",
      ],
    },
    chunkSizeWarningLimit: 100000000,
  },
});
