import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Types for AI responses
interface AIFeedback {
  feedback: string;
  suggestedImprovements: {
    technical: string;
    design: string;
    manufacturing: string;
  };
  marketAnalysis: {
    targetMarket: string;
    competitiveLandscape: string;
    pricingStrategy: string;
  };
}

interface ModelSuggestions {
  recommendedSoftware: string[];
  keyComponents: string[];
  materialsAndTextures: string[];
  modelingApproach: string;
  detailLevel: string;
  additionalNotes: string;
}

interface ModelDefinition {
  name: string;
  shapes: Array<{
    type: string;
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    depth: number;
    color: string;
    rotation: {x: number, y: number, z: number};
    material: string;
  }>;
}

// Main component
export default function AIAssistant() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  
  // Form states
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  
  // Result states
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"feedback" | "model" | "market">("feedback");
  const [modelSuggestions, setModelSuggestions] = useState<ModelSuggestions | null>(null);
  const [marketAnalysis, setMarketAnalysis] = useState<any>(null);
  
  // For model generation
  const [generatedModel, setGeneratedModel] = useState<ModelDefinition | null>(null);
  const [showModelPreview, setShowModelPreview] = useState(false);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "You must be logged in to use the AI Assistant.",
        variant: "destructive",
      });
      return;
    }

    if (!title || !description || !category) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Process the type of analysis based on active tab
      if (activeTab === "feedback") {
        // Simulate generating general feedback
        setTimeout(() => {
          setResults({
            feedback: "Your invention concept shows promise with a good balance of innovation and practicality. The focus on energy efficiency is particularly relevant in today's market.",
            suggestions: [
              "Consider using recyclable materials to enhance sustainability credentials",
              "The form factor could be simplified for more cost-effective manufacturing", 
              "Market research indicates strong potential in the smart home sector",
              "Adding modular components would increase versatility and market appeal"
            ]
          });
          
          setIsLoading(false);
          toast({
            title: "AI Analysis Complete",
            description: "Your invention has been analyzed!",
          });
        }, 2000);
      } 
      else if (activeTab === "model") {
        // Simulate generating 3D model suggestions
        setTimeout(() => {
          const suggestions: ModelSuggestions = {
            recommendedSoftware: ["Blender", "Fusion 360", "TinkerCAD", "OnShape"],
            keyComponents: [
              "Main housing (rounded cube form)",
              "Sensor array (cylindrical attachment)",
              "Interface panel (flat rectangular surface)",
              "Mounting brackets"
            ],
            materialsAndTextures: [
              "ABS plastic for main housing",
              "Transparent acrylic for display areas",
              "Silicone gaskets for waterproofing",
              "Brushed aluminum finish for premium appearance"
            ],
            modelingApproach: "Start with basic primitive shapes and use boolean operations to create cutouts and join components. Focus on creating a clean, modern aesthetic with ergonomic considerations.",
            detailLevel: "Medium detail is sufficient for initial prototyping. High-poly details can be added later for marketing visuals.",
            additionalNotes: "Consider designing for manufacturing by avoiding undercuts and maintaining consistent wall thickness. Make sure to include ventilation if components generate heat."
          };
          
          setModelSuggestions(suggestions);
          
          // Also create a basic model definition that could be imported
          const model: ModelDefinition = {
            name: title,
            shapes: [
              {
                type: 'cube',
                x: 100,
                y: 150,
                z: 0,
                width: 120,
                height: 80,
                depth: 40,
                color: '#4A7FB5',
                rotation: {x: 0, y: 0, z: 0},
                material: 'plastic'
              },
              {
                type: 'cylinder',
                x: 180,
                y: 120,
                z: 0,
                width: 30,
                height: 60,
                depth: 30,
                color: '#5CB57F',
                rotation: {x: 0, y: 0, z: 0},
                material: 'metal'
              }
            ]
          };
          
          setGeneratedModel(model);
          setIsLoading(false);
          
          toast({
            title: "Model Suggestions Generated",
            description: "AI has created 3D modeling suggestions for your invention!",
          });
        }, 2500);
      }
      else if (activeTab === "market") {
        // Simulate generating market analysis
        setTimeout(() => {
          setMarketAnalysis({
            targetMarket: {
              demographics: "Tech-savvy homeowners, 28-55 years old, middle to upper income, environmentally conscious consumers.",
              size: "The global smart home market was valued at $78.3 billion in 2024 and is expected to grow to $182.6 billion by 2028.",
              growthPotential: "Strong growth potential with 18.5% CAGR in the smart home energy management segment specifically."
            },
            competitiveLandscape: {
              directCompetitors: ["EcoBee", "Nest", "Sense Energy Monitor", "Emporia Vue"],
              indirectCompetitors: ["DIY energy monitoring solutions", "Traditional energy meters", "Smart home hubs with partial energy features"],
              competitiveAdvantage: "Your product combines real-time monitoring with predictive analytics and offers easier installation than most competitors."
            },
            marketTrends: [
              "Increasing demand for energy-efficient smart home products",
              "Growing consumer awareness about carbon footprint reduction",
              "Rise in integration with voice assistants and other smart home ecosystems",
              "Shift toward data-driven insights rather than simple monitoring"
            ],
            pricingStrategy: {
              recommendedPriceRange: "$129-$179 for the base unit",
              pricingModel: "Consider a freemium subscription model for advanced analytics features ($5-$10/month)"
            },
            goToMarketStrategy: [
              "Focus on direct-to-consumer through e-commerce initially",
              "Pursue partnerships with smart home installation services",
              "Create content marketing highlighting energy savings",
              "Consider crowdfunding for initial validation and awareness"
            ]
          });
          
          setIsLoading(false);
          
          toast({
            title: "Market Analysis Complete",
            description: "AI has analyzed the market potential for your invention!",
          });
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      
      toast({
        title: "Error",
        description: "Failed to analyze your invention. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to export the generated model to the workspace
  const exportToWorkspace = () => {
    if (!generatedModel) return;
    
    // Save model to localStorage for demo purposes
    // In a real implementation, this would save to a database
    localStorage.setItem('aiGeneratedModel', JSON.stringify(generatedModel));
    
    toast({
      title: "Model Exported",
      description: "The AI-suggested model has been exported to the 3D workspace.",
    });
    
    // Navigate to the workspace
    setLocation("/model-workspace");
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">AI Assistant</h1>
          <p className="text-xl mt-2">
            Get AI-powered feedback and suggestions for your invention
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/model-workspace">
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Open 3D Workspace
            </button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Panel */}
        <div className="md:col-span-1">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Describe Your Invention</h2>
            
            {/* Tab Selection */}
            <div className="mb-6">
              <div className="flex border rounded overflow-hidden">
                <button 
                  className={`flex-1 py-2 px-4 ${activeTab === 'feedback' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                  onClick={() => setActiveTab('feedback')}
                >
                  Feedback
                </button>
                <button 
                  className={`flex-1 py-2 px-4 ${activeTab === 'model' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                  onClick={() => setActiveTab('model')}
                >
                  3D Model
                </button>
                <button 
                  className={`flex-1 py-2 px-4 ${activeTab === 'market' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                  onClick={() => setActiveTab('market')}
                >
                  Market
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Select what type of AI assistance you need
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Invention Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Smart Home Energy Monitor"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded h-32"
                  placeholder="Describe your invention in detail..."
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="technology">Technology</option>
                  <option value="health">Health & Wellness</option>
                  <option value="home">Home & Living</option>
                  <option value="environment">Environment</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Tags (optional)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="eco-friendly, sustainable, smart-home"
                />
                <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
              </div>
              
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </div>
                ) : (
                  activeTab === 'feedback' ? "Generate AI Feedback" : 
                  activeTab === 'model' ? "Generate 3D Model Ideas" : 
                  "Analyze Market Potential"
                )}
              </button>
            </form>
          </div>
        </div>
        
        {/* Results Panel */}
        <div className="md:col-span-2">
          {/* Feedback Results */}
          {activeTab === 'feedback' && (
            <div className="bg-gray-100 p-6 rounded-lg h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">AI Feedback</h2>
                {results && (
                  <div className="text-gray-500 text-sm">
                    Analysis based on {title}
                  </div>
                )}
              </div>
              
              {!results ? (
                <div className="text-center py-12 h-full flex flex-col items-center justify-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-gray-500">
                    Fill out the form and click "Generate AI Feedback" to receive feedback on your invention
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">General Feedback</h3>
                    <p className="text-gray-700">{results.feedback}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Suggested Improvements</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {results.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="text-gray-700">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-between">
                    <button 
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center"
                      onClick={() => setActiveTab('model')}
                    >
                      Get 3D Model Suggestions
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                    
                    <button 
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                      onClick={() => setActiveTab('market')}
                    >
                      Get Market Analysis
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* 3D Model Suggestions */}
          {activeTab === 'model' && (
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">3D Model Suggestions</h2>
                {modelSuggestions && (
                  <div className="text-gray-500 text-sm">
                    Based on {title}
                  </div>
                )}
              </div>
              
              {!modelSuggestions ? (
                <div className="text-center py-12 h-full flex flex-col items-center justify-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                  <p className="text-gray-500">
                    Fill out the form and click "Generate 3D Model Ideas" to receive modeling suggestions
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Preview of the generated model (simplified) */}
                  {generatedModel && (
                    <div className="bg-white p-4 rounded-md shadow-sm mb-5">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold">Model Preview</h3>
                        <button
                          onClick={() => setShowModelPreview(!showModelPreview)}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          {showModelPreview ? "Hide Preview" : "Show Preview"}
                        </button>
                      </div>
                      
                      {showModelPreview && (
                        <div className="border rounded-md h-56 bg-gray-50 flex items-center justify-center mb-3">
                          <div className="text-center">
                            <p className="text-gray-500 mb-2">Basic model visualization</p>
                            <div className="flex justify-center gap-4">
                              {generatedModel.shapes.map((shape, index) => (
                                <div key={index} style={{width: '50px', height: '50px', backgroundColor: shape.color, borderRadius: shape.type === 'cylinder' || shape.type === 'sphere' ? '50%' : '0'}}></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={exportToWorkspace}
                        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Export to 3D Workspace
                      </button>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <h3 className="text-lg font-semibold mb-3">Recommended Software</h3>
                      <div className="flex flex-wrap gap-2">
                        {modelSuggestions.recommendedSoftware.map((software, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {software}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <h3 className="text-lg font-semibold mb-3">Materials & Textures</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {modelSuggestions.materialsAndTextures.map((material, index) => (
                          <li key={index}>{material}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">Key Components</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {modelSuggestions.keyComponents.map((component, index) => (
                        <li key={index}>{component}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">Modeling Approach</h3>
                    <p className="text-gray-700">{modelSuggestions.modelingApproach}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <h3 className="text-lg font-semibold mb-3">Detail Level</h3>
                      <p className="text-gray-700">{modelSuggestions.detailLevel}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <h3 className="text-lg font-semibold mb-3">Additional Notes</h3>
                      <p className="text-gray-700">{modelSuggestions.additionalNotes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Market Analysis */}
          {activeTab === 'market' && (
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Market Analysis</h2>
                {marketAnalysis && (
                  <div className="text-gray-500 text-sm">
                    Analysis for {title}
                  </div>
                )}
              </div>
              
              {!marketAnalysis ? (
                <div className="text-center py-12 h-full flex flex-col items-center justify-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  <p className="text-gray-500">
                    Fill out the form and click "Analyze Market Potential" to get market insights
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">Target Market</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-800">Demographics</h4>
                        <p className="text-gray-700">{marketAnalysis.targetMarket.demographics}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Market Size</h4>
                        <p className="text-gray-700">{marketAnalysis.targetMarket.size}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Growth Potential</h4>
                        <p className="text-gray-700">{marketAnalysis.targetMarket.growthPotential}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">Competitive Landscape</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-800">Direct Competitors</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {marketAnalysis.competitiveLandscape.directCompetitors.map((competitor: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                              {competitor}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Indirect Competitors</h4>
                        <ul className="list-disc pl-5 mt-1 text-gray-700">
                          {marketAnalysis.competitiveLandscape.indirectCompetitors.map((competitor: string, index: number) => (
                            <li key={index}>{competitor}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Your Competitive Advantage</h4>
                        <p className="text-gray-700">{marketAnalysis.competitiveLandscape.competitiveAdvantage}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <h3 className="text-lg font-semibold mb-3">Market Trends</h3>
                      <ul className="list-disc pl-5 text-gray-700">
                        {marketAnalysis.marketTrends.map((trend: string, index: number) => (
                          <li key={index} className="mb-1">{trend}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <h3 className="text-lg font-semibold mb-3">Pricing Strategy</h3>
                      <div>
                        <h4 className="font-medium text-gray-800">Recommended Price Range</h4>
                        <p className="text-gray-700 mb-2">{marketAnalysis.pricingStrategy.recommendedPriceRange}</p>
                        
                        <h4 className="font-medium text-gray-800">Pricing Model</h4>
                        <p className="text-gray-700">{marketAnalysis.pricingStrategy.pricingModel}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">Go-to-Market Strategy</h3>
                    <ul className="list-disc pl-5 text-gray-700">
                      {marketAnalysis.goToMarketStrategy.map((strategy: string, index: number) => (
                        <li key={index} className="mb-1">{strategy}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}