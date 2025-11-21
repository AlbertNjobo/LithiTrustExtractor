import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("miner"), // miner, processor, exporter, buyer, regulator
  organization: varchar("organization"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Lithium batches table
export const batches = pgTable("batches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  batchNumber: varchar("batch_number").notNull().unique(),
  mineName: varchar("mine_name").notNull(),
  mineLocation: varchar("mine_location").notNull(),
  minerName: varchar("miner_name").notNull(),
  minerContact: varchar("miner_contact"),
  weight: decimal("weight", { precision: 10, scale: 2 }).notNull(), // in kg
  grade: varchar("grade").notNull(), // spodumene, petalite, etc.
  lithiumContent: decimal("lithium_content", { precision: 5, scale: 2 }).notNull(), // percentage
  currentStage: varchar("current_stage").notNull().default("mining"), // mining, processing, export, delivered
  status: varchar("status").notNull().default("active"), // active, verified, completed
  blockchainHash: varchar("blockchain_hash").notNull(), // simulated blockchain hash
  qrCode: text("qr_code"), // QR code data
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBatchSchema = createInsertSchema(batches).omit({
  id: true,
  batchNumber: true,
  blockchainHash: true,
  qrCode: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBatch = z.infer<typeof insertBatchSchema>;
export type Batch = typeof batches.$inferSelect;

// Supply chain events table
export const supplyChainEvents = pgTable("supply_chain_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  batchId: varchar("batch_id").notNull().references(() => batches.id, { onDelete: 'cascade' }),
  stage: varchar("stage").notNull(), // mining, processing, export, delivered
  stakeholder: varchar("stakeholder").notNull(), // company/person name
  organization: varchar("organization"),
  location: varchar("location").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  notes: text("notes"),
  verifiedBy: varchar("verified_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSupplyChainEventSchema = createInsertSchema(supplyChainEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertSupplyChainEvent = z.infer<typeof insertSupplyChainEventSchema>;
export type SupplyChainEvent = typeof supplyChainEvents.$inferSelect;

// ESG records table
export const esgRecords = pgTable("esg_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  batchId: varchar("batch_id").notNull().references(() => batches.id, { onDelete: 'cascade' }).unique(),
  environmentalScore: integer("environmental_score").notNull().default(0), // 0-100
  socialScore: integer("social_score").notNull().default(0), // 0-100
  governanceScore: integer("governance_score").notNull().default(0), // 0-100
  childLabourCheck: boolean("child_labour_check").notNull().default(true),
  waterUsage: decimal("water_usage", { precision: 10, scale: 2 }), // liters
  communityAgreement: boolean("community_agreement").notNull().default(false),
  safetyPractices: text("safety_practices"),
  rehabilitationPlan: text("rehabilitation_plan"),
  carbonIntensity: decimal("carbon_intensity", { precision: 10, scale: 2 }), // kg CO2e per ton
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEsgRecordSchema = createInsertSchema(esgRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEsgRecord = z.infer<typeof insertEsgRecordSchema>;
export type EsgRecord = typeof esgRecords.$inferSelect;

// ESG Documents table (for certificates and compliance reports)
export const esgDocuments = pgTable("esg_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  batchId: varchar("batch_id").notNull().references(() => batches.id, { onDelete: 'cascade' }),
  documentType: varchar("document_type").notNull(), // certificate, report, audit, permit
  fileName: varchar("file_name").notNull(),
  filePath: text("file_path").notNull(), // stored file path
  fileSize: integer("file_size"), // bytes
  uploadedBy: varchar("uploaded_by").notNull().references(() => users.id),
  verified: boolean("verified").default(false),
  verifiedBy: varchar("verified_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEsgDocumentSchema = createInsertSchema(esgDocuments).omit({
  id: true,
  createdAt: true,
});

export type InsertEsgDocument = z.infer<typeof insertEsgDocumentSchema>;
export type EsgDocument = typeof esgDocuments.$inferSelect;

// Relations
export const batchesRelations = relations(batches, ({ one, many }) => ({
  creator: one(users, {
    fields: [batches.createdBy],
    references: [users.id],
  }),
  supplyChainEvents: many(supplyChainEvents),
  esgRecord: one(esgRecords, {
    fields: [batches.id],
    references: [esgRecords.batchId],
  }),
  esgDocuments: many(esgDocuments),
}));

export const supplyChainEventsRelations = relations(supplyChainEvents, ({ one }) => ({
  batch: one(batches, {
    fields: [supplyChainEvents.batchId],
    references: [batches.id],
  }),
  verifier: one(users, {
    fields: [supplyChainEvents.verifiedBy],
    references: [users.id],
  }),
}));

export const esgRecordsRelations = relations(esgRecords, ({ one }) => ({
  batch: one(batches, {
    fields: [esgRecords.batchId],
    references: [batches.id],
  }),
}));

export const esgDocumentsRelations = relations(esgDocuments, ({ one }) => ({
  batch: one(batches, {
    fields: [esgDocuments.batchId],
    references: [batches.id],
  }),
  uploader: one(users, {
    fields: [esgDocuments.uploadedBy],
    references: [users.id],
  }),
}));
