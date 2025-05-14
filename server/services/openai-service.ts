import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. Do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

export class OpenAIService {
  /**
   * Generate AI feedback for an invention
   */
  async generateInventionFeedback(inventionDetails: {
    title: string;
    description: string;
    category: string;
    tags?: string[];
  }) {
    const prompt = `
      I want detailed feedback on my invention concept. Here are the details:
      
      Title: ${inventionDetails.title}
      Description: ${inventionDetails.description}
      Category: ${inventionDetails.category}
      Tags: ${inventionDetails.tags ? inventionDetails.tags.join(", ") : "None"}
      
      Please provide comprehensive feedback including:
      1. General assessment of the concept
      2. Technical feasibility
      3. Potential market appeal
      4. Suggested improvements
      5. Manufacturing considerations
      
      Format your response as JSON with these keys:
      - feedback (general overall feedback)
      - suggestedImprovements (with keys: technical, design, manufacturing)
      - marketAnalysis (with keys: targetMarket, competitiveLandscape, pricingStrategy)
    `;

    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { 
            role: "system", 
            content: "You are an expert product developer and invention analyst with deep knowledge of various technologies, manufacturing processes, and market dynamics. Provide helpful, detailed, and actionable feedback."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response from OpenAI");
      }

      return JSON.parse(content);
    } catch (error) {
      console.error("OpenAI error:", error);
      throw new Error("Failed to generate feedback for invention");
    }
  }

  /**
   * Generate 3D model suggestions for an invention
   */
  async generate3DModelSuggestions(description: string) {
    const prompt = `
      I want suggestions for creating a 3D model of my invention:
      
      ${description}
      
      Please provide detailed recommendations in JSON format with these keys:
      - recommendedSoftware (array of software names)
      - keyComponents (array of components that should be included)
      - materialsAndTextures (array of suggested materials and textures)
      - modelingApproach (approach for creating the model)
      - detailLevel (recommended level of detail)
      - additionalNotes (any other suggestions)
    `;

    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { 
            role: "system", 
            content: "You are an expert 3D modeler and product designer with extensive knowledge of CAD software, materials, and manufacturing techniques. Provide detailed and practical modeling guidance."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response from OpenAI");
      }

      return JSON.parse(content);
    } catch (error) {
      console.error("OpenAI error:", error);
      throw new Error("Failed to generate 3D model suggestions");
    }
  }

  /**
   * Generate market analysis for an invention
   */
  async generateMarketAnalysis(inventionDetails: {
    title: string;
    description: string;
    category: string;
    tags?: string[];
  }) {
    const prompt = `
      Please provide a comprehensive market analysis for my invention concept:
      
      Title: ${inventionDetails.title}
      Description: ${inventionDetails.description}
      Category: ${inventionDetails.category}
      Tags: ${inventionDetails.tags ? inventionDetails.tags.join(", ") : "None"}
      
      Format your response as JSON with these keys:
      - targetMarket (with keys: demographics, size, growthPotential)
      - competitiveLandscape (with keys: directCompetitors, indirectCompetitors, competitiveAdvantage)
      - marketTrends (array of relevant trends)
      - pricingStrategy (with keys: recommendedPriceRange, pricingModel)
      - goToMarketStrategy (array of go-to-market approaches)
      - potentialPartnerships (array of potential partnership types or companies)
    `;

    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { 
            role: "system", 
            content: "You are an expert market analyst with deep knowledge of global markets, consumer trends, competitive analysis, and go-to-market strategies. Provide comprehensive and realistic market analysis."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response from OpenAI");
      }

      return JSON.parse(content);
    } catch (error) {
      console.error("OpenAI error:", error);
      throw new Error("Failed to generate market analysis");
    }
  }
  
  /**
   * Generate direct chat response for model assistance
   */
  async generateModelChatResponse(prompt: string, modelContext?: {
    name?: string;
    description?: string;
    components?: any[];
  }) {
    try {
      let fullPrompt = prompt;
      
      // Add model context if available
      if (modelContext) {
        fullPrompt = `
        Context:
        Model Name: ${modelContext.name || 'Unnamed model'}
        Description: ${modelContext.description || 'No description provided'}
        Components: ${modelContext.components ? JSON.stringify(modelContext.components) : 'No components specified'}
        
        User Question: ${prompt}
        `;
      }
      
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are an expert 3D modeling and product design assistant. You provide helpful, concise advice about materials, manufacturing techniques, design approaches, and product development. Your responses are informative, practical, and accessible to non-experts."
          },
          {
            role: "user",
            content: fullPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      return response.choices[0].message.content || "No response generated. Please try again.";
    } catch (error) {
      console.error("Error generating AI chat response:", error);
      throw new Error("Failed to generate chat response");
    }
  }
}

export const openaiService = new OpenAIService();