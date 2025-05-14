import { pgTable, text, serial, integer, boolean, timestamp, numeric, json, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  bio: text("bio"),
  avatar: text("avatar"),
  isInventor: boolean("is_inventor").notNull().default(false),
  isInvestor: boolean("is_investor").notNull().default(false),
  subscriptionActive: boolean("subscription_active").default(false),
  subscriptionEndDate: timestamp("subscription_end_date"),
  trialUsed: boolean("trial_used").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Invention schema
export const inventions = pgTable("inventions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  images: text("images").array(),
  videos: text("videos").array(),
  models3d: text("models_3d").array(), // URLs to 3D models
  category: text("category").notNull(),
  status: text("status").notNull(), // "in-progress", "completed", "prototype"
  fundingGoal: numeric("funding_goal"),
  currentFunding: numeric("current_funding").default("0"),
  inventorId: integer("inventor_id").notNull(),
  aiAssistance: boolean("ai_assistance").default(false),
  tags: text("tags").array(),
  patentStatus: text("patent_status"), // "pending", "granted", "none"
  forSale: boolean("for_sale").default(false),
  salePrice: numeric("sale_price"),
  inAuction: boolean("in_auction").default(false),
  auctionEndDate: timestamp("auction_end_date"),
  highestBid: numeric("highest_bid"),
  viewCount: integer("view_count").default(0),
  trendingScore: numeric("trending_score").default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertInventionSchema = createInsertSchema(inventions).omit({
  id: true,
  currentFunding: true,
  createdAt: true,
  updatedAt: true,
});

// Investments schema
export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  inventionId: integer("invention_id").notNull(),
  investorId: integer("investor_id").notNull(),
  amount: numeric("amount").notNull(),
  equityPercentage: numeric("equity_percentage"),
  message: text("message"),
  status: text("status").notNull().default("active"), // "active", "returned", "completed"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  id: true,
  createdAt: true,
});

// AI Feedback schema
export const aiFeedback = pgTable("ai_feedback", {
  id: serial("id").primaryKey(),
  inventionId: integer("invention_id").notNull(),
  feedback: text("feedback").notNull(),
  suggestedImprovements: jsonb("suggested_improvements"),
  marketAnalysis: jsonb("market_analysis"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAiFeedbackSchema = createInsertSchema(aiFeedback).omit({
  id: true,
  createdAt: true,
});

// Invention Updates schema
export const inventionUpdates = pgTable("invention_updates", {
  id: serial("id").primaryKey(),
  inventionId: integer("invention_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  images: text("images").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInventionUpdateSchema = createInsertSchema(inventionUpdates).omit({
  id: true,
  createdAt: true,
});

// Comments schema
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  inventionId: integer("invention_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
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

// Auctions schema
export const auctions = pgTable("auctions", {
  id: serial("id").primaryKey(),
  inventionId: integer("invention_id").notNull(),
  startingPrice: numeric("starting_price").notNull(),
  currentPrice: numeric("current_price"),
  reservePrice: numeric("reserve_price"),
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("active"), // "active", "completed", "cancelled"
  winnerId: integer("winner_id"),
  platformFee: numeric("platform_fee"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAuctionSchema = createInsertSchema(auctions).omit({
  id: true,
  currentPrice: true,
  winnerId: true,
  platformFee: true,
  createdAt: true,
  updatedAt: true,
});

// Bids schema
export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  auctionId: integer("auction_id").notNull(),
  bidderId: integer("bidder_id").notNull(),
  amount: numeric("amount").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  isWinning: boolean("is_winning").default(false),
});

export const insertBidSchema = createInsertSchema(bids).omit({
  id: true,
  timestamp: true,
  isWinning: true,
});

// Platform fees configuration
export const platformFees = pgTable("platform_fees", {
  id: serial("id").primaryKey(),
  feeType: text("fee_type").notNull(), // "investment", "sale", "auction"
  percentage: numeric("percentage").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPlatformFeeSchema = createInsertSchema(platformFees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Invention = typeof inventions.$inferSelect;
export type InsertInvention = z.infer<typeof insertInventionSchema>;

export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;

export type AIFeedback = typeof aiFeedback.$inferSelect;
export type InsertAIFeedback = z.infer<typeof insertAiFeedbackSchema>;

export type InventionUpdate = typeof inventionUpdates.$inferSelect;
export type InsertInventionUpdate = z.infer<typeof insertInventionUpdateSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Auction = typeof auctions.$inferSelect;
export type InsertAuction = z.infer<typeof insertAuctionSchema>;

export type Bid = typeof bids.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;

export type PlatformFee = typeof platformFees.$inferSelect;
export type InsertPlatformFee = z.infer<typeof insertPlatformFeeSchema>;

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
