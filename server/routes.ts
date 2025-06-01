import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication endpoint
  app.post('/api/admin/auth', (req, res) => {
    const { email, password } = req.body;
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (email === adminEmail && password === adminPassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
