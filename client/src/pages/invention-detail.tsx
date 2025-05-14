import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Invention interface
interface Invention {
  id: number;
  title: string;
  description: string;
  images: string[];
  category: string;
  status: string;
  fundingGoal: string | null;
  currentFunding: string | null;
  inventorId: number;
  patentStatus: string | null;
  forSale: boolean;
  salePrice: string | null;
  createdAt: string;
  updatedAt: string;
  aiAssistance: boolean;
  tags: string[];
}

// User interface
interface User {
  id: number;
  username: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  isInventor: boolean;
  isInvestor: boolean;
}

// Investment interface
interface Investment {
  id: number;
  inventionId: number;
  investorId: number;
  amount: string;
  equityPercentage: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

// Comment interface
interface Comment {
  id: number;
  inventionId: number;
  userId: number;
  content: string;
  createdAt: string;
}

// Update interface
interface InventionUpdate {
  id: number;
  inventionId: number;
  title: string;
  content: string;
  images: string[];
  createdAt: string;
}

export default function InventionDetail() {
  const [, params] = useRoute<{ id: string }>("/inventions/:id");
  const inventionId = params?.id ? parseInt(params.id) : 0;
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");

  // Fetch invention details
  const { data: invention, isLoading: isLoadingInvention } = useQuery<Invention>({
    queryKey: [`/api/inventions/${inventionId}`],
    enabled: !!inventionId,
  });

  // Fetch inventor details
  const { data: inventor } = useQuery<User>({
    queryKey: [`/api/users/${invention?.inventorId}`],
    enabled: !!invention?.inventorId,
  });

  // Fetch invention comments
  const { data: comments, refetch: refetchComments } = useQuery<Comment[]>({
    queryKey: [`/api/inventions/${inventionId}/comments`],
    enabled: !!inventionId,
  });

  // Fetch invention updates
  const { data: updates } = useQuery<InventionUpdate[]>({
    queryKey: [`/api/inventions/${inventionId}/updates`],
    enabled: !!inventionId,
  });

  // Fetch investments
  const { data: investments } = useQuery<Investment[]>({
    queryKey: [`/api/inventions/${inventionId}/investments`],
    enabled: !!inventionId && isAuthenticated,
  });

  // Post a comment mutation
  const commentMutation = useMutation({
    mutationFn: async (commentData: { inventionId: number; userId: number; content: string }) => {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to post comment");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully",
      });
      setComment("");
      refetchComments();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    },
  });

  // Make an investment mutation
  const investMutation = useMutation({
    mutationFn: async (investmentData: { inventionId: number; investorId: number; amount: string }) => {
      const response = await fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(investmentData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to make investment");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Investment made",
        description: "Your investment has been processed successfully",
      });
      setInvestmentAmount("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process investment",
        variant: "destructive",
      });
    },
  });

  // Handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user || !comment.trim()) {
      return;
    }
    
    commentMutation.mutate({
      inventionId,
      userId: user.id,
      content: comment.trim(),
    });
  };

  // Handle investment submission
  const handleInvestmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user || !investmentAmount.trim()) {
      return;
    }
    
    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid investment amount",
        variant: "destructive",
      });
      return;
    }
    
    investMutation.mutate({
      inventionId,
      investorId: user.id,
      amount: amount.toString(),
    });
  };

  // Check if the current user is the inventor
  const isInventor = user && invention && user.id === invention.inventorId;

  // Check if the user has already invested
  const hasInvested = user && investments?.some(inv => inv.investorId === user.id);

  if (isLoadingInvention) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!invention) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-4">Invention not found</h1>
        <Button asChild>
          <Link href="/inventions">Back to Inventions</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <div className="flex text-sm text-gray-500">
        <Link href="/inventions" className="hover:text-blue-600">
          Inventions
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-900">{invention.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invention header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline">{invention.category}</Badge>
              <Badge
                variant={
                  invention.status === "completed" ? "default" :
                  invention.status === "in-progress" ? "secondary" : "outline"
                }
              >
                {invention.status.charAt(0).toUpperCase() + invention.status.slice(1)}
              </Badge>
              {invention.patentStatus && (
                <Badge variant="outline">{invention.patentStatus}</Badge>
              )}
              {invention.forSale && (
                <Badge className="bg-green-100 text-green-800">For Sale</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{invention.title}</h1>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>Created by {inventor?.name || "Unknown"}</span>
              <span className="mx-2">•</span>
              <span>{new Date(invention.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Invention images */}
          <div className="rounded-lg overflow-hidden bg-gray-100">
            {invention.images && invention.images.length > 0 ? (
              <img
                src={invention.images[0]}
                alt={invention.title}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Invention tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              {invention.aiAssistance && (
                <TabsTrigger value="ai-feedback">AI Feedback</TabsTrigger>
              )}
            </TabsList>
            
            {/* Details tab */}
            <TabsContent value="details">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <p>{invention.description}</p>
                    
                    {invention.tags && invention.tags.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-md font-medium">Tags:</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {invention.tags.map((tag, i) => (
                            <Badge key={i} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Updates tab */}
            <TabsContent value="updates">
              <Card>
                <CardContent className="pt-6">
                  {updates && updates.length > 0 ? (
                    <div className="space-y-6">
                      {updates.map((update) => (
                        <div key={update.id} className="pb-6 border-b last:border-0">
                          <h3 className="text-lg font-medium mb-1">{update.title}</h3>
                          <div className="text-sm text-gray-500 mb-3">
                            {new Date(update.createdAt).toLocaleDateString()}
                          </div>
                          <p>{update.content}</p>
                          
                          {update.images && update.images.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-2">
                              {update.images.map((img, i) => (
                                <img
                                  key={i}
                                  src={img}
                                  alt={`Update ${i+1}`}
                                  className="rounded-md h-40 object-cover"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-6 text-gray-500">
                      No updates available yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Comments tab */}
            <TabsContent value="comments">
              <Card>
                <CardContent className="pt-6">
                  {/* Comment form */}
                  {isAuthenticated ? (
                    <form onSubmit={handleCommentSubmit} className="mb-6">
                      <Textarea
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mb-2"
                      />
                      <Button type="submit" disabled={commentMutation.isPending}>
                        {commentMutation.isPending ? "Posting..." : "Post Comment"}
                      </Button>
                    </form>
                  ) : (
                    <div className="mb-6 p-4 bg-gray-50 rounded-md text-center">
                      <p className="text-gray-600 mb-2">You need to be logged in to comment</p>
                      <Button asChild>
                        <Link href="/login">Log In</Link>
                      </Button>
                    </div>
                  )}
                  
                  {/* Comments list */}
                  {comments && comments.length > 0 ? (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="pb-4 border-b last:border-0">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                              <span className="text-xs font-bold">
                                {comment.userId.toString().charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">User {comment.userId}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-gray-500">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* AI Feedback tab */}
            {invention.aiAssistance && (
              <TabsContent value="ai-feedback">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center py-6 text-gray-500">
                      AI feedback will appear here when available.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Funding card */}
          {invention.fundingGoal && (
            <Card>
              <CardHeader>
                <CardTitle>Funding Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between font-medium">
                    <span>${invention.currentFunding || "0"}</span>
                    <span>of ${invention.fundingGoal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Number(invention.currentFunding || 0) / Number(invention.fundingGoal) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {Math.round(
                      Number(invention.currentFunding || 0) / Number(invention.fundingGoal) * 100
                    )}% funded
                  </div>
                </div>

                {/* Investment form */}
                {isAuthenticated && user?.isInvestor && !isInventor && !hasInvested && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">Invest Now</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invest in {invention.title}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleInvestmentSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <label htmlFor="amount" className="text-sm font-medium">
                            Investment Amount ($)
                          </label>
                          <Input
                            id="amount"
                            type="number"
                            min="1"
                            step="0.01"
                            placeholder="Enter amount"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={investMutation.isPending}>
                          {investMutation.isPending ? "Processing..." : "Confirm Investment"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}

                {hasInvested && (
                  <div className="bg-green-50 text-green-700 p-3 rounded-md text-center">
                    You've already invested in this invention
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* For sale card */}
          {invention.forSale && invention.salePrice && (
            <Card>
              <CardHeader>
                <CardTitle>For Sale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">${invention.salePrice}</div>
                <Button className="w-full">Contact Seller</Button>
              </CardContent>
            </Card>
          )}

          {/* Inventor card */}
          {inventor && (
            <Card>
              <CardHeader>
                <CardTitle>About the Inventor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  {inventor.avatar ? (
                    <img
                      src={inventor.avatar}
                      alt={inventor.name}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <span className="text-lg font-bold">
                        {inventor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{inventor.name}</div>
                    <div className="text-sm text-gray-500">@{inventor.username}</div>
                  </div>
                </div>
                {inventor.bio && <p className="text-gray-600">{inventor.bio}</p>}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}