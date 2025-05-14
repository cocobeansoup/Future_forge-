import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Pipeline from "@/pages/pipeline";
import Forecasting from "@/pages/forecasting";
import Vendors from "@/pages/vendors";
import Contracts from "@/pages/contracts";
import Settings from "@/pages/settings";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { useState } from "react";

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
                <Route path="/" component={Dashboard} />
                <Route path="/pipeline" component={Pipeline} />
                <Route path="/forecasting" component={Forecasting} />
                <Route path="/vendors" component={Vendors} />
                <Route path="/contracts" component={Contracts} />
                <Route path="/settings" component={Settings} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
          
          <MobileNavigation />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
