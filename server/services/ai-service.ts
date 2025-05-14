import OpenAI from "openai";
import { log } from "../vite";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. Do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * AI Service for invention feedback, 3D model suggestions, and market analysis
 */
export class AIService {
  /**
   * Generate AI feedback for an invention
   * @param inventionDetails The details of the invention to analyze
   * @returns Feedback, suggested improvements, and market analysis
   */
  async generateInventionFeedback(inventionDetails: {
    title: string;
    description: string;
    category: string;
    tags?: string[];
  }) {
    try {
      const prompt = `
        As an expert product developer and market analyst, I need your feedback on the following invention:
        
        Title: ${inventionDetails.title}
        Description: ${inventionDetails.description}
        Category: ${inventionDetails.category}
        Tags: ${inventionDetails.tags?.join(", ") || "None"}
        
        Please provide:
        1. General feedback on the invention concept
        2. Suggested improvements in technical aspects, design, and manufacturing
        3. Market analysis including target market, competitive landscape, and pricing strategy
        
        Format your response as a JSON object with the following structure:
        {
          "feedback": "Your overall analysis of the invention",
          "suggestedImprovements": {
            "technical": "Suggestions for technical improvements",
            "design": "Suggestions for design improvements",
            "manufacturing": "Suggestions for manufacturing improvements"
          },
          "marketAnalysis": {
            "targetMarket": "Description of the target market",
            "competitiveLandscape": "Analysis of the competitive landscape",
            "pricingStrategy": "Recommended pricing strategy"
          }
        }
      `;

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      log(`Error generating invention feedback: ${error}`, "ai-service");
      throw new Error("Failed to generate invention feedback");
    }
  }

  /**
   * Generate 3D model recommendations for an invention
   * @param description Detailed description of the invention
   * @returns Recommendations for 3D model creation
   */
  async generate3DModelSuggestions(description: string) {
    try {
      const prompt = `
        As a 3D modeling expert, please analyze this invention description and provide recommendations for creating a 3D model:
        
        Invention Description: ${description}
        
        Please provide:
        1. Recommended software for modeling this invention
        2. Key components that should be included in the model
        3. Suggested materials and textures
        4. Modeling approach (parametric, sculpting, etc.)
        5. Level of detail recommendations
        
        Format your response as a JSON object with the following structure:
        {
          "recommendedSoftware": ["Software 1", "Software 2"],
          "keyComponents": ["Component 1", "Component 2"],
          "materialsAndTextures": ["Material/texture suggestion 1", "Material/texture suggestion 2"],
          "modelingApproach": "Recommended modeling approach",
          "detailLevel": "Recommended level of detail",
          "additionalNotes": "Any other important considerations"
        }
      `;

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      log(`Error generating 3D model suggestions: ${error}`, "ai-service");
      throw new Error("Failed to generate 3D model suggestions");
    }
  }

  /**
   * Generate market analysis for an invention
   * @param inventionDetails The details of the invention to analyze
   * @returns Detailed market analysis
   */
  async generateMarketAnalysis(inventionDetails: {
    title: string;
    description: string;
    category: string;
    tags?: string[];
  }) {
    try {
      const prompt = `
        As a market research expert, please provide a comprehensive market analysis for the following invention:
        
        Title: ${inventionDetails.title}
        Description: ${inventionDetails.description}
        Category: ${inventionDetails.category}
        Tags: ${inventionDetails.tags?.join(", ") || "None"}
        
        Please provide:
        1. Target market demographics and size
        2. Competitive landscape
        3. Market trends
        4. Pricing strategy
        5. Go-to-market recommendations
        6. Potential investors or partnerships
        
        Format your response as a JSON object with the following structure:
        {
          "targetMarket": {
            "demographics": "Description of target demographics",
            "size": "Estimated market size",
            "growthPotential": "Market growth potential"
          },
          "competitiveLandscape": {
            "directCompetitors": ["Competitor 1", "Competitor 2"],
            "indirectCompetitors": ["Competitor 1", "Competitor 2"],
            "competitiveAdvantage": "Your invention's advantage"
          },
          "marketTrends": ["Trend 1", "Trend 2"],
          "pricingStrategy": {
            "recommendedPriceRange": "Suggested price range",
            "pricingModel": "One-time purchase, subscription, etc."
          },
          "goToMarketStrategy": ["Strategy 1", "Strategy 2"],
          "potentialPartnerships": ["Potential partner 1", "Potential partner 2"]
        }
      `;

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      log(`Error generating market analysis: ${error}`, "ai-service");
      throw new Error("Failed to generate market analysis");
    }
  }
}

// Export singleton instance
export const aiService = new AIService();