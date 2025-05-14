import React, { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { TrendingUp, Lightbulb, Users, ArrowRight, Rocket, Layers, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Invention } from '@shared/schema';

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
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                Future Forge
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Where inventors meet investors to build the innovations of tomorrow
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/explore">
                <a className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center font-medium">
                  Explore Inventions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Link>
              
              {!isAuthenticated && (
                <Link href="/api/login">
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
      
      {/* Trending Inventions Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-10">
            <TrendingUp className="text-red-500 mr-3 h-6 w-6" />
            <h2 className="text-2xl md:text-3xl font-bold dark:text-white">Trending Inventions</h2>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingInventions && trendingInventions.length > 0 ? (
                trendingInventions.map((invention) => (
                  <div key={invention.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-300 relative">
                      {invention.images && invention.images.length > 0 ? (
                        <img
                          src={invention.images[0]}
                          alt={invention.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                          <Lightbulb className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <TrendingUp size={12} className="mr-1" />
                        Trending
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold dark:text-white">{invention.title}</h3>
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-1 rounded">
                          {invention.category}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{invention.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Funding: ${Number(invention.currentFunding || 0).toLocaleString()} / ${Number(invention.fundingGoal || 0).toLocaleString()}
                        </span>
                        <Link href={`/inventions/${invention.id}`}>
                          <a className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                            View Details →
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 bg-white dark:bg-gray-800 p-8 rounded-lg text-center">
                  <p className="text-gray-600 dark:text-gray-400">No trending inventions available.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Link href="/explore">
              <a className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                View All Inventions
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Link>
          </div>
        </div>
      </section>
      
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
                <Link href="/api/login">
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