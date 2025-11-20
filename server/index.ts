import 'dotenv/config';
import type { Express } from "express";
import express from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import type { Request, Response, NextFunction } from "express";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// Initialize the app
async function initializeApp() {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  return server;
}

// Start the server when running locally (not in Vercel serverless)
// Vercel sets the VERCEL env variable, so we can use that to detect serverless environment
if (!process.env.VERCEL) {
  (async () => {
    const server = await initializeApp();

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
}

// Initialize and export the app for Vercel serverless
let expressApp: Express | null = null;

async function getExpressApp() {
  if (!expressApp) {
    // Initialize routes but we don't need the HTTP server for serverless
    await registerRoutes(app);

    // Error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });

    // Serve static files in production
    if (app.get("env") !== "development") {
      serveStatic(app);
    }

    expressApp = app;
  }
  return expressApp;
}

// Export the Express app for Vercel serverless
export default async function handler(req: any, res: any) {
  const expressApp = await getExpressApp();
  return expressApp(req, res);
}
