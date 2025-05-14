import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Type for subscription status response
interface SubscriptionStatus {
  active: boolean;
  endDate: string | null;
  daysRemaining: number;
  onTrial: boolean;
}

// Dashboard metrics type
interface DashboardMetrics {
  totalInventions: number;
  completedInventions: number;
  inProgressInventions: number;
  prototypes: number;
  totalFunding: number;
  fundingProgress: number;
  forSaleCount: number;
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Fetch subscription status if user is inventor
  const { data: subscriptionStatus } = useQuery<SubscriptionStatus>({
    queryKey: ["/api/subscription/status", user?.id],
    enabled: isAuthenticated && !!user?.id && user.isInventor,
  });

  // Fetch dashboard metrics
  const { data: metrics, isLoading: isMetricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard-metrics"],
    enabled: isAuthenticated,
  });

  // Function to handle subscription
  const handleSubscribe = async () => {
    try {
      if (!user) return;
      
      const response = await fetch("/api/subscription/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }
      
      toast({
        title: "Success",
        description: "You have successfully subscribed!",
      });
      
      // Refetch subscription status
      // Note: In a real app with Stripe integration, this would redirect to Stripe checkout
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process subscription",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">You need to log in to access the dashboard</h1>
        <Button asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {user?.isInventor && (
          <Button asChild>
            <Link href="/inventions/create">Create New Invention</Link>
          </Button>
        )}
      </div>

      {/* Subscription Status Card - only show for inventors */}
      {user?.isInventor && (
        <Card className={subscriptionStatus?.active ? "bg-green-50" : "bg-amber-50"}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Subscription Status</CardTitle>
          </CardHeader>
          <CardContent>
            {subscriptionStatus?.active ? (
              <div>
                <p className="text-green-700 font-medium">
                  {subscriptionStatus.onTrial
                    ? `Your free trial is active! ${subscriptionStatus.daysRemaining} days remaining.`
                    : `Your subscription is active. ${subscriptionStatus.daysRemaining} days remaining.`}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Expires on: {subscriptionStatus.endDate 
                    ? new Date(subscriptionStatus.endDate).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-amber-700 font-medium">
                  {user.trialUsed 
                    ? "Your trial period or subscription has expired." 
                    : "You haven't started your free trial yet."}
                </p>
                <Button onClick={handleSubscribe} className="mt-2" size="sm">
                  {user.trialUsed ? "Subscribe Now - $20/month" : "Start Free Trial"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Inventions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isMetricsLoading ? "-" : metrics?.totalInventions || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isMetricsLoading ? "-" : metrics?.inProgressInventions || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isMetricsLoading ? "-" : metrics?.completedInventions || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Funding Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isMetricsLoading ? "-" : `${metrics?.fundingProgress || 0}%`}
            </div>
            <div className="text-sm text-gray-500">
              ${isMetricsLoading ? "-" : metrics?.totalFunding?.toLocaleString() || 0} total
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different dashboard views */}
      <Tabs defaultValue="my-inventions" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="my-inventions">
            {user?.isInventor ? "My Inventions" : "Recommended Inventions"}
          </TabsTrigger>
          {user?.isInvestor && (
            <TabsTrigger value="my-investments">My Investments</TabsTrigger>
          )}
          <TabsTrigger value="recent-activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-inventions" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {user?.isInventor ? (
                <p className="text-center py-8 text-gray-500">
                  You haven't created any inventions yet.{" "}
                  <Link href="/inventions/create" className="text-blue-600 hover:underline">
                    Create your first invention
                  </Link>
                </p>
              ) : (
                <p className="text-center py-8 text-gray-500">
                  Start exploring inventions to find your next investment opportunity.{" "}
                  <Link href="/inventions" className="text-blue-600 hover:underline">
                    Browse inventions
                  </Link>
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {user?.isInvestor && (
          <TabsContent value="my-investments" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center py-8 text-gray-500">
                  You haven't made any investments yet.{" "}
                  <Link href="/inventions" className="text-blue-600 hover:underline">
                    Discover investment opportunities
                  </Link>
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="recent-activity" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center py-8 text-gray-500">
                No recent activity to display.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}