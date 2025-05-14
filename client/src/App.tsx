import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Inventions from "@/pages/inventions";
import InventionDetail from "@/pages/invention-detail";
import CreateInvention from "@/pages/create-invention";
import Investments from "@/pages/investments";
import Profile from "@/pages/profile";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { useState } from "react";
import AIAssistant from "@/pages/ai-assistant";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen">
          <Sidebar />
          
          <main className="flex-1 overflow-auto">
            <Topbar onMenuClick={toggleMobileMenu} />
            
            <div className="p-4 md:p-8">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/inventions" component={Inventions} />
                <Route path="/inventions/create" component={CreateInvention} />
                <Route path="/inventions/:id" component={InventionDetail} />
                <Route path="/investments" component={Investments} />
                <Route path="/ai-assistant" component={AIAssistant} />
                <Route path="/profile" component={Profile} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
          
          <MobileNavigation />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
