import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

/**
 * Why this matters:
 * - Vercel’s Vite preset serves from a folder named "dist".
 * - Your previous config emitted to "dist/public", so Vercel couldn't find index.html
 *   and ended up serving a JS file as plain text.
 * - Switching build.outDir to "dist" aligns Vite output with Vercel's expectation.
 */
export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? [
          // Optional Replit plugin only in non-production — keeps your dev overlay working
          await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer()),
        ]
      : []),
  ],
  resolve: {
    alias: {
      // Lets you write "@/components/Button" from client/src
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  // The app’s source lives in /client
  root: path.resolve(import.meta.dirname, "client"),

  build: {
    // IMPORTANT: Vercel expects "dist". This is the fix.
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
          
          // Routing and state management
          'app-core': ['wouter', '@tanstack/react-query', 'react-hook-form', 'zod'],
          
          // UI component library (Radix UI)
          'ui-components': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-accordion',
            '@radix-ui/react-tabs',
            '@radix-ui/react-select',
            '@radix-ui/react-toast',
            '@radix-ui/react-label',
            '@radix-ui/react-slot',
            '@radix-ui/react-separator'
          ],
          
          // 3D rendering libraries
          'three-vendor': ['three', 'three-stdlib'],
          
          // Icons and animations
          'visual-libs': ['lucide-react', 'framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Increase from default 500KB
  },

  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
