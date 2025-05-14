import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AIResponse {
  feedback: string;
  suggestedImprovements: any;
  marketAnalysis: any;
}

export default function AIAssistant() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description of your invention",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real app, this would call your OpenAI integration endpoint
      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        setResponse({
          feedback: "Based on your description, your invention shows promise in addressing a real market need. The concept is innovative and appears to solve a common problem effectively. Here are some thoughts and suggestions to consider as you develop this further.",
          suggestedImprovements: {
            technical: "Consider exploring alternative materials that might improve durability while reducing production costs.",
            design: "The user interface could benefit from further simplification to improve accessibility for all age groups.",
            manufacturing: "Investigate modular design principles to potentially simplify assembly and reduce manufacturing complexity."
          },
          marketAnalysis: {
            targetMarket: "Your primary market appears to be tech-savvy consumers aged 25-45 who value convenience and efficiency.",
            competitiveLandscape: "There are 3-4 similar products in the market, but your unique approach to solving the problem provides a competitive advantage.",
            pricingStrategy: "Based on production costs and market positioning, consider a price point between $65-85."
          }
        });
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI feedback. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-4">You need to log in to use the AI Assistant</h1>
        <Button asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Assistant</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Get AI Feedback on Your Invention</CardTitle>
          <CardDescription>
            Our AI can analyze your invention idea and provide feedback, suggestions, and market analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                placeholder="Describe your invention in detail..."
                className="min-h-32"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  Analyzing...
                </>
              ) : (
                "Get AI Feedback"
              )}
            </Button>
          </form>

          {response && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">AI Feedback Results</h3>
              
              <Tabs defaultValue="feedback">
                <TabsList className="mb-4">
                  <TabsTrigger value="feedback">General Feedback</TabsTrigger>
                  <TabsTrigger value="improvements">Suggested Improvements</TabsTrigger>
                  <TabsTrigger value="market">Market Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="feedback" className="p-4 bg-gray-50 rounded-md">
                  <p>{response.feedback}</p>
                </TabsContent>
                
                <TabsContent value="improvements">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-medium text-blue-800 mb-2">Technical Suggestions</h4>
                      <p>{response.suggestedImprovements.technical}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-md">
                      <h4 className="font-medium text-purple-800 mb-2">Design Suggestions</h4>
                      <p>{response.suggestedImprovements.design}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-md">
                      <h4 className="font-medium text-green-800 mb-2">Manufacturing Suggestions</h4>
                      <p>{response.suggestedImprovements.manufacturing}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="market">
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 rounded-md">
                      <h4 className="font-medium text-amber-800 mb-2">Target Market</h4>
                      <p>{response.marketAnalysis.targetMarket}</p>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-md">
                      <h4 className="font-medium text-indigo-800 mb-2">Competitive Landscape</h4>
                      <p>{response.marketAnalysis.competitiveLandscape}</p>
                    </div>
                    <div className="p-4 bg-rose-50 rounded-md">
                      <h4 className="font-medium text-rose-800 mb-2">Pricing Strategy</h4>
                      <p>{response.marketAnalysis.pricingStrategy}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Want to integrate this AI feedback with one of your inventions?
                </p>
                <Button asChild variant="outline">
                  <Link href="/inventions">Go to My Inventions</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Our AI Assistant Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">Analyze</h3>
              <p className="text-sm text-gray-500">
                Our AI analyzes your invention description and identifies key elements and potential applications.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">Evaluate</h3>
              <p className="text-sm text-gray-500">
                It evaluates market potential, competitive landscape, and technical feasibility.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">Suggest</h3>
              <p className="text-sm text-gray-500">
                Provides actionable suggestions to improve your invention's design, functionality, and market appeal.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}