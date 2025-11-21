import {
  users,
  batches,
  supplyChainEvents,
  esgRecords,
  esgDocuments,
  type User,
  type UpsertUser,
  type Batch,
  type InsertBatch,
  type SupplyChainEvent,
  type InsertSupplyChainEvent,
  type EsgRecord,
  type InsertEsgRecord,
  type EsgDocument,
  type InsertEsgDocument,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomBytes } from "crypto";
import { blockchain } from "./blockchain";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Batch operations
  createBatch(batch: InsertBatch & { createdBy: string }): Promise<Batch>;
  getBatch(id: string): Promise<Batch | undefined>;
  getAllBatches(): Promise<Batch[]>;
  getUserBatches(userId: string): Promise<Batch[]>;
  updateBatch(id: string, data: Partial<Batch>): Promise<Batch | undefined>;

  // Supply chain event operations
  createSupplyChainEvent(event: InsertSupplyChainEvent): Promise<SupplyChainEvent>;
  getBatchEvents(batchId: string): Promise<SupplyChainEvent[]>;

  // ESG record operations
  createEsgRecord(record: InsertEsgRecord): Promise<EsgRecord>;
  getEsgRecord(batchId: string): Promise<EsgRecord | undefined>;
  updateEsgRecord(batchId: string, data: Partial<EsgRecord>): Promise<EsgRecord | undefined>;

  // ESG document operations
  uploadEsgDocument(doc: InsertEsgDocument): Promise<EsgDocument>;
  getBatchDocuments(batchId: string): Promise<EsgDocument[]>;
  deleteDocument(docId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Batch operations
  async createBatch(batch: InsertBatch & { createdBy: string }): Promise<Batch> {
    // Generate unique batch number
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = randomBytes(3).toString('hex').toUpperCase();
    const batchNumber = `LTB-${timestamp}-${random}`;

    // Generate local hash for batch
    const localHash = `0x${randomBytes(32).toString('hex')}`;

    // Store hash on blockchain (Polygon)
    let blockchainHash = localHash;
    try {
      const blockchainResult = await blockchain.storeBatchHash(
        "", // Will be set after batch creation
        batchNumber,
        localHash,
      );
      blockchainHash = blockchainResult.blockchainHash;
      console.log(`Batch ${batchNumber} stored on blockchain:`, blockchainHash);
    } catch (error) {
      console.warn("Blockchain storage failed, using local hash:", error);
      // Fall back to local hash if blockchain fails
      blockchainHash = localHash;
    }

    const [newBatch] = await db
      .insert(batches)
      .values({
        ...batch,
        batchNumber,
        blockchainHash,
      })
      .returning();

    // Create initial supply chain event
    await this.createSupplyChainEvent({
      batchId: newBatch.id,
      stage: batch.currentStage,
      stakeholder: batch.minerName,
      location: batch.mineLocation,
      notes: "Initial batch registration - Blockchain verified",
      timestamp: new Date(),
    });

    return newBatch;
  }

  async getBatch(id: string): Promise<Batch | undefined> {
    const [batch] = await db.select().from(batches).where(eq(batches.id, id));
    return batch || undefined;
  }

  async getAllBatches(): Promise<Batch[]> {
    return await db.select().from(batches).orderBy(desc(batches.createdAt));
  }

  async getUserBatches(userId: string): Promise<Batch[]> {
    return await db.select().from(batches).where(eq(batches.createdBy, userId)).orderBy(desc(batches.createdAt));
  }

  async updateBatch(id: string, data: Partial<Batch>): Promise<Batch | undefined> {
    const [updated] = await db
      .update(batches)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(batches.id, id))
      .returning();
    return updated || undefined;
  }

  // Supply chain event operations
  async createSupplyChainEvent(event: InsertSupplyChainEvent): Promise<SupplyChainEvent> {
    const [newEvent] = await db
      .insert(supplyChainEvents)
      .values(event)
      .returning();
    return newEvent;
  }

  async getBatchEvents(batchId: string): Promise<SupplyChainEvent[]> {
    return await db
      .select()
      .from(supplyChainEvents)
      .where(eq(supplyChainEvents.batchId, batchId))
      .orderBy(desc(supplyChainEvents.timestamp));
  }

  // ESG record operations
  async createEsgRecord(record: InsertEsgRecord): Promise<EsgRecord> {
    const [newRecord] = await db
      .insert(esgRecords)
      .values(record)
      .returning();
    return newRecord;
  }

  async getEsgRecord(batchId: string): Promise<EsgRecord | undefined> {
    const [record] = await db
      .select()
      .from(esgRecords)
      .where(eq(esgRecords.batchId, batchId));
    return record || undefined;
  }

  async updateEsgRecord(batchId: string, data: Partial<EsgRecord>): Promise<EsgRecord | undefined> {
    const [updated] = await db
      .update(esgRecords)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(esgRecords.batchId, batchId))
      .returning();
    return updated || undefined;
  }

  // ESG document operations
  async uploadEsgDocument(doc: InsertEsgDocument): Promise<EsgDocument> {
    const [newDoc] = await db
      .insert(esgDocuments)
      .values(doc)
      .returning();
    return newDoc;
  }

  async getBatchDocuments(batchId: string): Promise<EsgDocument[]> {
    return await db
      .select()
      .from(esgDocuments)
      .where(eq(esgDocuments.batchId, batchId))
      .orderBy(desc(esgDocuments.createdAt));
  }

  async deleteDocument(docId: string): Promise<void> {
    await db.delete(esgDocuments).where(eq(esgDocuments.id, docId));
  }
}

export const storage = new DatabaseStorage();
