import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  isInventor: boolean;
  isInvestor: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  password: string;
  name: string;
  email: string;
  bio?: string;
  isInventor?: boolean;
  isInvestor?: boolean;
}

export function useAuth() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Check if token exists in localStorage
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("auth_token");
  });
  
  // Fetch user data if token exists
  const { data: user, error, isLoading, refetch } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    // If error is 401 (unauthorized), clear token
    if (error && (error as any).status === 401) {
      logout();
    }
  }, [error]);
  
  // Login mutation
  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      setToken(data.token);
      refetch();
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to login. Please check your credentials.",
        variant: "destructive",
      });
    },
  });
  
  // Register mutation
  const register = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Account created successfully. Please log in.",
      });
      setLocation("/login");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Logout function
  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    queryClient.clear();
    setLocation("/login");
  };
  
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: login.mutate,
    isLoginLoading: login.isPending,
    register: register.mutate,
    isRegisterLoading: register.isPending,
    logout,
  };
}