import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import Home from "./pages/home";
import AIAssistant from "./pages/ai-assistant";
import ModelWorkspace from "./pages/model-workspace";
import Profile from "./pages/profile";
import Explore from "./pages/explore";
import Signup from "./pages/signup";
import InventionDetail from "./pages/invention-detail";
import { 
  Home as HomeIcon, 
  Search, 
  Lightbulb, 
  Box as Cube,
  User,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

function AppContent() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Function to determine if a route is active
  const isActive = (path: string) => location === path;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-900 dark:to-purple-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold flex items-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">Future Forge</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <a 
              href="/" 
              className={`hover:text-blue-200 transition-colors ${isActive("/") ? "text-white font-semibold" : "text-gray-200"}`}
            >
              Home
            </a>
            <a 
              href="/explore" 
              className={`hover:text-blue-200 transition-colors ${isActive("/explore") ? "text-white font-semibold" : "text-gray-200"}`}
            >
              Explore
            </a>
            <a 
              href="/ai-assistant" 
              className={`hover:text-blue-200 transition-colors ${isActive("/ai-assistant") ? "text-white font-semibold" : "text-gray-200"}`}
            >
              AI Assistant
            </a>
            <a 
              href="/model-workspace" 
              className={`hover:text-blue-200 transition-colors ${isActive("/model-workspace") ? "text-white font-semibold" : "text-gray-200"}`}
            >
              3D Workspace
            </a>
            {user && (
              <a 
                href="/profile" 
                className={`hover:text-blue-200 transition-colors ${isActive("/profile") ? "text-white font-semibold" : "text-gray-200"}`}
              >
                Profile
              </a>
            )}
            <ThemeToggle />
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button 
              className="text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-800 dark:bg-blue-950 py-2">
            <div className="container mx-auto px-4 flex flex-col space-y-2">
              <a 
                href="/" 
                className={`py-2 px-4 rounded ${isActive("/") ? "bg-blue-700 dark:bg-blue-800" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="/explore" 
                className={`py-2 px-4 rounded ${isActive("/explore") ? "bg-blue-700 dark:bg-blue-800" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </a>
              <a 
                href="/ai-assistant" 
                className={`py-2 px-4 rounded ${isActive("/ai-assistant") ? "bg-blue-700 dark:bg-blue-800" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Assistant
              </a>
              <a 
                href="/model-workspace" 
                className={`py-2 px-4 rounded ${isActive("/model-workspace") ? "bg-blue-700 dark:bg-blue-800" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                3D Workspace
              </a>
              {user && (
                <a 
                  href="/profile" 
                  className={`py-2 px-4 rounded ${isActive("/profile") ? "bg-blue-700 dark:bg-blue-800" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </a>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/explore" component={Explore} />
          <Route path="/inventions/:id" component={InventionDetail} />
          <Route path="/ai-assistant" component={AIAssistant} />
          <Route path="/model-workspace" component={ModelWorkspace} />
          <Route path="/profile" component={Profile} />
          <Route path="/signup" component={Signup} />
        </Switch>
      </main>
      
      {/* Bottom navigation for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 flex justify-around py-2 px-4 z-10">
        <a 
          href="/" 
          className={`flex flex-col items-center p-2 ${isActive("/") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
        >
          <HomeIcon size={24} />
          <span className="text-xs mt-1">Home</span>
        </a>
        <a 
          href="/explore" 
          className={`flex flex-col items-center p-2 ${isActive("/explore") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
        >
          <Search size={24} />
          <span className="text-xs mt-1">Explore</span>
        </a>
        <a 
          href="/ai-assistant" 
          className={`flex flex-col items-center p-2 ${isActive("/ai-assistant") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
        >
          <Lightbulb size={24} />
          <span className="text-xs mt-1">AI</span>
        </a>
        <a 
          href="/model-workspace" 
          className={`flex flex-col items-center p-2 ${isActive("/model-workspace") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
        >
          <Cube size={24} />
          <span className="text-xs mt-1">3D</span>
        </a>
        <a 
          href="/profile" 
          className={`flex flex-col items-center p-2 ${isActive("/profile") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </a>
      </nav>
      
      {/* Footer with mobile bottom nav spacing */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-12 md:pb-6 pb-20">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Future Forge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}