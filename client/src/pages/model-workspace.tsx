import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
    <div className="container mx-auto py-6 px-4">
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">3D Modeling Workspace</h1>
          <p className="text-gray-600">Create and visualize your invention</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <button 
            onClick={() => setShowAIPanel(!showAIPanel)}
            className={`px-4 py-2 text-white rounded ${showAIPanel ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {showAIPanel ? 'Hide AI Assistant' : 'Show AI Assistant'}
          </button>
          <Link to="/ai-assistant">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Get AI Suggestions
            </button>
          </Link>
          <button 
            onClick={exportModel} 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export Model
          </button>
        </div>
      </header>
      
      {/* Model info inputs */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Model Name</label>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="px-3 py-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 border rounded w-full"
            placeholder="Briefly describe your invention..."
          />
        </div>
      </div>
      
      {/* View toggle */}
      <div className="mb-4 flex items-center space-x-4">
        <label className="font-medium">View Mode:</label>
        <div className="bg-gray-200 rounded-full p-1 flex">
          <button
            className={`px-4 py-1 rounded-full text-sm ${viewMode === '2d' ? 'bg-white shadow-sm' : ''}`}
            onClick={() => setViewMode('2d')}
          >
            2D View
          </button>
          <button
            className={`px-4 py-1 rounded-full text-sm ${viewMode === '3d' ? 'bg-white shadow-sm' : ''}`}
            onClick={() => setViewMode('3d')}
          >
            3D View
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tools Panel */}
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Tools</h2>
          
          <div className="space-y-3">
            <button 
              onClick={() => setSelectedTool('select')}
              className={`w-full px-3 py-2 text-left rounded ${selectedTool === 'select' ? 'bg-blue-100 border-l-4 border-blue-600' : 'bg-white'}`}
            >
              Select Tool
            </button>
            <button 
              onClick={() => setSelectedTool('move')}
              className={`w-full px-3 py-2 text-left rounded ${selectedTool === 'move' ? 'bg-blue-100 border-l-4 border-blue-600' : 'bg-white'}`}
            >
              Move Tool
            </button>
            <button 
              onClick={() => setSelectedTool('rotate')}
              className={`w-full px-3 py-2 text-left rounded ${selectedTool === 'rotate' ? 'bg-blue-100 border-l-4 border-blue-600' : 'bg-white'}`}
            >
              Rotate Tool
            </button>
            <button 
              onClick={() => setSelectedTool('scale')}
              className={`w-full px-3 py-2 text-left rounded ${selectedTool === 'scale' ? 'bg-blue-100 border-l-4 border-blue-600' : 'bg-white'}`}
            >
              Scale Tool
            </button>
            
            <hr className="my-4" />
            <h3 className="font-medium mb-2">Add Shapes</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => addShape('cube')}
                className="px-3 py-2 bg-white rounded hover:bg-gray-200"
              >
                Cube
              </button>
              <button 
                onClick={() => addShape('cylinder')}
                className="px-3 py-2 bg-white rounded hover:bg-gray-200"
              >
                Cylinder
              </button>
              <button 
                onClick={() => addShape('sphere')}
                className="px-3 py-2 bg-white rounded hover:bg-gray-200"
              >
                Sphere
              </button>
              <button 
                onClick={() => addShape('cone')}
                className="px-3 py-2 bg-white rounded hover:bg-gray-200"
              >
                Cone
              </button>
            </div>
            
            {selectedShape !== null && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Actions</h3>
                <button 
                  onClick={deleteSelectedShape}
                  className="w-full px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100"
                >
                  Delete Selected Shape
                </button>
              </div>
            )}
          </div>
          
          {/* Tips section */}
          {showTips && (
            <div className="mt-6 p-3 bg-blue-50 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Quick Tips</h3>
                <button 
                  onClick={() => setShowTips(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Hide
                </button>
              </div>
              <ul className="text-sm space-y-2">
                <li>• Click a shape to select it</li>
                <li>• Use the tools to manipulate shapes</li>
                <li>• Combine simple shapes to create complex models</li>
                <li>• Ask the AI assistant for guidance</li>
                <li>• Export when you're ready to save your work</li>
              </ul>
            </div>
          )}
        </div>
        
        {/* Canvas Workspace */}
        <div className="md:col-span-3 bg-white border rounded relative min-h-[500px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              <p className="ml-3 text-lg">Loading workspace...</p>
            </div>
          ) : (
            <canvas 
              ref={canvasRef}
              width={800}
              height={500}
              className="w-full h-full"
              style={{ backgroundColor: '#f8f9fa' }}
              onClick={handleCanvasClick}
            />
          )}
          
          {/* 3D view message */}
          {viewMode === '3d' && (
            <div className="absolute top-2 left-2 right-2 bg-yellow-50 border border-yellow-200 p-3 rounded-md">
              <p className="text-sm text-yellow-800">
                Note: Full 3D view requires WebGL implementation. For this demo, we're using a 2D canvas with isometric-style rendering.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Properties Panel */}
      <div className="mt-6 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">Properties</h2>
        
        {selectedShape === null ? (
          <p className="text-gray-600">Select an object to edit its properties</p>
        ) : (
          <div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-2 mb-4">
              <p className="text-blue-700">{shapes[selectedShape].type.charAt(0).toUpperCase() + shapes[selectedShape].type.slice(1)} selected</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Position</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500">X</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].x}
                      onChange={(e) => updateShapeProperty('x', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 border rounded" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Y</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].y}
                      onChange={(e) => updateShapeProperty('y', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 border rounded" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Z</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].z}
                      onChange={(e) => updateShapeProperty('z', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 border rounded" 
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Dimensions</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500">Width</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].width}
                      onChange={(e) => updateShapeProperty('width', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 border rounded" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Height</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].height}
                      onChange={(e) => updateShapeProperty('height', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 border rounded" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Depth</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].depth}
                      onChange={(e) => updateShapeProperty('depth', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 border rounded" 
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Rotation</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500">X°</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].rotation.x}
                      onChange={(e) => updateShapeProperty('rotation.x', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 border rounded" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Y°</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].rotation.y}
                      onChange={(e) => updateShapeProperty('rotation.y', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 border rounded" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Z°</label>
                    <input 
                      type="number" 
                      value={shapes[selectedShape].rotation.z}
                      onChange={(e) => updateShapeProperty('rotation.z', parseFloat(e.target.value))} 
                      className="w-full px-2 py-1 border rounded" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Color</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="color" 
                    value={shapes[selectedShape].color}
                    onChange={(e) => updateShapeProperty('color', e.target.value)} 
                    className="w-10 h-10 rounded cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={shapes[selectedShape].color}
                    onChange={(e) => updateShapeProperty('color', e.target.value)} 
                    className="flex-1 px-2 py-1 border rounded" 
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Material</label>
                <select
                  value={shapes[selectedShape].material}
                  onChange={(e) => updateShapeProperty('material', e.target.value)}
                  className="w-full px-2 py-1 border rounded"
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
        )}
      </div>
      
      {/* AI Panel (conditionally shown) */}
      {showAIPanel && (
        <div className="mt-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Modeling Assistant
          </h2>
          
          <div className="bg-white rounded-lg p-4 mb-4 h-48 overflow-y-auto">
            {aiHistory.length === 0 && !aiResponse ? (
              <div className="text-gray-500 italic text-center py-8">
                Ask the AI assistant for modeling advice, material suggestions, or manufacturing guidance
              </div>
            ) : (
              <div className="space-y-4">
                {/* Show conversation history */}
                {aiHistory.map((item, index) => (
                  <div key={index}>
                    <div className="bg-blue-50 p-2 rounded-lg mb-2">
                      <p className="font-medium">You:</p>
                      <p>{item.prompt}</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <p className="font-medium">AI Assistant:</p>
                      <p className="whitespace-pre-wrap">{item.response}</p>
                    </div>
                  </div>
                ))}
                
                {/* Show current response if available */}
                {aiResponse && aiHistory.length === 0 && (
                  <div>
                    <div className="bg-blue-50 p-2 rounded-lg mb-2">
                      <p className="font-medium">You:</p>
                      <p>{aiPrompt}</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <p className="font-medium">AI Assistant:</p>
                      <p className="whitespace-pre-wrap">{aiResponse}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask about materials, design optimization, manufacturing..."
              className="flex-1 px-3 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isAiLoading}
            />
            <button
              onClick={requestAIFeedback}
              disabled={isAiLoading}
              className={`px-4 py-2 bg-purple-600 text-white rounded-r hover:bg-purple-700 flex items-center 
              ${isAiLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isAiLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </>
              ) : (
                'Ask AI'
              )}
            </button>
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            <p>AI Assistant can provide modeling advice, material recommendations, and manufacturing guidance based on your design.</p>
          </div>
        </div>
      )}
    </div>
  );
}