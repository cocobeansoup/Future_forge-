import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import Home from "./pages/home";
import AIAssistant from "./pages/ai-assistant";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-white">
        <header className="bg-blue-600 text-white">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold">Future Forge</div>
            <nav className="space-x-4">
              <a href="/" className="hover:text-blue-200">Home</a>
              <a href="/ai-assistant" className="hover:text-blue-200">AI Assistant</a>
            </nav>
          </div>
        </header>
        
        <main>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/ai-assistant" component={AIAssistant} />
          </Switch>
        </main>
        
        <footer className="bg-gray-100 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Future Forge. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}