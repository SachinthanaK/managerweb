import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    jsx: "automatic",
  },
  build: {
    chunkSizeWarningLimit: 2000, // Increase warning limit if necessary
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Group all node_modules into a single vendor chunk
          if (id.includes("node_modules")) {
            return "vendor";
          }

          // Further custom chunking logic
          if (id.includes("some-large-lib")) {
            return "some-large-lib";
          }

          // Example: Splitting another large component
          if (id.includes("src/components/LargeComponent")) {
            return "large-component";
          }
        },
      },
    },
  },
});
