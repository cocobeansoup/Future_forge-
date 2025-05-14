import { 
  users, User, InsertUser,
  opportunities, Opportunity, InsertOpportunity,
  pipelineStages, PipelineStage, InsertPipelineStage,
  revenueForecast, RevenueForecast, InsertRevenueForecast,
  apiKeys, ApiKey, InsertApiKey
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Opportunity methods
  getOpportunities(): Promise<Opportunity[]>;
  getOpportunity(id: number): Promise<Opportunity | undefined>;
  createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity>;
  updateOpportunity(id: number, opportunity: Partial<InsertOpportunity>): Promise<Opportunity | undefined>;
  deleteOpportunity(id: number): Promise<boolean>;
  
  // Pipeline Stage methods
  getPipelineStages(): Promise<PipelineStage[]>;
  getPipelineStage(id: number): Promise<PipelineStage | undefined>;
  createPipelineStage(stage: InsertPipelineStage): Promise<PipelineStage>;
  updatePipelineStage(id: number, stage: Partial<InsertPipelineStage>): Promise<PipelineStage | undefined>;
  
  // Revenue Forecast methods
  getRevenueForecast(): Promise<RevenueForecast[]>;
  updateRevenueForecast(id: number, forecast: Partial<InsertRevenueForecast>): Promise<RevenueForecast | undefined>;
  createRevenueForecast(forecast: InsertRevenueForecast): Promise<RevenueForecast>;
  
  // API Key methods
  getApiKeys(userId: number): Promise<ApiKey[]>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  deleteApiKey(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private opportunities: Map<number, Opportunity>;
  private pipelineStages: Map<number, PipelineStage>;
  private revenueForecast: Map<number, RevenueForecast>;
  private apiKeys: Map<number, ApiKey>;
  
  private userIdCounter: number;
  private opportunityIdCounter: number;
  private pipelineStageIdCounter: number;
  private revenueForecastIdCounter: number;
  private apiKeyIdCounter: number;

  constructor() {
    this.users = new Map();
    this.opportunities = new Map();
    this.pipelineStages = new Map();
    this.revenueForecast = new Map();
    this.apiKeys = new Map();
    
    this.userIdCounter = 1;
    this.opportunityIdCounter = 1;
    this.pipelineStageIdCounter = 1;
    this.revenueForecastIdCounter = 1;
    this.apiKeyIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Initialize pipeline stages
    const stageData: InsertPipelineStage[] = [
      { name: "Qualification", value: 345000, color: "blue" },
      { name: "Proposal", value: 720000, color: "indigo" },
      { name: "Negotiation", value: 1100000, color: "purple" },
      { name: "Closing", value: 235000, color: "green" }
    ];
    
    stageData.forEach(stage => this.createPipelineStage(stage));
    
    // Initialize revenue forecast data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const actualValues = [120000, 180000, 220000, 190000, 270000, 150000, 0, 0];
    const projectedValues = [0, 0, 0, 0, 0, 0, 320000, 260000];
    
    months.forEach((month, index) => {
      this.createRevenueForecast({
        month,
        year: 2023,
        actualRevenue: actualValues[index] > 0 ? actualValues[index] : undefined,
        projectedRevenue: projectedValues[index] > 0 ? projectedValues[index] : undefined
      });
    });
    
    // Create a default user
    this.createUser({
      username: "john.doe",
      password: "password123", // In a real app, this would be hashed
      name: "John Doe",
      role: "Procurement Manager",
      avatar: undefined
    });
    
    // Create sample opportunities
    const opportunitiesData: InsertOpportunity[] = [
      {
        name: "Cloud Infrastructure Upgrade",
        companyName: "Acme Corp",
        stage: "Proposal",
        value: 125000,
        probability: 65,
        closeDate: new Date("2023-08-15"),
        notes: "Pending technical review"
      },
      {
        name: "Enterprise Software License",
        companyName: "TechGiant Inc",
        stage: "Negotiation",
        value: 320000,
        probability: 80,
        closeDate: new Date("2023-07-30"),
        notes: "Discussing payment terms"
      },
      {
        name: "Network Security Implementation",
        companyName: "Globex Corporation",
        stage: "Qualification",
        value: 85000,
        probability: 30,
        closeDate: new Date("2023-09-22"),
        notes: "Initial requirements gathering"
      },
      {
        name: "Data Center Equipment",
        companyName: "Initech LLC",
        stage: "Closing",
        value: 220000,
        probability: 95,
        closeDate: new Date("2023-07-05"),
        notes: "Final contract review"
      },
      {
        name: "IT Consulting Services",
        companyName: "Umbrella Industries",
        stage: "Proposal",
        value: 145000,
        probability: 50,
        closeDate: new Date("2023-08-28"),
        notes: "Preparing statement of work"
      }
    ];
    
    opportunitiesData.forEach(opp => this.createOpportunity(opp));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Opportunity methods
  async getOpportunities(): Promise<Opportunity[]> {
    return Array.from(this.opportunities.values());
  }

  async getOpportunity(id: number): Promise<Opportunity | undefined> {
    return this.opportunities.get(id);
  }

  async createOpportunity(insertOpportunity: InsertOpportunity): Promise<Opportunity> {
    const id = this.opportunityIdCounter++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const opportunity = { ...insertOpportunity, id, createdAt, updatedAt };
    this.opportunities.set(id, opportunity);
    return opportunity;
  }

  async updateOpportunity(id: number, updateData: Partial<InsertOpportunity>): Promise<Opportunity | undefined> {
    const opportunity = this.opportunities.get(id);
    if (!opportunity) return undefined;
    
    const updatedOpportunity = { 
      ...opportunity, 
      ...updateData, 
      updatedAt: new Date() 
    };
    
    this.opportunities.set(id, updatedOpportunity);
    return updatedOpportunity;
  }

  async deleteOpportunity(id: number): Promise<boolean> {
    return this.opportunities.delete(id);
  }

  // Pipeline Stage methods
  async getPipelineStages(): Promise<PipelineStage[]> {
    return Array.from(this.pipelineStages.values());
  }

  async getPipelineStage(id: number): Promise<PipelineStage | undefined> {
    return this.pipelineStages.get(id);
  }

  async createPipelineStage(insertStage: InsertPipelineStage): Promise<PipelineStage> {
    const id = this.pipelineStageIdCounter++;
    const stage = { ...insertStage, id };
    this.pipelineStages.set(id, stage);
    return stage;
  }

  async updatePipelineStage(id: number, updateData: Partial<InsertPipelineStage>): Promise<PipelineStage | undefined> {
    const stage = this.pipelineStages.get(id);
    if (!stage) return undefined;
    
    const updatedStage = { 
      ...stage, 
      ...updateData
    };
    
    this.pipelineStages.set(id, updatedStage);
    return updatedStage;
  }

  // Revenue Forecast methods
  async getRevenueForecast(): Promise<RevenueForecast[]> {
    return Array.from(this.revenueForecast.values());
  }

  async createRevenueForecast(insertForecast: InsertRevenueForecast): Promise<RevenueForecast> {
    const id = this.revenueForecastIdCounter++;
    const forecast = { ...insertForecast, id };
    this.revenueForecast.set(id, forecast);
    return forecast;
  }

  async updateRevenueForecast(id: number, updateData: Partial<InsertRevenueForecast>): Promise<RevenueForecast | undefined> {
    const forecast = this.revenueForecast.get(id);
    if (!forecast) return undefined;
    
    const updatedForecast = { 
      ...forecast, 
      ...updateData
    };
    
    this.revenueForecast.set(id, updatedForecast);
    return updatedForecast;
  }

  // API Key methods
  async getApiKeys(userId: number): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values()).filter(key => key.userId === userId);
  }

  async createApiKey(insertApiKey: InsertApiKey): Promise<ApiKey> {
    const id = this.apiKeyIdCounter++;
    const createdAt = new Date();
    const apiKey = { ...insertApiKey, id, createdAt };
    this.apiKeys.set(id, apiKey);
    return apiKey;
  }

  async deleteApiKey(id: number): Promise<boolean> {
    return this.apiKeys.delete(id);
  }
}

export const storage = new MemStorage();
