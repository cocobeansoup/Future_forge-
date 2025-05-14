import { 
  users, User, InsertUser,
  inventions, Invention, InsertInvention,
  investments, Investment, InsertInvestment,
  aiFeedback, AIFeedback, InsertAIFeedback,
  inventionUpdates, InventionUpdate, InsertInventionUpdate,
  comments, Comment, InsertComment,
  auctions, Auction, InsertAuction,
  bids, Bid, InsertBid,
  platformFees, PlatformFee, InsertPlatformFee,
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
  getTrendingInventions(limit?: number): Promise<Invention[]>;
  getInvention(id: number): Promise<Invention | undefined>;
  createInvention(invention: InsertInvention): Promise<Invention>;
  updateInvention(id: number, invention: Partial<InsertInvention>): Promise<Invention | undefined>;
  deleteInvention(id: number): Promise<boolean>;
  incrementViewCount(id: number): Promise<void>;
  
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
  
  // Auction methods
  getAuctions(status?: string): Promise<Auction[]>;
  getAuctionsByInvention(inventionId: number): Promise<Auction[]>;
  getAuction(id: number): Promise<Auction | undefined>;
  createAuction(auction: InsertAuction): Promise<Auction>;
  updateAuction(id: number, data: Partial<Auction>): Promise<Auction | undefined>;
  endAuction(id: number, winnerId?: number): Promise<Auction | undefined>;
  
  // Bid methods
  getBids(auctionId: number): Promise<Bid[]>;
  getUserBids(userId: number): Promise<Bid[]>;
  createBid(bid: InsertBid): Promise<Bid>;
  getHighestBid(auctionId: number): Promise<Bid | undefined>;
  
  // Platform Fee methods
  getPlatformFee(feeType: string): Promise<PlatformFee | undefined>;
  getAllPlatformFees(): Promise<PlatformFee[]>;
  createPlatformFee(fee: InsertPlatformFee): Promise<PlatformFee>;
  updatePlatformFee(id: number, data: Partial<PlatformFee>): Promise<PlatformFee | undefined>;
  
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

  async getTrendingInventions(limit: number = 10): Promise<Invention[]> {
    return await db
      .select()
      .from(inventions)
      .orderBy(inventions.trendingScore, "desc")
      .orderBy(inventions.viewCount, "desc")
      .limit(limit);
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

  async incrementViewCount(id: number): Promise<void> {
    const invention = await this.getInvention(id);
    if (invention) {
      await db
        .update(inventions)
        .set({ 
          viewCount: (invention.viewCount || 0) + 1,
          trendingScore: String(Number(invention.trendingScore || "0") + 0.1)
        })
        .where(eq(inventions.id, id));
    }
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
    // Apply platform fee (5%)
    const fee = await this.getPlatformFee("investment");
    const feePercentage = fee ? Number(fee.percentage) : 5; // Default to 5% if not configured
    
    // Add platform fee as metadata
    const investmentWithFee = {
      ...insertInvestment,
      metadata: JSON.stringify({
        platformFeePercentage: feePercentage,
        platformFeeAmount: (Number(insertInvestment.amount) * feePercentage / 100).toFixed(2)
      })
    };
    
    const [investment] = await db
      .insert(investments)
      .values(investmentWithFee)
      .returning();
    
    // Update invention funding amount
    const invention = await this.getInvention(investment.inventionId);
    if (invention) {
      const currentFunding = Number(invention.currentFunding || "0");
      const newAmount = currentFunding + Number(investment.amount);
      const trendingScore = Number(invention.trendingScore || "0") + 5; // Boost trending score on investment
      
      await db
        .update(inventions)
        .set({ 
          currentFunding: String(newAmount),
          trendingScore: String(trendingScore)
        })
        .where(eq(inventions.id, investment.inventionId));
    }
    
    return investment;
  }

  async updateInvestmentStatus(id: number, status: string): Promise<Investment | undefined> {
    const [updatedInvestment] = await db
      .update(investments)
      .set({ status, updatedAt: new Date() })
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
    
    // Update invention to mark that it received AI assistance
    await db
      .update(inventions)
      .set({ aiAssistance: true })
      .where(eq(inventions.id, insertFeedback.inventionId));
      
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
    
    // Boost trending score with each update
    const invention = await this.getInvention(update.inventionId);
    if (invention) {
      const trendingScore = Number(invention.trendingScore || "0") + 2;
      await db
        .update(inventions)
        .set({ trendingScore: String(trendingScore) })
        .where(eq(inventions.id, update.inventionId));
    }
    
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
    
    // Boost invention trending score slightly with comments
    const invention = await this.getInvention(comment.inventionId);
    if (invention) {
      const trendingScore = Number(invention.trendingScore || "0") + 0.5;
      await db
        .update(inventions)
        .set({ trendingScore: String(trendingScore) })
        .where(eq(inventions.id, comment.inventionId));
    }
    
    return comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const result = await db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning();
    return result.length > 0;
  }

  // Auction methods
  async getAuctions(status?: string): Promise<Auction[]> {
    let query = db.select().from(auctions);
    if (status) {
      query = query.where(eq(auctions.status, status));
    }
    return await query.orderBy(auctions.endDate);
  }

  async getAuctionsByInvention(inventionId: number): Promise<Auction[]> {
    return await db
      .select()
      .from(auctions)
      .where(eq(auctions.inventionId, inventionId))
      .orderBy(auctions.endDate);
  }

  async getAuction(id: number): Promise<Auction | undefined> {
    const [auction] = await db
      .select()
      .from(auctions)
      .where(eq(auctions.id, id));
    return auction;
  }

  async createAuction(insertAuction: InsertAuction): Promise<Auction> {
    // Apply platform fee
    const fee = await this.getPlatformFee("auction");
    const feePercentage = fee ? Number(fee.percentage) : 5; // Default to 5% if not configured
    
    const auctionWithFee = {
      ...insertAuction,
      platformFee: String(feePercentage),
      currentPrice: insertAuction.startingPrice
    };
    
    const [auction] = await db
      .insert(auctions)
      .values(auctionWithFee)
      .returning();
    
    // Update the invention to mark it as in auction
    await db
      .update(inventions)
      .set({ 
        inAuction: true,
        auctionEndDate: insertAuction.endDate,
        highestBid: insertAuction.startingPrice
      })
      .where(eq(inventions.id, insertAuction.inventionId));
      
    return auction;
  }

  async updateAuction(id: number, data: Partial<Auction>): Promise<Auction | undefined> {
    const [auction] = await db
      .update(auctions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(auctions.id, id))
      .returning();
    return auction;
  }

  async endAuction(id: number, winnerId?: number): Promise<Auction | undefined> {
    const [auction] = await db
      .update(auctions)
      .set({ 
        status: "completed", 
        winnerId, 
        updatedAt: new Date() 
      })
      .where(eq(auctions.id, id))
      .returning();
      
    if (auction) {
      // Update the invention to mark it as no longer in auction
      await db
        .update(inventions)
        .set({ 
          inAuction: false,
          auctionEndDate: null,
          forSale: false // No longer for sale after auction completes
        })
        .where(eq(inventions.id, auction.inventionId));
        
      // Mark winning bid
      if (winnerId) {
        await db
          .update(bids)
          .set({ isWinning: true })
          .where(eq(bids.auctionId, id))
          .where(eq(bids.bidderId, winnerId));
      }
    }
      
    return auction;
  }

  // Bid methods
  async getBids(auctionId: number): Promise<Bid[]> {
    return await db
      .select()
      .from(bids)
      .where(eq(bids.auctionId, auctionId))
      .orderBy(bids.amount, "desc");
  }

  async getUserBids(userId: number): Promise<Bid[]> {
    return await db
      .select()
      .from(bids)
      .where(eq(bids.bidderId, userId))
      .orderBy(bids.timestamp, "desc");
  }

  async createBid(insertBid: InsertBid): Promise<Bid> {
    const [bid] = await db
      .insert(bids)
      .values(insertBid)
      .returning();
    
    // Update auction current price
    await db
      .update(auctions)
      .set({ currentPrice: bid.amount })
      .where(eq(auctions.id, bid.auctionId));
      
    // Update the invention's highest bid
    const auction = await this.getAuction(bid.auctionId);
    if (auction) {
      const invention = await this.getInvention(auction.inventionId);
      if (invention) {
        const trendingScore = Number(invention.trendingScore || "0") + 3;
        await db
          .update(inventions)
          .set({ 
            highestBid: bid.amount,
            trendingScore: String(trendingScore)
          })
          .where(eq(inventions.id, auction.inventionId));
      }
    }
    
    return bid;
  }

  async getHighestBid(auctionId: number): Promise<Bid | undefined> {
    const bids = await db
      .select()
      .from(bids)
      .where(eq(bids.auctionId, auctionId))
      .orderBy(bids.amount, "desc")
      .limit(1);
      
    return bids[0];
  }

  // Platform Fee methods
  async getPlatformFee(feeType: string): Promise<PlatformFee | undefined> {
    const [fee] = await db
      .select()
      .from(platformFees)
      .where(eq(platformFees.feeType, feeType))
      .where(eq(platformFees.isActive, true));
    return fee;
  }

  async getAllPlatformFees(): Promise<PlatformFee[]> {
    return await db.select().from(platformFees);
  }

  async createPlatformFee(insertFee: InsertPlatformFee): Promise<PlatformFee> {
    // Deactivate any existing fee of the same type
    await db
      .update(platformFees)
      .set({ isActive: false })
      .where(eq(platformFees.feeType, insertFee.feeType));
      
    // Create the new fee
    const [fee] = await db
      .insert(platformFees)
      .values(insertFee)
      .returning();
    return fee;
  }

  async updatePlatformFee(id: number, data: Partial<PlatformFee>): Promise<PlatformFee | undefined> {
    const [fee] = await db
      .update(platformFees)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(platformFees.id, id))
      .returning();
    return fee;
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
