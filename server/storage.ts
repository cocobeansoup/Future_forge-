import { 
  users, User, InsertUser,
  inventions, Invention, InsertInvention,
  investments, Investment, InsertInvestment,
  aiFeedback, AIFeedback, InsertAIFeedback,
  inventionUpdates, InventionUpdate, InsertInventionUpdate,
  comments, Comment, InsertComment,
  apiKeys, ApiKey, InsertApiKey
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Invention methods
  getInventions(): Promise<Invention[]>;
  getInventionsByUser(userId: number): Promise<Invention[]>;
  getInventionsByCategory(category: string): Promise<Invention[]>;
  getInvention(id: number): Promise<Invention | undefined>;
  createInvention(invention: InsertInvention): Promise<Invention>;
  updateInvention(id: number, invention: Partial<InsertInvention>): Promise<Invention | undefined>;
  deleteInvention(id: number): Promise<boolean>;
  
  // Investment methods
  getInvestments(inventionId: number): Promise<Investment[]>;
  getUserInvestments(userId: number): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestmentStatus(id: number, status: string): Promise<Investment | undefined>;
  
  // AI Feedback methods
  getAIFeedback(inventionId: number): Promise<AIFeedback[]>;
  createAIFeedback(feedback: InsertAIFeedback): Promise<AIFeedback>;
  
  // Invention Update methods
  getInventionUpdates(inventionId: number): Promise<InventionUpdate[]>;
  createInventionUpdate(update: InsertInventionUpdate): Promise<InventionUpdate>;
  
  // Comment methods
  getComments(inventionId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;
  
  // API Key methods
  getApiKeys(userId: number): Promise<ApiKey[]>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  deleteApiKey(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Invention methods
  async getInventions(): Promise<Invention[]> {
    return await db.select().from(inventions);
  }

  async getInventionsByUser(userId: number): Promise<Invention[]> {
    return await db
      .select()
      .from(inventions)
      .where(eq(inventions.inventorId, userId));
  }

  async getInventionsByCategory(category: string): Promise<Invention[]> {
    return await db
      .select()
      .from(inventions)
      .where(eq(inventions.category, category));
  }

  async getInvention(id: number): Promise<Invention | undefined> {
    const [invention] = await db
      .select()
      .from(inventions)
      .where(eq(inventions.id, id));
    return invention;
  }

  async createInvention(insertInvention: InsertInvention): Promise<Invention> {
    const [invention] = await db
      .insert(inventions)
      .values(insertInvention)
      .returning();
    return invention;
  }

  async updateInvention(id: number, updateData: Partial<InsertInvention>): Promise<Invention | undefined> {
    const [updatedInvention] = await db
      .update(inventions)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(inventions.id, id))
      .returning();
    return updatedInvention;
  }

  async deleteInvention(id: number): Promise<boolean> {
    const result = await db
      .delete(inventions)
      .where(eq(inventions.id, id))
      .returning();
    return result.length > 0;
  }

  // Investment methods
  async getInvestments(inventionId: number): Promise<Investment[]> {
    return await db
      .select()
      .from(investments)
      .where(eq(investments.inventionId, inventionId));
  }

  async getUserInvestments(userId: number): Promise<Investment[]> {
    return await db
      .select()
      .from(investments)
      .where(eq(investments.investorId, userId));
  }

  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const [investment] = await db
      .insert(investments)
      .values(insertInvestment)
      .returning();
    return investment;
  }

  async updateInvestmentStatus(id: number, status: string): Promise<Investment | undefined> {
    const [updatedInvestment] = await db
      .update(investments)
      .set({ status })
      .where(eq(investments.id, id))
      .returning();
    return updatedInvestment;
  }

  // AI Feedback methods
  async getAIFeedback(inventionId: number): Promise<AIFeedback[]> {
    return await db
      .select()
      .from(aiFeedback)
      .where(eq(aiFeedback.inventionId, inventionId));
  }

  async createAIFeedback(insertFeedback: InsertAIFeedback): Promise<AIFeedback> {
    const [feedback] = await db
      .insert(aiFeedback)
      .values(insertFeedback)
      .returning();
    return feedback;
  }

  // Invention Update methods
  async getInventionUpdates(inventionId: number): Promise<InventionUpdate[]> {
    return await db
      .select()
      .from(inventionUpdates)
      .where(eq(inventionUpdates.inventionId, inventionId));
  }

  async createInventionUpdate(insertUpdate: InsertInventionUpdate): Promise<InventionUpdate> {
    const [update] = await db
      .insert(inventionUpdates)
      .values(insertUpdate)
      .returning();
    return update;
  }

  // Comment methods
  async getComments(inventionId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.inventionId, inventionId));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const result = await db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning();
    return result.length > 0;
  }

  // API Key methods
  async getApiKeys(userId: number): Promise<ApiKey[]> {
    return await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId));
  }

  async createApiKey(insertApiKey: InsertApiKey): Promise<ApiKey> {
    const [apiKey] = await db
      .insert(apiKeys)
      .values(insertApiKey)
      .returning();
    return apiKey;
  }

  async deleteApiKey(id: number): Promise<boolean> {
    const result = await db
      .delete(apiKeys)
      .where(eq(apiKeys.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
