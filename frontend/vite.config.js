// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"), // Allows "@/components/..." imports
//     },
//   },
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Allows "@/components/..." imports
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // Your backend server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
