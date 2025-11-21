// Vercel Serverless Function Entry Point
// Import the Express app and wrap it in a handler function

import app from '../dist/index.js';

export default function handler(req, res) {
  // Call the Express app as a request handler
  return app(req, res);
}
