import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertInventionSchema,
  insertInvestmentSchema,
  insertAiFeedbackSchema,
  insertInventionUpdateSchema,
  insertCommentSchema,
  insertApiKeySchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Register new user
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      // Hash the password before storing
      const { password, ...userData } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Handle inventor trial period - if user is an inventor, give them a 7-day trial
      let subscriptionData = {};
      if (userData.isInventor) {
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7); // 7-day trial
        
        subscriptionData = {
          subscriptionActive: true,
          subscriptionEndDate: trialEndDate,
          trialUsed: true
        };
      }
      
      const validatedData = insertUserSchema.parse({
        ...userData,
        ...subscriptionData,
        password: hashedPassword,
      });
      
      const user = await storage.createUser(validatedData);
      
      // Don't send the password back
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Login user
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't send the password back
      const { password: _, ...userWithoutPassword } = user;
      
      // In a real app, you would create a session or token here
      res.status(200).json({
        user: userWithoutPassword,
        token: "mock-token-for-demo-purposes"
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Failed to log in" });
    }
  });

  // User profile
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't send the password back
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ message: "Failed to get user profile" });
    }
  });

  // Update user profile
  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Don't allow updating passwords through this endpoint
      const { password, ...updateData } = req.body;
      
      const validatedData = insertUserSchema.partial().parse(updateData);
      
      const updatedUser = await storage.updateUser(id, validatedData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't send the password back
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Get all inventions
  app.get("/api/inventions", async (req: Request, res: Response) => {
    try {
      const inventions = await storage.getInventions();
      res.json(inventions);
    } catch (error) {
      console.error("Error getting inventions:", error);
      res.status(500).json({ message: "Failed to get inventions" });
    }
  });

  // Get inventions by category
  app.get("/api/inventions/category/:category", async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const inventions = await storage.getInventionsByCategory(category);
      res.json(inventions);
    } catch (error) {
      console.error("Error getting inventions by category:", error);
      res.status(500).json({ message: "Failed to get inventions by category" });
    }
  });

  // Get inventions by user
  app.get("/api/users/:id/inventions", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const inventions = await storage.getInventionsByUser(userId);
      res.json(inventions);
    } catch (error) {
      console.error("Error getting user inventions:", error);
      res.status(500).json({ message: "Failed to get user inventions" });
    }
  });

  // Get a specific invention
  app.get("/api/inventions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invention ID" });
      }

      const invention = await storage.getInvention(id);
      if (!invention) {
        return res.status(404).json({ message: "Invention not found" });
      }

      res.json(invention);
    } catch (error) {
      console.error("Error getting invention:", error);
      res.status(500).json({ message: "Failed to get invention" });
    }
  });

  // Create a new invention
  app.post("/api/inventions", async (req: Request, res: Response) => {
    try {
      const validatedData = insertInventionSchema.parse(req.body);
      const invention = await storage.createInvention(validatedData);
      res.status(201).json(invention);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating invention:", error);
      res.status(500).json({ message: "Failed to create invention" });
    }
  });

  // Update an invention
  app.patch("/api/inventions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invention ID" });
      }

      const validatedData = insertInventionSchema.partial().parse(req.body);
      
      const updatedInvention = await storage.updateInvention(id, validatedData);
      if (!updatedInvention) {
        return res.status(404).json({ message: "Invention not found" });
      }

      res.json(updatedInvention);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating invention:", error);
      res.status(500).json({ message: "Failed to update invention" });
    }
  });

  // Delete an invention
  app.delete("/api/inventions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invention ID" });
      }

      const deleted = await storage.deleteInvention(id);
      if (!deleted) {
        return res.status(404).json({ message: "Invention not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting invention:", error);
      res.status(500).json({ message: "Failed to delete invention" });
    }
  });

  // Get investments for an invention
  app.get("/api/inventions/:id/investments", async (req: Request, res: Response) => {
    try {
      const inventionId = parseInt(req.params.id);
      if (isNaN(inventionId)) {
        return res.status(400).json({ message: "Invalid invention ID" });
      }

      const investments = await storage.getInvestments(inventionId);
      res.json(investments);
    } catch (error) {
      console.error("Error getting investments:", error);
      res.status(500).json({ message: "Failed to get investments" });
    }
  });

  // Get investments by user
  app.get("/api/users/:id/investments", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const investments = await storage.getUserInvestments(userId);
      res.json(investments);
    } catch (error) {
      console.error("Error getting user investments:", error);
      res.status(500).json({ message: "Failed to get user investments" });
    }
  });

  // Create a new investment
  app.post("/api/investments", async (req: Request, res: Response) => {
    try {
      const validatedData = insertInvestmentSchema.parse(req.body);
      const investment = await storage.createInvestment(validatedData);
      
      // Update the invention's current funding
      const invention = await storage.getInvention(investment.inventionId);
      if (invention) {
        const currentFunding = Number(invention.currentFunding || 0);
        const newFunding = currentFunding + Number(investment.amount);
        
        // Cast to any to allow currentFunding property
        await storage.updateInvention(invention.id, { 
          currentFunding: newFunding.toString() 
        } as any);
      }
      
      res.status(201).json(investment);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating investment:", error);
      res.status(500).json({ message: "Failed to create investment" });
    }
  });

  // Update investment status
  app.patch("/api/investments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid investment ID" });
      }

      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedInvestment = await storage.updateInvestmentStatus(id, status);
      if (!updatedInvestment) {
        return res.status(404).json({ message: "Investment not found" });
      }

      res.json(updatedInvestment);
    } catch (error) {
      console.error("Error updating investment status:", error);
      res.status(500).json({ message: "Failed to update investment status" });
    }
  });

  // Get AI feedback for an invention
  app.get("/api/inventions/:id/ai-feedback", async (req: Request, res: Response) => {
    try {
      const inventionId = parseInt(req.params.id);
      if (isNaN(inventionId)) {
        return res.status(400).json({ message: "Invalid invention ID" });
      }

      const feedback = await storage.getAIFeedback(inventionId);
      res.json(feedback);
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      res.status(500).json({ message: "Failed to get AI feedback" });
    }
  });

  // Create AI feedback for an invention
  app.post("/api/ai-feedback", async (req: Request, res: Response) => {
    try {
      const validatedData = insertAiFeedbackSchema.parse(req.body);
      const feedback = await storage.createAIFeedback(validatedData);
      res.status(201).json(feedback);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating AI feedback:", error);
      res.status(500).json({ message: "Failed to create AI feedback" });
    }
  });

  // Get updates for an invention
  app.get("/api/inventions/:id/updates", async (req: Request, res: Response) => {
    try {
      const inventionId = parseInt(req.params.id);
      if (isNaN(inventionId)) {
        return res.status(400).json({ message: "Invalid invention ID" });
      }

      const updates = await storage.getInventionUpdates(inventionId);
      res.json(updates);
    } catch (error) {
      console.error("Error getting invention updates:", error);
      res.status(500).json({ message: "Failed to get invention updates" });
    }
  });

  // Create update for an invention
  app.post("/api/invention-updates", async (req: Request, res: Response) => {
    try {
      const validatedData = insertInventionUpdateSchema.parse(req.body);
      const update = await storage.createInventionUpdate(validatedData);
      res.status(201).json(update);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating invention update:", error);
      res.status(500).json({ message: "Failed to create invention update" });
    }
  });

  // Get comments for an invention
  app.get("/api/inventions/:id/comments", async (req: Request, res: Response) => {
    try {
      const inventionId = parseInt(req.params.id);
      if (isNaN(inventionId)) {
        return res.status(400).json({ message: "Invalid invention ID" });
      }

      const comments = await storage.getComments(inventionId);
      res.json(comments);
    } catch (error) {
      console.error("Error getting comments:", error);
      res.status(500).json({ message: "Failed to get comments" });
    }
  });

  // Create comment for an invention
  app.post("/api/comments", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Delete a comment
  app.delete("/api/comments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }

      const deleted = await storage.deleteComment(id);
      if (!deleted) {
        return res.status(404).json({ message: "Comment not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // Get dashboard metrics
  app.get("/api/dashboard-metrics", async (req: Request, res: Response) => {
    try {
      const inventions = await storage.getInventions();
      
      // Calculate metrics
      const totalInventions = inventions.length;
      const completedInventions = inventions.filter(inv => inv.status === "completed").length;
      const inProgressInventions = inventions.filter(inv => inv.status === "in-progress").length;
      const prototypes = inventions.filter(inv => inv.status === "prototype").length;

      // Total funding across all inventions
      const totalFunding = inventions.reduce((sum, inv) => sum + Number(inv.currentFunding || 0), 0);
      
      // Calculate funding goal progress
      const totalFundingGoals = inventions.reduce((sum, inv) => sum + Number(inv.fundingGoal || 0), 0);
      const fundingProgress = totalFundingGoals > 0 ? Math.round((totalFunding / totalFundingGoals) * 100) : 0;
      
      const metrics = {
        totalInventions,
        completedInventions,
        inProgressInventions,
        prototypes,
        totalFunding,
        fundingProgress,
        forSaleCount: inventions.filter(inv => inv.forSale).length
      };
      
      res.json(metrics);
    } catch (error) {
      console.error("Error getting dashboard metrics:", error);
      res.status(500).json({ message: "Failed to get dashboard metrics" });
    }
  });

  // Get API keys for a user
  app.get("/api/api-keys", async (req: Request, res: Response) => {
    try {
      // In a real app, this would come from auth middleware
      const userId = 1; // For demo purposes, using the default user
      const apiKeys = await storage.getApiKeys(userId);
      
      // Don't return the actual keys in the response for security
      const safeApiKeys = apiKeys.map(key => ({
        id: key.id,
        name: key.name,
        active: key.active,
        createdAt: key.createdAt,
        key: `${key.key.substring(0, 8)}...${key.key.substring(key.key.length - 4)}`
      }));
      
      res.json(safeApiKeys);
    } catch (error) {
      console.error("Error getting API keys:", error);
      res.status(500).json({ message: "Failed to get API keys" });
    }
  });

  // Create a new API key
  app.post("/api/api-keys", async (req: Request, res: Response) => {
    try {
      // In a real app, userId would come from auth middleware
      const userId = 1; // For demo purposes, using the default user
      
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "API key name is required" });
      }
      
      // Generate a random API key
      const key = crypto.randomBytes(24).toString('hex');
      
      const apiKeyData = {
        name,
        key,
        userId,
        active: true
      };
      
      const validatedData = insertApiKeySchema.parse(apiKeyData);
      const apiKey = await storage.createApiKey(validatedData);
      
      res.status(201).json({
        id: apiKey.id,
        name: apiKey.name,
        key: apiKey.key, // Return the full key only when it's created
        active: apiKey.active,
        createdAt: apiKey.createdAt
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating API key:", error);
      res.status(500).json({ message: "Failed to create API key" });
    }
  });

  // Delete an API key
  app.delete("/api/api-keys/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid API key ID" });
      }

      const deleted = await storage.deleteApiKey(id);
      if (!deleted) {
        return res.status(404).json({ message: "API key not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting API key:", error);
      res.status(500).json({ message: "Failed to delete API key" });
    }
  });

  // Subscription endpoints
  app.post("/api/subscription/subscribe", async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // If already subscribed, extend by one month
      let subscriptionEndDate = new Date();
      if (user.subscriptionActive && user.subscriptionEndDate) {
        subscriptionEndDate = new Date(user.subscriptionEndDate);
      }
      
      // Add one month
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
      
      const updatedUser = await storage.updateUser(userId, {
        subscriptionActive: true,
        subscriptionEndDate,
      });
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update subscription" });
      }
      
      // Don't send the password back
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error subscribing:", error);
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });
  
  app.get("/api/subscription/status/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if subscription has expired
      if (user.subscriptionActive && user.subscriptionEndDate) {
        const now = new Date();
        const endDate = new Date(user.subscriptionEndDate);
        
        // If subscription has expired, update the user
        if (now > endDate) {
          await storage.updateUser(userId, {
            subscriptionActive: false,
          });
          
          return res.json({
            active: false,
            endDate: null,
            daysRemaining: 0,
            onTrial: false
          });
        }
        
        // Calculate days remaining
        const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        return res.json({
          active: true,
          endDate: user.subscriptionEndDate,
          daysRemaining,
          onTrial: user.trialUsed && daysRemaining <= 7
        });
      }
      
      res.json({
        active: false,
        endDate: null,
        daysRemaining: 0,
        onTrial: false
      });
    } catch (error) {
      console.error("Error checking subscription status:", error);
      res.status(500).json({ message: "Failed to check subscription status" });
    }
  });

  return httpServer;
}
