import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertOpportunitySchema, 
  insertPipelineStageSchema, 
  insertRevenueForecastSchema, 
  insertApiKeySchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Get all opportunities
  app.get("/api/opportunities", async (req: Request, res: Response) => {
    try {
      const opportunities = await storage.getOpportunities();
      res.json(opportunities);
    } catch (error) {
      console.error("Error getting opportunities:", error);
      res.status(500).json({ message: "Failed to get opportunities" });
    }
  });

  // Get a specific opportunity
  app.get("/api/opportunities/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid opportunity ID" });
      }

      const opportunity = await storage.getOpportunity(id);
      if (!opportunity) {
        return res.status(404).json({ message: "Opportunity not found" });
      }

      res.json(opportunity);
    } catch (error) {
      console.error("Error getting opportunity:", error);
      res.status(500).json({ message: "Failed to get opportunity" });
    }
  });

  // Create a new opportunity
  app.post("/api/opportunities", async (req: Request, res: Response) => {
    try {
      const validatedData = insertOpportunitySchema.parse(req.body);
      const opportunity = await storage.createOpportunity(validatedData);
      res.status(201).json(opportunity);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating opportunity:", error);
      res.status(500).json({ message: "Failed to create opportunity" });
    }
  });

  // Update an opportunity
  app.patch("/api/opportunities/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid opportunity ID" });
      }

      // Partial validation - only validate the fields that are provided
      const validatedData = insertOpportunitySchema.partial().parse(req.body);
      
      const updatedOpportunity = await storage.updateOpportunity(id, validatedData);
      if (!updatedOpportunity) {
        return res.status(404).json({ message: "Opportunity not found" });
      }

      res.json(updatedOpportunity);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating opportunity:", error);
      res.status(500).json({ message: "Failed to update opportunity" });
    }
  });

  // Delete an opportunity
  app.delete("/api/opportunities/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid opportunity ID" });
      }

      const deleted = await storage.deleteOpportunity(id);
      if (!deleted) {
        return res.status(404).json({ message: "Opportunity not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      res.status(500).json({ message: "Failed to delete opportunity" });
    }
  });

  // Get all pipeline stages
  app.get("/api/pipeline-stages", async (req: Request, res: Response) => {
    try {
      const stages = await storage.getPipelineStages();
      res.json(stages);
    } catch (error) {
      console.error("Error getting pipeline stages:", error);
      res.status(500).json({ message: "Failed to get pipeline stages" });
    }
  });

  // Create a new pipeline stage
  app.post("/api/pipeline-stages", async (req: Request, res: Response) => {
    try {
      const validatedData = insertPipelineStageSchema.parse(req.body);
      const stage = await storage.createPipelineStage(validatedData);
      res.status(201).json(stage);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating pipeline stage:", error);
      res.status(500).json({ message: "Failed to create pipeline stage" });
    }
  });

  // Update a pipeline stage
  app.patch("/api/pipeline-stages/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid pipeline stage ID" });
      }

      const validatedData = insertPipelineStageSchema.partial().parse(req.body);
      
      const updatedStage = await storage.updatePipelineStage(id, validatedData);
      if (!updatedStage) {
        return res.status(404).json({ message: "Pipeline stage not found" });
      }

      res.json(updatedStage);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating pipeline stage:", error);
      res.status(500).json({ message: "Failed to update pipeline stage" });
    }
  });

  // Get revenue forecast
  app.get("/api/revenue-forecast", async (req: Request, res: Response) => {
    try {
      const forecast = await storage.getRevenueForecast();
      res.json(forecast);
    } catch (error) {
      console.error("Error getting revenue forecast:", error);
      res.status(500).json({ message: "Failed to get revenue forecast" });
    }
  });

  // Update revenue forecast
  app.patch("/api/revenue-forecast/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid forecast ID" });
      }

      const validatedData = insertRevenueForecastSchema.partial().parse(req.body);
      
      const updatedForecast = await storage.updateRevenueForecast(id, validatedData);
      if (!updatedForecast) {
        return res.status(404).json({ message: "Forecast not found" });
      }

      res.json(updatedForecast);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating revenue forecast:", error);
      res.status(500).json({ message: "Failed to update revenue forecast" });
    }
  });

  // Create new revenue forecast
  app.post("/api/revenue-forecast", async (req: Request, res: Response) => {
    try {
      const validatedData = insertRevenueForecastSchema.parse(req.body);
      const forecast = await storage.createRevenueForecast(validatedData);
      res.status(201).json(forecast);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating revenue forecast:", error);
      res.status(500).json({ message: "Failed to create revenue forecast" });
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

  // Get dashboard metrics
  app.get("/api/dashboard-metrics", async (req: Request, res: Response) => {
    try {
      const opportunities = await storage.getOpportunities();
      const pipelineStages = await storage.getPipelineStages();
      
      // Calculate metrics
      const pipelineValue = opportunities.reduce((sum, opp) => sum + Number(opp.value), 0);
      const openOpportunities = opportunities.length;
      
      // Calculate win rate (assuming closing stage with >90% probability is a win)
      const wonOpportunities = opportunities.filter(opp => opp.stage === "Closing" && opp.probability > 90).length;
      const winRate = openOpportunities > 0 ? Math.round((wonOpportunities / openOpportunities) * 100) : 0;
      
      // Calculate average deal size
      const avgDealSize = openOpportunities > 0 ? Math.round(pipelineValue / openOpportunities) : 0;
      
      // Monthly differences (mock data for now)
      const metrics = {
        pipelineValue,
        pipelineValueChange: 12, // Percentage change from last month
        openOpportunities,
        openOpportunitiesChange: 5,
        winRate,
        winRateChange: -3,
        avgDealSize,
        avgDealSizeChange: 8
      };
      
      res.json(metrics);
    } catch (error) {
      console.error("Error getting dashboard metrics:", error);
      res.status(500).json({ message: "Failed to get dashboard metrics" });
    }
  });

  return httpServer;
}
