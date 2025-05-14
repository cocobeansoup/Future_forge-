import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Invention } from "@shared/schema";
import { Search, Filter, TrendingUp, RotateCcw } from "lucide-react";

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Query to fetch all inventions
  const { data: inventions, isLoading, error } = useQuery<Invention[]>({
    queryKey: ["/api/inventions"],
  });
  
  // Categories from filtered inventions
  const categories = inventions 
    ? [...new Set(inventions.map(inv => inv.category))] 
    : [];
  
  // Filter inventions based on search query and category
  const filteredInventions = inventions 
    ? inventions.filter(inv => {
        const matchesSearch = searchQuery === "" || 
          inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inv.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategory === null || 
          inv.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      })
    : [];
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };
  
  // If we're still loading data
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  // If there was an error fetching data
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded">
          <p>Error loading inventions. Please try again later.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Explore Inventions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover groundbreaking ideas from inventors around the world
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-l-md ${viewMode === "grid" 
              ? "bg-blue-600 text-white dark:bg-blue-700" 
              : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-r-md ${viewMode === "list" 
              ? "bg-blue-600 text-white dark:bg-blue-700" 
              : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search inventions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative md:w-60">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              <Filter size={18} />
            </div>
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={resetFilters}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RotateCcw size={18} className="mr-2" />
            Reset
          </button>
        </div>
      </div>
      
      {/* Trending section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <TrendingUp className="text-red-500 mr-2" />
          <h2 className="text-xl font-bold">Trending Inventions</h2>
        </div>
        
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredInventions.length > 0 ? (
            filteredInventions
              .sort((a, b) => Number(b.viewCount || 0) - Number(a.viewCount || 0))
              .slice(0, 3)
              .map((invention) => (
                <div
                  key={invention.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                    viewMode === "list" ? "flex items-start" : ""
                  }`}
                >
                  <div 
                    className={`${
                      viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "h-48 w-full"
                    } bg-gray-300 relative`}
                  >
                    {invention.images && invention.images.length > 0 ? (
                      <img
                        src={invention.images[0]}
                        alt={invention.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                        <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                      <TrendingUp size={12} className="mr-1" />
                      Trending
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{invention.title}</h3>
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
            <div className="col-span-3 bg-gray-50 dark:bg-gray-900 p-8 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400">No trending inventions found. Try changing your filters.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* All Inventions */}
      <div>
        <h2 className="text-xl font-bold mb-4">All Inventions</h2>
        
        {filteredInventions.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredInventions.map((invention) => (
              <div
                key={invention.id}
                className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                  viewMode === "list" ? "flex items-start" : ""
                }`}
              >
                <div 
                  className={`${
                    viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "h-48 w-full"
                  } bg-gray-300 relative`}
                >
                  {invention.images && invention.images.length > 0 ? (
                    <img
                      src={invention.images[0]}
                      alt={invention.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                      <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{invention.title}</h3>
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
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400">No inventions found matching your criteria. Try changing your filters.</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <RotateCcw size={16} className="mr-2" />
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}