import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Simplified 3D modeling workspace component
export default function ModelWorkspace() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [modelName, setModelName] = useState("My Invention");
  const [selectedTool, setSelectedTool] = useState("select");
  const [showTips, setShowTips] = useState(true);
  
  // Simple shapes that can be added to the workspace
  const [shapes, setShapes] = useState<Array<{
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    depth: number;
    color: string;
    rotation: number;
  }>>([]);
  
  // Load model suggestions if available
  useEffect(() => {
    // Simulate loading model suggestions
    const timer = setTimeout(() => {
      setLoading(false);
      // Example starter shapes based on AI recommendations
      setShapes([
        { type: 'cube', x: 100, y: 150, width: 100, height: 100, depth: 100, color: '#4A7FB5', rotation: 0 },
        { type: 'cylinder', x: 250, y: 150, width: 60, height: 120, depth: 60, color: '#5CB57F', rotation: 0 }
      ]);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
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
    shapes.forEach(shape => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation * Math.PI / 180);
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
      }
      
      ctx.restore();
    });
    
  }, [shapes, loading]);
  
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
    
    setShapes([...shapes, {
      type,
      x,
      y,
      width: type === 'cube' ? 100 : 60,
      height: type === 'cube' ? 100 : 120,
      depth: type === 'cube' ? 100 : 60,
      color,
      rotation: 0
    }]);
    
    toast({
      title: "Shape Added",
      description: `Added a new ${type} to your workspace.`,
    });
  };
  
  // Export the model (simplified)
  const exportModel = () => {
    toast({
      title: "Model Exported",
      description: "Your 3D model has been saved to your account.",
    });
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">3D Modeling Workspace</h1>
          <p className="text-gray-600">Create and visualize your invention</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
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
      
      {/* Model name input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Model Name</label>
        <input
          type="text"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          className="px-3 py-2 border rounded w-full md:w-1/3"
        />
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
            />
          )}
        </div>
      </div>
      
      {/* Properties Panel */}
      <div className="mt-6 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">Properties</h2>
        <p className="text-gray-600">Select an object to edit its properties</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div>
            <label className="block mb-1 text-sm font-medium">Position</label>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" placeholder="X" disabled className="px-2 py-1 border rounded" />
              <input type="number" placeholder="Y" disabled className="px-2 py-1 border rounded" />
              <input type="number" placeholder="Z" disabled className="px-2 py-1 border rounded" />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Dimensions</label>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" placeholder="W" disabled className="px-2 py-1 border rounded" />
              <input type="number" placeholder="H" disabled className="px-2 py-1 border rounded" />
              <input type="number" placeholder="D" disabled className="px-2 py-1 border rounded" />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Rotation</label>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" placeholder="X" disabled className="px-2 py-1 border rounded" />
              <input type="number" placeholder="Y" disabled className="px-2 py-1 border rounded" />
              <input type="number" placeholder="Z" disabled className="px-2 py-1 border rounded" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Integration with AI Assistant */}
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <div className="flex items-start">
          <div className="flex-grow">
            <h2 className="text-xl font-semibold">AI Modeling Assistant</h2>
            <p className="text-gray-600 mt-1">
              Get AI-powered suggestions to improve your 3D model based on manufacturing best practices, 
              material recommendations, and design optimization.
            </p>
          </div>
          <Link to="/ai-assistant">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Open AI Assistant
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}