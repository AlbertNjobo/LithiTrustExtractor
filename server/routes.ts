import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { blockchain } from "./blockchain";
import { insertBatchSchema, insertEsgRecordSchema, insertEsgDocumentSchema } from "@shared/schema";
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

  // ESG document routes
  app.get("/api/batches/:id/documents", isAuthenticated, async (req: any, res) => {
    try {
      const documents = await storage.getBatchDocuments(req.params.id);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/batches/:id/documents", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body
      const validatedData = insertEsgDocumentSchema.parse({
        ...req.body,
        batchId: req.params.id,
        uploadedBy: userId,
      });

      const document = await storage.uploadEsgDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  app.delete("/api/documents/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteDocument(req.params.id);
      res.json({ message: "Document deleted" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Pricing calculator endpoint
  app.get("/api/pricing/calculator", isAuthenticated, async (req: any, res) => {
    try {
      const batchId = req.query.batchId as string;
      const batch = await storage.getBatch(batchId);
      
      if (!batch) {
        return res.status(404).json({ message: "Batch not found" });
      }

      const esg = await storage.getEsgRecord(batchId);
      
      // Base price per kg of lithium (USD)
      const basePrice = 12;
      const weight = parseFloat(batch.weight.toString());
      const baseTotal = weight * basePrice;

      // Green premium calculation (0-30% based on ESG score)
      const esgScore = esg
        ? Math.round((esg.environmentalScore + esg.socialScore + esg.governanceScore) / 3)
        : 0;
      const greenPremium = (esgScore / 100) * 0.30; // 0-30% premium

      const premiumAmount = baseTotal * greenPremium;
      const totalPrice = baseTotal + premiumAmount;

      res.json({
        batchId,
        weight,
        basePrice,
        baseTotal: Math.round(baseTotal * 100) / 100,
        esgScore,
        greenPremium: Math.round(greenPremium * 100),
        premiumAmount: Math.round(premiumAmount * 100) / 100,
        totalPrice: Math.round(totalPrice * 100) / 100,
      });
    } catch (error) {
      console.error("Error calculating pricing:", error);
      res.status(500).json({ message: "Failed to calculate pricing" });
    }
  });

  // Blockchain verification endpoint
  app.get("/api/blockchain/verify/:batchId", isAuthenticated, async (req: any, res) => {
    try {
      const batchId = req.params.batchId as string;
      const batch = await storage.getBatch(batchId);
      
      if (!batch) {
        return res.status(404).json({ message: "Batch not found" });
      }

      const verification = await blockchain.verifyBatchHash(batchId, batch.blockchainHash);
      
      res.json({
        batchId,
        batchNumber: batch.batchNumber,
        blockchainHash: batch.blockchainHash,
        ...verification,
      });
    } catch (error) {
      console.error("Error verifying blockchain:", error);
      res.status(500).json({ message: "Failed to verify batch on blockchain" });
    }
  });

  // Blockchain network info endpoint
  app.get("/api/blockchain/network", isAuthenticated, async (req: any, res) => {
    try {
      const networkInfo = await blockchain.getNetworkInfo();
      res.json(networkInfo);
    } catch (error) {
      console.error("Error getting blockchain network info:", error);
      res.status(500).json({ message: "Failed to get blockchain network info" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
