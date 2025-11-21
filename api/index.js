// Vercel Serverless Function Entry Point
// Import the Express app and ensure initialization before handling requests

import app from '../dist/index.js';

let isInitialized = false;
let initPromise = null;

// Wait for routes to be registered (they're registered asynchronously in server/index.ts)
async function ensureInitialized() {
  if (isInitialized) return;

  if (initPromise) {
    await initPromise;
    return;
  }

  initPromise = new Promise((resolve) => {
    // Give the async registerRoutes() time to complete
    setTimeout(() => {
      isInitialized = true;
      resolve();
    }, 100);
  });

  await initPromise;
}

export default async function handler(req, res) {
  // Ensure routes are registered before handling requests
  await ensureInitialized();

  // Call the Express app as a request handler
  return app(req, res);
}
