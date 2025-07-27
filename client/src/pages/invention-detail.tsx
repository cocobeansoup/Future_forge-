import React, { useState } from 'react';
import { Link, useParams } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Invention, Comment, Investment, AIFeedback } from '@shared/schema';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  DollarSign, 
  MessageCircle, 
  Eye, 
  Calendar,
  User,
  Lightbulb,
  TrendingUp,
  Camera,
  Video,
  FileText,
  Bot,
  Star,
  Target,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export default function InventionDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);

  // Fetch invention details
  const { data: invention, isLoading } = useQuery<Invention>({
    queryKey: ['/api/inventions', id],
    enabled: !!id,
  });

  // Fetch comments
  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ['/api/inventions', id, 'comments'],
    enabled: !!id,
  });

  // Fetch investments
  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ['/api/inventions', id, 'investments'],
    enabled: !!id,
  });

  // Fetch AI feedback
  const { data: aiFeedback = [] } = useQuery<AIFeedback[]>({
    queryKey: ['/api/inventions', id, 'ai-feedback'],
    enabled: !!id,
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('Must be logged in to comment');
      return apiRequest('POST', '/api/comments', {
        inventionId: parseInt(id!),
        userId: user.id,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventions', id, 'comments'] });
      setComment('');
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error posting comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create investment mutation
  const createInvestmentMutation = useMutation({
    mutationFn: async (amount: string) => {
      if (!user) throw new Error('Must be logged in to invest');
      return apiRequest('POST', '/api/investments', {
        inventionId: parseInt(id!),
        investorId: user.id,
        amount: parseFloat(amount),
        message: `Investment of $${amount}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventions', id, 'investments'] });
      setInvestmentAmount('');
      setShowInvestmentForm(false);
      toast({
        title: "Investment successful",
        description: "Your investment has been processed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Investment failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate AI feedback mutation
  const generateAIFeedbackMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/ai-feedback', {
        inventionId: parseInt(id!)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventions', id, 'ai-feedback'] });
      toast({
        title: "AI Feedback generated",
        description: "New AI analysis has been added to this invention.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "AI Feedback failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!invention) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invention not found</h1>
          <Link href="/explore">
            <a className="text-blue-600 hover:text-blue-800">← Back to explore</a>
          </Link>
        </div>
      </div>
    );
  }

  const fundingPercentage = invention.fundingGoal 
    ? (Number(invention.currentFunding || 0) / Number(invention.fundingGoal)) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/explore">
            <a className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Explore
            </a>
          </Link>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center rounded-t-lg">
                  {invention.images && invention.images.length > 0 ? (
                    <img
                      src={invention.images[0]}
                      alt={invention.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Lightbulb className="h-24 w-24 mb-4" />
                      <p>No image available</p>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="secondary">{invention.category}</Badge>
                    <Badge variant={invention.status === 'completed' ? 'default' : 'outline'}>
                      {invention.status}
                    </Badge>
                    {invention.aiAssistance && (
                      <Badge variant="outline" className="text-purple-600 border-purple-600">
                        <Bot className="h-3 w-3 mr-1" />
                        AI Enhanced
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-2 dark:text-white">{invention.title}</h1>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                    <User className="h-4 w-4 mr-2" />
                    <span>Inventor #{invention.inventorId}</span>
                    <span className="mx-2">•</span>
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{invention.viewCount || 0} views</span>
                    <span className="mx-2">•</span>
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(invention.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabbed Content */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">
                  <FileText className="h-4 w-4 mr-2" />
                  Description
                </TabsTrigger>
                <TabsTrigger value="gallery">
                  <Camera className="h-4 w-4 mr-2" />
                  Gallery
                </TabsTrigger>
                <TabsTrigger value="ai-analysis">
                  <Bot className="h-4 w-4 mr-2" />
                  AI Analysis
                </TabsTrigger>
                <TabsTrigger value="updates">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Updates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Invention</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {invention.description}
                    </p>
                    
                    {invention.tags && invention.tags.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {invention.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {invention.patentStatus && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-2">Patent Status</h4>
                        <Badge variant={invention.patentStatus === 'granted' ? 'default' : 'outline'}>
                          {invention.patentStatus}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Media Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {invention.images && invention.images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {invention.images.map((image, index) => (
                          <div key={index} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`${invention.title} - Image ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Camera className="h-12 w-12 mx-auto mb-4" />
                        <p>No images available for this invention</p>
                      </div>
                    )}

                    {invention.videos && invention.videos.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-4">Videos</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {invention.videos.map((video, index) => (
                            <div key={index} className="aspect-video bg-black rounded-lg overflow-hidden">
                              <video
                                src={video}
                                controls
                                className="w-full h-full"
                                poster="/api/placeholder/400/225"
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!invention.images || invention.images.length === 0) && 
                     (!invention.videos || invention.videos.length === 0) && (
                      <div className="text-center py-12 text-gray-500">
                        <Video className="h-16 w-16 mx-auto mb-4" />
                        <p>No media available for this invention</p>
                        <p className="text-sm">Media uploads help build trust with potential investors</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai-analysis" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">AI-Powered Analysis</h3>
                  <Button 
                    onClick={() => generateAIFeedbackMutation.mutate()}
                    disabled={generateAIFeedbackMutation.isPending}
                    size="sm"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    {generateAIFeedbackMutation.isPending ? 'Analyzing...' : 'Generate New Analysis'}
                  </Button>
                </div>

                {aiFeedback.length > 0 ? (
                  <div className="space-y-4">
                    {aiFeedback.map((feedback, index) => (
                      <Card key={feedback.id || index}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center">
                              <Bot className="h-5 w-5 mr-2 text-purple-600" />
                              AI Analysis #{aiFeedback.length - index}
                            </CardTitle>
                            <span className="text-sm text-gray-500">
                              {new Date(feedback.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Target className="h-4 w-4 mr-2" />
                              Overall Feedback
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300">{feedback.feedback}</p>
                          </div>

                          {feedback.suggestedImprovements && (
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center">
                                <Star className="h-4 w-4 mr-2" />
                                Suggested Improvements
                              </h4>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                  {typeof feedback.suggestedImprovements === 'string' 
                                    ? feedback.suggestedImprovements 
                                    : JSON.stringify(feedback.suggestedImprovements, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}

                          {feedback.marketAnalysis && (
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Market Analysis
                              </h4>
                              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                  {typeof feedback.marketAnalysis === 'string' 
                                    ? feedback.marketAnalysis 
                                    : JSON.stringify(feedback.marketAnalysis, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Bot className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h4 className="font-semibold mb-2">No AI Analysis Yet</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Get AI-powered feedback on your invention's design, market potential, and suggested improvements.
                      </p>
                      <Button 
                        onClick={() => generateAIFeedbackMutation.mutate()}
                        disabled={generateAIFeedbackMutation.isPending}
                      >
                        <Bot className="h-4 w-4 mr-2" />
                        {generateAIFeedbackMutation.isPending ? 'Analyzing...' : 'Generate AI Analysis'}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="updates" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="h-16 w-16 mx-auto mb-4" />
                      <p>No updates available yet</p>
                      <p className="text-sm">Updates from the inventor will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Card */}
            {invention.fundingGoal && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Funding Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Raised</span>
                        <span>{fundingPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          ${Number(invention.currentFunding || 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">raised</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          ${Number(invention.fundingGoal).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">goal</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {investments.length} investor{investments.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {isAuthenticated && user?.isInvestor && (
                      <div className="space-y-3">
                        {!showInvestmentForm ? (
                          <Button 
                            onClick={() => setShowInvestmentForm(true)}
                            className="w-full"
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Invest Now
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <Input
                              type="number"
                              placeholder="Investment amount ($)"
                              value={investmentAmount}
                              onChange={(e) => setInvestmentAmount(e.target.value)}
                            />
                            <div className="flex space-x-2">
                              <Button 
                                onClick={() => createInvestmentMutation.mutate(investmentAmount)}
                                disabled={!investmentAmount || createInvestmentMutation.isPending}
                                className="flex-1"
                              >
                                {createInvestmentMutation.isPending ? 'Processing...' : 'Confirm'}
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => {
                                  setShowInvestmentForm(false);
                                  setInvestmentAmount('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAuthenticated && (
                  <div className="space-y-3 mb-6">
                    <Textarea
                      placeholder="Share your thoughts on this invention..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                    />
                    <Button 
                      onClick={() => createCommentMutation.mutate(comment)}
                      disabled={!comment.trim() || createCommentMutation.isPending}
                      size="sm"
                    >
                      {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                )}

                <div className="space-y-4">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            U{comment.userId}
                          </div>
                          <div className="ml-3">
                            <p className="font-semibold text-sm">User #{comment.userId}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm ml-11">
                          {comment.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-2" />
                      <p>No comments yet</p>
                      <p className="text-sm">Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}