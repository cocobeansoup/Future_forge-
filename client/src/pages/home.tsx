import React, { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { TrendingUp, Lightbulb, Users, ArrowRight, Rocket, Layers, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Invention } from '@shared/schema';
import FeaturedSpotlight from '@/components/FeaturedSpotlight';
import AchievementBadges from '@/components/AchievementBadges';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [showVideo, setShowVideo] = useState(false);
  
  // Fetch trending inventions
  const { data: trendingInventions, isLoading } = useQuery<Invention[]>({
    queryKey: ['/api/inventions'],
    select: (data) => {
      // Sort by trending score or view count and take top 3
      return [...data]
        .sort((a, b) => {
          const aTrending = a.trendingScore ? Number(a.trendingScore) : 0;
          const bTrending = b.trendingScore ? Number(b.trendingScore) : 0;
          return bTrending - aTrending;
        })
        .slice(0, 3);
    },
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 dark:from-blue-950 dark:via-purple-950 dark:to-indigo-950 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIj48L3JlY3Q+PC9zdmc+')] opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 uppercase">
                Future Forge
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 font-light">
              Innovation's Launchpad. Tomorrow's Technology, Today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {!isAuthenticated ? (
                <>
                  <Link href="/signup">
                    <a className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 text-center">
                      Start Creating
                    </a>
                  </Link>
                  <button
                    onClick={() => setShowVideo(true)}
                    className="border-2 border-blue-300 text-blue-100 hover:bg-blue-600/20 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg"
                  >
                    Watch Demo
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-6">
                  <Link href="/create">
                    <a className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105">
                      Create Invention
                    </a>
                  </Link>
                  <div className="text-blue-100">
                    <p className="text-sm opacity-90">Welcome back,</p>
                    <p className="font-semibold">{user?.name || user?.username}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Achievement Badges for logged in users */}
            {isAuthenticated && user && (
              <div className="mb-8">
                <AchievementBadges
                  userId={user.id}
                  inventions={0} // TODO: Get from API
                  investments={0} // TODO: Get from API
                  views={0} // TODO: Get from API
                  funding={0} // TODO: Get from API
                  compact={true}
                />
              </div>
            )}
            
            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/explore">
                <a className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center font-medium">
                  Explore Inventions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Link>
              
              {!isAuthenticated && (
                <Link href="/signup">
                  <a className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors flex items-center font-medium">
                    Sign Up Free
                    <Rocket className="ml-2 h-5 w-5" />
                  </a>
                </Link>
              )}
            </div>
            
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">AI-Powered</h3>
                  <p className="text-blue-200">Get instant feedback on your ideas</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center mr-4">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">3D Modeling</h3>
                  <p className="text-blue-200">Visualize your inventions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Spotlight */}
      {trendingInventions && trendingInventions.length > 0 && (
        <FeaturedSpotlight 
          inventions={trendingInventions} 
          title="Featured Inventions"
          subtitle="Discover the most innovative projects this week"
        />
      )}
      
      {/* Trending Inventions Fallback */}
      {(!trendingInventions || trendingInventions.length === 0) && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-10">
              <TrendingUp className="text-red-500 mr-3 h-6 w-6" />
              <h2 className="text-2xl md:text-3xl font-bold dark:text-white">Featured Inventions</h2>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-12 rounded-lg text-center">
                <Lightbulb className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 dark:text-white">No inventions yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Be the first to share your innovative ideas on Future Forge!
                </p>
                <Link href="/create">
                  <a className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                    Create First Invention
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center dark:text-white">How Future Forge Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Create</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Submit your invention with the help of our AI-powered tools to create 3D models, improve designs, and analyze market potential.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Connect</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with potential investors and receive feedback from the community to refine your invention further.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Fund</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Secure funding from interested investors, track your progress, and bring your innovation to market with our support.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Bring Your Ideas to Life?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of inventors, investors, and innovators today and be part of shaping the technologies of tomorrow.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link href="/signup">
                  <a className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium">
                    Sign Up Now
                  </a>
                </Link>
                <Link href="/explore">
                  <a className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white rounded-md transition-colors font-medium">
                    Browse Inventions
                  </a>
                </Link>
              </>
            ) : (
              <>
                <Link href="/model-workspace">
                  <a className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium">
                    Create New Invention
                  </a>
                </Link>
                <Link href="/explore">
                  <a className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white rounded-md transition-colors font-medium">
                    Browse Inventions
                  </a>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}