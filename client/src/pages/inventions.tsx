import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

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
}

export default function Inventions() {
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Fetch all inventions
  const { data: inventions, isLoading } = useQuery<Invention[]>({
    queryKey: ["/api/inventions"],
  });

  // Filter inventions based on search term and filters
  const filteredInventions = inventions?.filter((invention) => {
    // Search term filter
    const matchesSearch = 
      searchTerm === "" ||
      invention.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invention.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "" || invention.category === categoryFilter;
    
    // Status filter
    const matchesStatus = statusFilter === "" || invention.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Unique categories for filter dropdown
  const categories = [...new Set(inventions?.map(inv => inv.category) || [])];
  
  // Status options
  const statusOptions = ["in-progress", "completed", "prototype"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Inventions</h1>
        {isAuthenticated && user?.isInventor && (
          <Button asChild>
            <Link href="/inventions/create">Create New Invention</Link>
          </Button>
        )}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search inventions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inventions grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredInventions?.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No inventions found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventions?.map((invention) => (
            <Card key={invention.id} className="overflow-hidden flex flex-col">
              {/* Invention image or placeholder */}
              <div className="h-48 bg-gray-100 relative">
                {invention.images && invention.images[0] ? (
                  <img
                    src={invention.images[0]}
                    alt={invention.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Status badge */}
                <Badge
                  className="absolute top-2 right-2"
                  variant={
                    invention.status === "completed" ? "default" :
                    invention.status === "in-progress" ? "secondary" : "outline"
                  }
                >
                  {invention.status.charAt(0).toUpperCase() + invention.status.slice(1)}
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-xl line-clamp-1">{invention.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500">
                  <Badge variant="outline" className="mr-2">{invention.category}</Badge>
                  {invention.patentStatus && (
                    <Badge variant="outline">{invention.patentStatus}</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <p className="text-gray-600 line-clamp-3">{invention.description}</p>
                
                {/* Funding progress */}
                {invention.fundingGoal && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Funding Progress</span>
                      <span>
                        ${invention.currentFunding || "0"} / ${invention.fundingGoal}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
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
                  </div>
                )}
                
                {/* For sale badge */}
                {invention.forSale && (
                  <div className="mt-4 flex items-center">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800">
                      For Sale: ${invention.salePrice}
                    </Badge>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/inventions/${invention.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}