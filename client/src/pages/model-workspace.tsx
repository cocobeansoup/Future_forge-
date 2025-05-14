import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ModelAIChat from "@/components/ModelAIChat";

// Enhanced 3D modeling workspace component
export default function ModelWorkspace() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [modelName, setModelName] = useState("My Invention");
  const [description, setDescription] = useState("");
  const [selectedTool, setSelectedTool] = useState("select");
  const [showTips, setShowTips] = useState(true);
  const [selectedShape, setSelectedShape] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  
  // For AI integration
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState<{prompt: string, response: string}[]>([]);
  
  // Simple shapes that can be added to the workspace
  const [shapes, setShapes] = useState<Array<{
    id: number;
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
  }>>([]);
  
  // Load model suggestions if available
  useEffect(() => {
    const loadModel = () => {
      setLoading(false);
      
      // Check if there's an AI-generated model in localStorage
      const savedModel = localStorage.getItem('aiGeneratedModel');
      if (savedModel) {
        try {
          const modelData = JSON.parse(savedModel);
          
          // Set the model name if available
          if (modelData.name) {
            setModelName(modelData.name);
          }
          
          // Convert the model shapes to our format
          if (modelData.shapes && Array.isArray(modelData.shapes)) {
            const convertedShapes = modelData.shapes.map((shape, index) => ({
              id: index + 1,
              type: shape.type,
              x: shape.x,
              y: shape.y,
              z: shape.z || 0,
              width: shape.width,
              height: shape.height,
              depth: shape.depth,
              color: shape.color,
              rotation: shape.rotation || {x: 0, y: 0, z: 0},
              material: shape.material || 'plastic'
            }));
            
            setShapes(convertedShapes);
            
            toast({
              title: "AI Model Loaded",
              description: "The AI-generated model has been loaded into your workspace.",
            });
            
            // Clear the localStorage entry to avoid loading it again
            localStorage.removeItem('aiGeneratedModel');
            return;
          }
        } catch (error) {
          console.error("Error parsing saved model:", error);
        }
      }
      
      // If no AI model is found, load default shapes
      setShapes([
        { 
          id: 1,
          type: 'cube', 
          x: 100, 
          y: 150, 
          z: 0,
          width: 100, 
          height: 100, 
          depth: 100, 
          color: '#4A7FB5', 
          rotation: {x: 0, y: 0, z: 0},
          material: 'plastic'
        },
        { 
          id: 2,
          type: 'cylinder', 
          x: 250, 
          y: 150, 
          z: 0,
          width: 60, 
          height: 120, 
          depth: 60, 
          color: '#5CB57F', 
          rotation: {x: 0, y: 0, z: 0},
          material: 'metal'
        }
      ]);
    };
    
    // Add a small delay to simulate loading and improve UX
    const timer = setTimeout(loadModel, 1500);
    
    return () => clearTimeout(timer);
  }, [toast]);
  
  // Draw the workspace
  useEffect(() => {
    if (!canvasRef.current || loading) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid (simplified)
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw shapes (simplified 2D representation of 3D objects)
    shapes.forEach((shape, index) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      
      // Apply Z-axis rotation only in 2D view
      ctx.rotate(shape.rotation.z * Math.PI / 180);
      
      // Highlight selected shape
      if (selectedShape === index) {
        ctx.strokeStyle = '#FF5722';
        ctx.lineWidth = 2;
        ctx.strokeRect(-shape.width/2 - 5, -shape.height/2 - 5, shape.width + 10, shape.height + 10);
      }
      
      ctx.fillStyle = shape.color;
      
      // Draw shape based on type
      if (shape.type === 'cube') {
        // Simplified isometric cube
        ctx.beginPath();
        
        // Front face
        ctx.fillRect(-shape.width/2, -shape.height/2, shape.width, shape.height);
        
        // Top face (simplified)
        ctx.fillStyle = adjustBrightness(shape.color, 20);
        ctx.beginPath();
        ctx.moveTo(-shape.width/2, -shape.height/2);
        ctx.lineTo(-shape.width/2 + shape.depth/4, -shape.height/2 - shape.depth/4);
        ctx.lineTo(shape.width/2 + shape.depth/4, -shape.height/2 - shape.depth/4);
        ctx.lineTo(shape.width/2, -shape.height/2);
        ctx.closePath();
        ctx.fill();
        
        // Side face (simplified)
        ctx.fillStyle = adjustBrightness(shape.color, -20);
        ctx.beginPath();
        ctx.moveTo(shape.width/2, -shape.height/2);
        ctx.lineTo(shape.width/2 + shape.depth/4, -shape.height/2 - shape.depth/4);
        ctx.lineTo(shape.width/2 + shape.depth/4, shape.height/2 - shape.depth/4);
        ctx.lineTo(shape.width/2, shape.height/2);
        ctx.closePath();
        ctx.fill();
      } else if (shape.type === 'cylinder') {
        // Simplified cylinder
        const radiusX = shape.width / 2;
        const radiusY = shape.depth / 2;
        
        // Draw ellipse for top
        ctx.beginPath();
        ctx.ellipse(0, -shape.height/2, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.fillStyle = adjustBrightness(shape.color, 20);
        ctx.fill();
        
        // Draw rectangle for body
        ctx.fillStyle = shape.color;
        ctx.fillRect(-radiusX, -shape.height/2, shape.width, shape.height);
        
        // Draw ellipse for bottom
        ctx.beginPath();
        ctx.ellipse(0, shape.height/2, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.fillStyle = adjustBrightness(shape.color, -20);
        ctx.fill();
      } else if (shape.type === 'sphere') {
        // Simplified sphere (just a circle in 2D)
        const radius = Math.max(shape.width, shape.height) / 2;
        
        // Draw main circle
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add shading for 3D effect
        const gradient = ctx.createRadialGradient(
          -radius/3, -radius/3, 0,
          0, 0, radius
        );
        gradient.addColorStop(0, adjustBrightness(shape.color, 40));
        gradient.addColorStop(1, adjustBrightness(shape.color, -20));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fill();
      } else if (shape.type === 'cone') {
        // Simplified cone
        const baseRadius = shape.width / 2;
        
        // Draw triangle for side view
        ctx.beginPath();
        ctx.moveTo(0, -shape.height/2); // Apex
        ctx.lineTo(-baseRadius, shape.height/2); // Left base
        ctx.lineTo(baseRadius, shape.height/2); // Right base
        ctx.closePath();
        ctx.fill();
        
        // Draw ellipse for base
        ctx.beginPath();
        ctx.ellipse(0, shape.height/2, baseRadius, shape.depth/4, 0, 0, 2 * Math.PI);
        ctx.fillStyle = adjustBrightness(shape.color, -20);
        ctx.fill();
      }
      
      ctx.restore();
    });
    
  }, [shapes, loading, selectedShape, viewMode]);
  
  // Helper function to adjust color brightness
  function adjustBrightness(color: string, percent: number): string {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const adjustValue = (value: number): number => {
      return Math.max(0, Math.min(255, value + percent));
    };
    
    const newR = adjustValue(r);
    const newG = adjustValue(g);
    const newB = adjustValue(b);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }
  
  // Add a new shape to the workspace
  const addShape = (type: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "You must be logged in to use the 3D Modeling Workspace.",
        variant: "destructive",
      });
      return;
    }
    
    // Generate random position
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const x = Math.random() * (canvas.width - 100) + 50;
    const y = Math.random() * (canvas.height - 100) + 50;
    
    // Random color
    const colors = ['#4A7FB5', '#5CB57F', '#B5754A', '#A14A7F', '#7F754A'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Random material
    const materials = ['plastic', 'metal', 'wood', 'glass', 'rubber'];
    const material = materials[Math.floor(Math.random() * materials.length)];
    
    // Create a unique ID for the shape
    const newId = shapes.length > 0 ? Math.max(...shapes.map(s => s.id)) + 1 : 1;
    
    // Add shape with basic properties based on type
    const newShape = {
      id: newId,
      type,
      x,
      y,
      z: 0,
      width: type === 'cube' ? 100 : type === 'sphere' ? 80 : 60,
      height: type === 'cube' ? 100 : type === 'cylinder' ? 120 : type === 'cone' ? 120 : 80,
      depth: type === 'cube' ? 100 : type === 'sphere' ? 80 : 60,
      color,
      rotation: {x: 0, y: 0, z: 0},
      material
    };
    
    setShapes([...shapes, newShape]);
    
    // Select the newly added shape
    setSelectedShape(shapes.length);
    
    toast({
      title: "Shape Added",
      description: `Added a new ${type} to your workspace.`,
    });
  };
  
  // Handle clicking on the canvas to select shapes
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get click coordinates relative to canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if a shape was clicked (simple hit detection)
    let selectedIndex = null;
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      const distance = Math.sqrt(Math.pow(mouseX - shape.x, 2) + Math.pow(mouseY - shape.y, 2));
      
      // Simple radius calculation based on shape dimensions
      const radius = Math.max(shape.width, shape.height) / 2;
      
      if (distance <= radius) {
        selectedIndex = i;
        break;
      }
    }
    
    setSelectedShape(selectedIndex);
  };
  
  // Update selected shape properties
  const updateShapeProperty = (property: string, value: any) => {
    if (selectedShape === null) return;
    
    setShapes(shapes.map((shape, index) => {
      if (index === selectedShape) {
        if (property.includes('.')) {
          // Handle nested properties like 'rotation.x'
          const [parent, child] = property.split('.');
          
          // Handle rotation specifically since we know its structure
          if (parent === 'rotation') {
            return {
              ...shape,
              rotation: {
                ...shape.rotation,
                [child]: value
              }
            };
          }
          
          // For other potential nested properties
          const newShape = { ...shape };
          if (typeof newShape[parent as keyof typeof shape] === 'object' && 
              newShape[parent as keyof typeof shape] !== null) {
            // This is a safer approach that checks if the property is an object
            const parentObj = { ...(newShape[parent as keyof typeof shape] as object) };
            (parentObj as any)[child] = value;
            newShape[parent as keyof typeof shape] = parentObj as any;
            return newShape;
          }
          return shape;
        }
        return { ...shape, [property]: value };
      }
      return shape;
    }));
  };
  
  // Delete the selected shape
  const deleteSelectedShape = () => {
    if (selectedShape === null) return;
    
    setShapes(shapes.filter((_, index) => index !== selectedShape));
    setSelectedShape(null);
    
    toast({
      title: "Shape Deleted",
      description: "The selected shape has been removed from your workspace.",
    });
  };
  
  // Export the model (enhanced)
  const exportModel = () => {
    // Create a JSON representation of the model
    const modelData = {
      name: modelName,
      description: description,
      shapes: shapes.map(shape => ({
        type: shape.type,
        dimensions: {
          width: shape.width,
          height: shape.height,
          depth: shape.depth
        },
        position: {
          x: shape.x,
          y: shape.y,
          z: shape.z
        },
        rotation: shape.rotation,
        appearance: {
          color: shape.color,
          material: shape.material
        }
      }))
    };
    
    // Create a data URL for download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(modelData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${modelName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Model Exported",
      description: "Your 3D model has been exported as a JSON file.",
    });
  };
  
  // Function to handle AI queries
  const requestAIFeedback = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a question or request for the AI assistant.",
        variant: "destructive",
      });
      return;
    }
    
    // Prepare model data for AI context
    const modelData = {
      name: modelName,
      description: description,
      components: shapes.map(shape => ({
        type: shape.type,
        material: shape.material,
        dimensions: `${shape.width}x${shape.height}x${shape.depth}`,
      }))
    };
    
    setIsAiLoading(true);
    
    try {
      // Simulate API response for now
      setTimeout(() => {
        let response = "";
        
        if (aiPrompt.toLowerCase().includes("material")) {
          response = "Based on your model design, I recommend using ABS plastic for the cube components as it provides durability while keeping costs low. For the cylindrical parts, consider aluminum for better heat dissipation and structural integrity. This combination optimizes both function and manufacturability.";
        } else if (aiPrompt.toLowerCase().includes("improve")) {
          response = "To improve your design, consider:\n\n1. Adding fillets (rounded edges) to the corners of your cube to reduce stress concentrations\n2. Reducing the height of the cylinder by 15% to improve stability\n3. Considering a snap-fit connection between components rather than glue for easier assembly";
        } else if (aiPrompt.toLowerCase().includes("manufacturing")) {
          response = "For manufacturing this design, injection molding would be most cost-effective for the plastic components. The metal cylinder could be CNC machined or die-cast depending on volume. Estimated production costs would be $3-5 per unit at 1000+ quantities, with tooling setup costs around $2,500-4,000.";
        } else {
          response = "I've analyzed your 3D model and notice it has a good basic structure. Consider the relationship between your components and how they'll connect. For manufacturing efficiency, I recommend standardizing the dimensions when possible. Would you like specific feedback on materials, assembly, or cost optimization?";
        }
        
        setAiResponse(response);
        setAiHistory([...aiHistory, {prompt: aiPrompt, response}]);
        setAiPrompt("");
        setIsAiLoading(false);
      }, 2000);
      
      // In production, would replace with actual API call:
      /*
      const response = await apiRequest("POST", "/api/ai/model-feedback", {
        prompt: aiPrompt,
        modelData
      });
      
      const data = await response.json();
      setAiResponse(data.feedback);
      setAiHistory([...aiHistory, {prompt: aiPrompt, response: data.feedback}]);
      */
      
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      setIsAiLoading(false);
      
      toast({
        title: "Error",
        description: "Failed to get AI feedback. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Top Header Bar (Blender-style) */}
      <header className="bg-gray-800 dark:bg-gray-950 text-white py-2 px-4 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Future Forge Workspace</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative group">
            <button className="bg-gray-700 dark:bg-gray-800 hover:bg-blue-600 dark:hover:bg-blue-700 rounded px-3 py-1.5 text-sm transition-colors">
              File
            </button>
            <div className="absolute hidden group-hover:block right-0 mt-1 bg-gray-700 dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-50 w-40">
              <button 
                onClick={exportModel}
                className="w-full text-left px-4 py-2 hover:bg-gray-600 dark:hover:bg-gray-700 text-sm"
              >
                Export Model
              </button>
              <button 
                className="w-full text-left px-4 py-2 hover:bg-gray-600 dark:hover:bg-gray-700 text-sm"
              >
                Save Project
              </button>
            </div>
          </div>
          
          <Link to="/ai-assistant">
            <button className="bg-purple-600 hover:bg-purple-700 rounded px-3 py-1.5 text-sm">
              AI Suite
            </button>
          </Link>
          
          <div className="bg-gray-700 dark:bg-gray-800 rounded px-3 py-1.5 flex items-center">
            <span className="text-sm mr-2">View:</span>
            <div className="bg-gray-900 rounded-full p-0.5 flex">
              <button
                className={`px-2 py-0.5 rounded-full text-xs ${viewMode === '2d' ? 'bg-blue-600' : 'bg-gray-800'}`}
                onClick={() => setViewMode('2d')}
              >
                2D
              </button>
              <button
                className={`px-2 py-0.5 rounded-full text-xs ${viewMode === '3d' ? 'bg-blue-600' : 'bg-gray-800'}`}
                onClick={() => setViewMode('3d')}
              >
                3D
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Model info inputs - fixed below header */}
      <div className="bg-gray-200 dark:bg-gray-800 p-2 border-b border-gray-300 dark:border-gray-700">
        <div className="container mx-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="flex items-center">
              <label className="block mr-2 text-sm font-medium dark:text-gray-300">Model:</label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded flex-1 dark:text-white"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <label className="block mr-2 text-sm font-medium dark:text-gray-300">Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded flex-1 dark:text-white"
                placeholder="Briefly describe your invention..."
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main workspace area with responsive layout */}
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Mobile toolbar - visible only on small screens */}
        <div className="md:hidden bg-gray-800 p-2 flex space-x-2 overflow-x-auto">
          <button 
            onClick={() => setSelectedTool('select')}
            className={`flex-shrink-0 p-2 rounded-md ${selectedTool === 'select' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </button>
          <button 
            onClick={() => setSelectedTool('move')}
            className={`flex-shrink-0 p-2 rounded-md ${selectedTool === 'move' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
          <button 
            onClick={() => setSelectedTool('rotate')}
            className={`flex-shrink-0 p-2 rounded-md ${selectedTool === 'rotate' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button 
            onClick={() => setSelectedTool('scale')}
            className={`flex-shrink-0 p-2 rounded-md ${selectedTool === 'scale' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <div className="h-6 border-r border-gray-600 mx-1"></div>
          <button 
            onClick={() => addShape('cube')}
            className="flex-shrink-0 p-2 bg-gray-700 rounded-md"
          >
            <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </button>
          <button 
            onClick={() => addShape('cylinder')}
            className="flex-shrink-0 p-2 bg-gray-700 rounded-md"
          >
            <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button 
            onClick={() => addShape('sphere')}
            className="flex-shrink-0 p-2 bg-gray-700 rounded-md"
          >
            <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth={2} />
            </svg>
          </button>
          <button 
            onClick={() => addShape('cone')}
            className="flex-shrink-0 p-2 bg-gray-700 rounded-md"
          >
            <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
          {selectedShape !== null && (
            <button 
              onClick={deleteSelectedShape}
              className="flex-shrink-0 p-2 bg-red-600 rounded-md"
            >
              <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Desktop Tools Panel - only visible on md and larger */}
        <div className="hidden md:block md:w-64 bg-gray-200 dark:bg-gray-800 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Tools</h2>
            
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedTool('select')}
                className={`w-full px-3 py-2 text-left rounded flex items-center ${selectedTool === 'select' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                Select Tool
              </button>
              <button 
                onClick={() => setSelectedTool('move')}
                className={`w-full px-3 py-2 text-left rounded flex items-center ${selectedTool === 'move' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Move Tool
              </button>
              <button 
                onClick={() => setSelectedTool('rotate')}
                className={`w-full px-3 py-2 text-left rounded flex items-center ${selectedTool === 'rotate' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Rotate Tool
              </button>
              <button 
                onClick={() => setSelectedTool('scale')}
                className={`w-full px-3 py-2 text-left rounded flex items-center ${selectedTool === 'scale' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Scale Tool
              </button>
              
              <div className="h-px bg-gray-300 dark:bg-gray-600 my-4"></div>
              <h3 className="font-medium mb-2 dark:text-white">Add Shapes</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => addShape('cube')}
                  className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-blue-50 dark:hover:bg-gray-600"
                >
                  <svg className="w-6 h-6 mb-1 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="text-xs dark:text-gray-300">Cube</span>
                </button>
                <button 
                  onClick={() => addShape('cylinder')}
                  className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-blue-50 dark:hover:bg-gray-600"
                >
                  <svg className="w-6 h-6 mb-1 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs dark:text-gray-300">Cylinder</span>
                </button>
                <button 
                  onClick={() => addShape('sphere')}
                  className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-blue-50 dark:hover:bg-gray-600"
                >
                  <svg className="w-6 h-6 mb-1 text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  </svg>
                  <span className="text-xs dark:text-gray-300">Sphere</span>
                </button>
                <button 
                  onClick={() => addShape('cone')}
                  className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-blue-50 dark:hover:bg-gray-600"
                >
                  <svg className="w-6 h-6 mb-1 text-orange-600 dark:text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span className="text-xs dark:text-gray-300">Cone</span>
                </button>
              </div>
              
              {selectedShape !== null && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2 dark:text-white">Actions</h3>
                  <button 
                    onClick={deleteSelectedShape}
                    className="w-full px-3 py-2 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded hover:bg-red-200 dark:hover:bg-red-800/30"
                  >
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Selected Shape
                  </button>
                </div>
              )}
            </div>
            
            {/* Tips section */}
            {showTips && (
              <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium dark:text-white">Quick Tips</h3>
                  <button 
                    onClick={() => setShowTips(false)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Hide
                  </button>
                </div>
                <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Click a shape to select it</li>
                  <li>• Use the tools to manipulate shapes</li>
                  <li>• Combine simple shapes to create complex models</li>
                  <li>• Ask the AI assistant for guidance</li>
                  <li>• Export when you're ready to save your work</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Canvas Workspace */}
        <div className="flex-grow bg-white dark:bg-gray-700 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full"></div>
              <p className="ml-3 text-lg dark:text-white">Loading workspace...</p>
            </div>
          ) : (
            <canvas 
              ref={canvasRef}
              width={800}
              height={500}
              className="w-full h-full min-h-[400px] md:min-h-[600px]"
              style={{ backgroundColor: viewMode === '3d' ? '#1e293b' : '#f8f9fa' }}
              onClick={handleCanvasClick}
            />
          )}
          
          {/* 3D view message */}
          {viewMode === '3d' && (
            <div className="absolute top-2 left-2 right-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-3 rounded-md text-sm dark:text-yellow-100">
              <p className="text-sm text-yellow-800">
                Note: Full 3D view requires WebGL implementation. For this demo, we're using a 2D canvas with isometric-style rendering.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Properties Panel - Fixed side panel on desktop, drawer-like panel at bottom on mobile */}
      <div className="fixed md:static bottom-0 left-0 right-0 md:w-64 bg-gray-100 dark:bg-gray-800 md:border-l border-t md:border-t-0 border-gray-300 dark:border-gray-700 p-3 md:p-4 z-10 max-h-[50vh] md:max-h-full overflow-y-auto md:flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold dark:text-white">Properties</h2>
          <button className="md:hidden p-1 rounded-full bg-gray-200 dark:bg-gray-700">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
        
        {selectedShape === null ? (
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-3">Select an object to edit its properties</p>
        ) : (
          <div className="mt-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-600 p-2 mb-3">
              <p className="text-blue-700 dark:text-blue-300 text-sm">{shapes[selectedShape].type.charAt(0).toUpperCase() + shapes[selectedShape].type.slice(1)} selected</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-1.5">
                  <span className="inline-block w-4 h-4 mr-1.5 bg-blue-500 dark:bg-blue-600 rounded-sm"></span>
                  <label className="text-sm font-medium dark:text-white">Position</label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">X</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].x}
                      onChange={(e) => updateShapeProperty('x', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded dark:text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">Y</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].y}
                      onChange={(e) => updateShapeProperty('y', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded dark:text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">Z</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].z}
                      onChange={(e) => updateShapeProperty('z', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded dark:text-white" 
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-1.5">
                  <span className="inline-block w-4 h-4 mr-1.5 bg-green-500 dark:bg-green-600 rounded-sm"></span>
                  <label className="text-sm font-medium dark:text-white">Dimensions</label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">W</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].width}
                      onChange={(e) => updateShapeProperty('width', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded dark:text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">H</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].height}
                      onChange={(e) => updateShapeProperty('height', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded dark:text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">D</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].depth}
                      onChange={(e) => updateShapeProperty('depth', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded dark:text-white" 
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-1.5">
                  <span className="inline-block w-4 h-4 mr-1.5 bg-purple-500 dark:bg-purple-600 rounded-sm"></span>
                  <label className="text-sm font-medium dark:text-white">Rotation</label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">X°</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].rotation.x}
                      onChange={(e) => updateShapeProperty('rotation.x', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded dark:text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">Y°</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].rotation.y}
                      onChange={(e) => updateShapeProperty('rotation.y', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded dark:text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">Z°</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].rotation.z}
                      onChange={(e) => updateShapeProperty('rotation.z', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded dark:text-white" 
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-1.5">
                  <span className="inline-block w-4 h-4 mr-1.5 bg-red-500 dark:bg-red-600 rounded-sm"></span>
                  <label className="text-sm font-medium dark:text-white">Appearance</label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Color</label>
                    <div className="flex items-center">
                      <input 
                        type="color" 
                        value={shapes[selectedShape].color}
                        onChange={(e) => updateShapeProperty('color', e.target.value)} 
                        className="w-8 h-8 rounded cursor-pointer" 
                      />
                      <span className="ml-2 text-xs uppercase dark:text-gray-300">{shapes[selectedShape].color}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Material</label>
                    <select
                      value={shapes[selectedShape].material}
                      onChange={(e) => updateShapeProperty('material', e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded dark:text-white"
                    >
                      <option value="plastic">Plastic</option>
                      <option value="metal">Metal</option>
                      <option value="wood">Wood</option>
                      <option value="glass">Glass</option>
                      <option value="rubber">Rubber</option>
                      <option value="ceramic">Ceramic</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* AI Assistant Panel - Collapsed to bottom corner on mobile, full panel on desktop */}
      <div className="fixed bottom-0 right-0 md:static md:mt-6 z-20">
        <div className="md:hidden absolute bottom-4 right-4 shadow-lg">
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="bg-purple-600 dark:bg-purple-700 text-white rounded-full p-3 shadow-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
        
        <div className={`${showAIPanel ? 'translate-y-0' : 'translate-y-full'} md:translate-y-0 transition-transform duration-300 fixed bottom-0 left-0 right-0 md:static bg-white dark:bg-gray-800 md:bg-transparent md:dark:bg-transparent rounded-t-xl md:rounded-none shadow-lg md:shadow-none border border-gray-200 dark:border-gray-700 md:border-0 z-30`}>
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 md:border-0 md:px-0">
            <h2 className="text-lg font-semibold dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Modeling Assistant
            </h2>
            <div className="flex space-x-3">
              <Link to="/ai-assistant" className="hidden md:block">
                <button className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded hover:bg-purple-700 dark:hover:bg-purple-800 text-sm transition-colors">
                  Full AI Suite
                </button>
              </Link>
              <button 
                onClick={() => setShowAIPanel(false)} 
                className="md:hidden p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* ModelAIChat component for improved AI interaction */}
          <div className="p-3 md:p-0 max-h-[400px] md:max-h-none overflow-y-auto">
            <ModelAIChat 
              modelName={modelName}
              modelDescription={description}
              modelComponents={shapes.map(shape => ({
                type: shape.type,
                dimensions: `${shape.width}x${shape.height}x${shape.depth}`,
                material: shape.material
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}