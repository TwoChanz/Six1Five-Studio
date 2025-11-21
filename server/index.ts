import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logger that doesn't depend on vite
const log = (...args: any[]) => console.log(...args);

// Production static file serving (moved from vite.ts to avoid loading vite module)
function serveStatic(app: express.Express) {
  // In production, the built server is in dist/index.js, and Vite outputs to dist/ directly
  const distPath = import.meta.dirname;

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Initialize the app for both development and production
async function initializeApp() {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    // Dynamic import to avoid loading vite/rollup in production
    const { setupVite } = await import("./vite.js");
    await setupVite(app, server);
  } else {
    // Serve static files in production (doesn't use vite module)
    serveStatic(app);
  }

  return server;
}

// Only start the server if running directly (not imported by Vercel)
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const server = await initializeApp();

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    const env = app.get("env");
    const host = "0.0.0.0";

    server.listen(port, host, () => {
      log(`\n🚀 Six1Five Studio Portfolio Server`);
      log(`📍 Environment: ${env}`);
      log(`🌐 Local: http://localhost:${port}`);
      log(`🌐 Network: http://${host}:${port}`);
      log(`\n✨ Server ready and listening...\n`);
    });
  })();
} else {
  // Initialize app for Vercel serverless
  await initializeApp();
}

// Export the app for Vercel serverless
export default app;
