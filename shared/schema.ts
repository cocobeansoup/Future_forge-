import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Opportunity schema
export const opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  companyName: text("company_name").notNull(),
  stage: text("stage").notNull(), // qualification, proposal, negotiation, closing
  value: numeric("value").notNull(),
  probability: integer("probability").notNull(), // 0-100
  closeDate: timestamp("close_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertOpportunitySchema = createInsertSchema(opportunities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Pipeline Stages schema
export const pipelineStages = pgTable("pipeline_stages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: numeric("value").notNull(),
  color: text("color").notNull(),
});

export const insertPipelineStageSchema = createInsertSchema(pipelineStages).omit({
  id: true,
});

// Revenue Forecast schema
export const revenueForecast = pgTable("revenue_forecast", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  actualRevenue: numeric("actual_revenue"),
  projectedRevenue: numeric("projected_revenue"),
});

export const insertRevenueForecastSchema = createInsertSchema(revenueForecast).omit({
  id: true,
});

// API Keys schema
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  userId: integer("user_id").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertApiKeySchema = createInsertSchema(apiKeys).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Opportunity = typeof opportunities.$inferSelect;
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;

export type PipelineStage = typeof pipelineStages.$inferSelect;
export type InsertPipelineStage = z.infer<typeof insertPipelineStageSchema>;

export type RevenueForecast = typeof revenueForecast.$inferSelect;
export type InsertRevenueForecast = z.infer<typeof insertRevenueForecastSchema>;

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
