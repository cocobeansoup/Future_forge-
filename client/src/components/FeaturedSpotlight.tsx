import React from 'react';
import { Link } from 'wouter';
import { Star, TrendingUp, Eye, DollarSign, Calendar, Award, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Invention } from '@shared/schema';

interface User {
  id: number;
  name?: string;
  verified?: boolean;
}
import VerifiedBadge from './VerifiedBadge';

interface FeaturedSpotlightProps {
  inventions: (Invention & { inventor?: User })[];
  title?: string;
  subtitle?: string;
}

export function FeaturedSpotlight({ 
  inventions, 
  title = "Featured Inventions", 
  subtitle = "Discover the most innovative projects this week" 
}: FeaturedSpotlightProps) {
  
  if (!inventions || inventions.length === 0) {
    return null;
  }

  const featuredInvention = inventions[0];
  const otherInventions = inventions.slice(1, 4);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">{subtitle}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Featured Invention */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href={`/inventions/${featuredInvention.id}`}>
              <a className="block group">
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-0">
                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>

                    {/* Hero Image */}
                    <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 relative overflow-hidden">
                      {featuredInvention.images && featuredInvention.images.length > 0 ? (
                        <img
                          src={featuredInvention.images[0]}
                          alt={featuredInvention.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Lightbulb className="h-24 w-24 text-blue-500" />
                        </div>
                      )}
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Stats Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span className="text-sm">{formatNumber(featuredInvention.viewCount || 0)}</span>
                            </div>
                            <div className="flex items-center">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              <span className="text-sm">Trending</span>
                            </div>
                          </div>
                          
                          {featuredInvention.fundingGoal && (
                            <div className="text-right">
                              <div className="text-sm opacity-90">Funded</div>
                              <div className="font-bold">
                                {Math.round((Number(featuredInvention.currentFunding || 0) / Number(featuredInvention.fundingGoal)) * 100)}%
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                            {featuredInvention.title}
                          </h3>
                          
                          {/* Inventor Info */}
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                              {featuredInvention.inventor?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {featuredInvention.inventor?.name || `Inventor #${featuredInvention.inventorId}`}
                              </p>
                              <div className="flex items-center">
                                <VerifiedBadge verified={featuredInvention.inventor?.verified} size="sm" />
                                <span className="text-xs text-gray-500 ml-2">
                                  {new Date(featuredInvention.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Category Badge */}
                        <Badge variant="secondary" className="ml-4">
                          {featuredInvention.category}
                        </Badge>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                        {featuredInvention.description}
                      </p>

                      {/* Funding Progress */}
                      {featuredInvention.fundingGoal && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">Funding Progress</span>
                            <span>${Number(featuredInvention.currentFunding || 0).toLocaleString()} / ${Number(featuredInvention.fundingGoal).toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.min((Number(featuredInvention.currentFunding || 0) / Number(featuredInvention.fundingGoal)) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        View Full Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </Link>
          </motion.div>

          {/* Secondary Featured Inventions */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Also Featured
            </h3>
            
            {otherInventions.map((invention, index) => (
              <motion.div
                key={invention.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
              >
                <Link href={`/inventions/${invention.id}`}>
                  <a className="block group">
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex space-x-4">
                          {/* Thumbnail */}
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg overflow-hidden flex-shrink-0">
                            {invention.images && invention.images.length > 0 ? (
                              <img
                                src={invention.images[0]}
                                alt={invention.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Lightbulb className="h-8 w-8 text-blue-500" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                              {invention.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                              {invention.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs text-gray-500">
                                <Eye className="h-3 w-3 mr-1" />
                                <span>{formatNumber(invention.viewCount || 0)}</span>
                              </div>
                              
                              {invention.fundingGoal && (
                                <div className="text-xs font-medium text-green-600">
                                  {Math.round((Number(invention.currentFunding || 0) / Number(invention.fundingGoal)) * 100)}% funded
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              </motion.div>
            ))}

            {/* View All Button */}
            <Link href="/explore?filter=featured">
              <a>
                <Button variant="outline" className="w-full mt-4">
                  View All Featured
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedSpotlight;