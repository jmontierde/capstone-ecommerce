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
        "react-alert-template-basic",
        "react-input-emoji",
        "react-messenger-customer-chat",
        "use-react-countries",
      ],
    },
    chunkSizeWarningLimit: 100000000,
  },
});
