
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve attached assets
app.use('/attached_assets', express.static('attached_assets'));

// Request logging middleware
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
      console.log(logLine);
    }
  });

  next();
});

(async () => {
  // Register API routes first
  const server = await registerRoutes(app);

  // Serve static files in production
  const distPath = path.resolve(process.cwd(), "dist", "public");
  console.log(`Serving static files from: ${distPath}`);
  
  if (!require('fs').existsSync(distPath)) {
    console.error(`Static files directory not found: ${distPath}`);
    process.exit(1);
  }
  
  app.use(express.static(distPath));
  
  // SPA fallback - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API route not found' });
    }
    
    const indexPath = path.join(distPath, "index.html");
    console.log(`Serving SPA fallback: ${indexPath}`);
    res.sendFile(indexPath);
  });

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(`Error ${status}: ${message}`);
    res.status(status).json({ message });
  });

  // Start server
  const PORT = parseInt(process.env.PORT || "5000", 10);
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Static files served from: ${distPath}`);
  });
})();
