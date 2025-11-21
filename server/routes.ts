import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertBatchSchema, insertEsgRecordSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Batch routes
  app.get("/api/batches", isAuthenticated, async (req: any, res) => {
    try {
      const batches = await storage.getAllBatches();
      res.json(batches);
    } catch (error) {
      console.error("Error fetching batches:", error);
      res.status(500).json({ message: "Failed to fetch batches" });
    }
  });

  app.get("/api/batches/:id", isAuthenticated, async (req: any, res) => {
    try {
      const batch = await storage.getBatch(req.params.id);
      if (!batch) {
        return res.status(404).json({ message: "Batch not found" });
      }
      res.json(batch);
    } catch (error) {
      console.error("Error fetching batch:", error);
      res.status(500).json({ message: "Failed to fetch batch" });
    }
  });

  app.post("/api/batches", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body
      const validatedData = insertBatchSchema.parse({
        ...req.body,
        createdBy: userId,
      });

      const batch = await storage.createBatch({
        ...validatedData,
        createdBy: userId,
      });

      res.status(201).json(batch);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid batch data", errors: error.errors });
      }
      console.error("Error creating batch:", error);
      res.status(500).json({ message: "Failed to create batch" });
    }
  });

  app.patch("/api/batches/:id", isAuthenticated, async (req: any, res) => {
    try {
      const batch = await storage.updateBatch(req.params.id, req.body);
      if (!batch) {
        return res.status(404).json({ message: "Batch not found" });
      }
      res.json(batch);
    } catch (error) {
      console.error("Error updating batch:", error);
      res.status(500).json({ message: "Failed to update batch" });
    }
  });

  // Supply chain event routes
  app.get("/api/batches/:id/events", isAuthenticated, async (req: any, res) => {
    try {
      const events = await storage.getBatchEvents(req.params.id);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post("/api/batches/:id/events", isAuthenticated, async (req: any, res) => {
    try {
      const event = await storage.createSupplyChainEvent({
        batchId: req.params.id,
        ...req.body,
      });
      
      // Update batch current stage if provided
      if (req.body.stage) {
        await storage.updateBatch(req.params.id, {
          currentStage: req.body.stage,
        });
      }

      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  // ESG record routes
  app.get("/api/batches/:id/esg", isAuthenticated, async (req: any, res) => {
    try {
      const esg = await storage.getEsgRecord(req.params.id);
      if (!esg) {
        return res.status(404).json({ message: "ESG record not found" });
      }
      res.json(esg);
    } catch (error) {
      console.error("Error fetching ESG record:", error);
      res.status(500).json({ message: "Failed to fetch ESG record" });
    }
  });

  app.post("/api/batches/esg", isAuthenticated, async (req: any, res) => {
    try {
      // Validate request body
      const validatedData = insertEsgRecordSchema.parse(req.body);

      const esg = await storage.createEsgRecord(validatedData);
      res.status(201).json(esg);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ESG data", errors: error.errors });
      }
      console.error("Error creating ESG record:", error);
      res.status(500).json({ message: "Failed to create ESG record" });
    }
  });

  app.patch("/api/batches/:id/esg", isAuthenticated, async (req: any, res) => {
    try {
      const esg = await storage.updateEsgRecord(req.params.id, req.body);
      if (!esg) {
        return res.status(404).json({ message: "ESG record not found" });
      }
      res.json(esg);
    } catch (error) {
      console.error("Error updating ESG record:", error);
      res.status(500).json({ message: "Failed to update ESG record" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
