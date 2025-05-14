import React, { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Camera, Edit2, CreditCard, Settings, User, LogOut, Mail, Key, ExternalLink } from "lucide-react";

export default function Profile() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for editing mode and form values
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: ""
  });
  
  // State for handling avatar preview
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Load user data when authenticated
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["/api/users", user?.id],
    enabled: !!user && isAuthenticated,
    onSuccess: (data) => {
      setFormData({
        name: data.name || "",
        email: data.email || "",
        bio: data.bio || "",
        avatar: data.avatar || ""
      });
    }
  });
  
  // Load user's inventions
  const { data: userInventions, isLoading: isInventionsLoading } = useQuery({
    queryKey: ["/api/users", user?.id, "inventions"],
    enabled: !!user && isAuthenticated
  });
  
  // Load user's investments
  const { data: userInvestments, isLoading: isInvestmentsLoading } = useQuery({
    queryKey: ["/api/users", user?.id, "investments"],
    enabled: !!user && isAuthenticated
  });
  
  // Load subscription status
  const { data: subscriptionStatus } = useQuery({
    queryKey: ["/api/subscription/status", user?.id],
    enabled: !!user && isAuthenticated && !!user?.isInventor
  });
  
  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (data: any) => {
      if (!user) throw new Error("No user authenticated");
      const response = await apiRequest("PATCH", `/api/users/${user.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    }
  });
  
  // Handle edit button click
  const handleEditClick = () => {
    setIsEditing(true);
    // Initialize form data with current user data
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        bio: userData.bio || "",
        avatar: userData.avatar || ""
      });
    }
  };
  
  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle avatar upload click
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle avatar file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview the avatar
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // In a real app, you would upload the file to a server and get a URL back
    // For now, we'll just use the preview as the new avatar
    // This is a simplification - in production, use proper file upload to a CDN or backend
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = { ...formData };
    
    // If we have a new avatar preview, include it in the update
    if (avatarPreview) {
      updatedData.avatar = avatarPreview;
    }
    
    updateProfile.mutate(updatedData);
  };
  
  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setAvatarPreview(null);
  };
  
  // If still loading auth or user data
  if (isAuthLoading || isUserLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  // If not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded">
          <p>Please log in to view and manage your profile.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 h-32 relative">
              {/* User avatar */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-white dark:bg-gray-700 p-1">
                    <div className="h-full w-full rounded-full overflow-hidden bg-gray-300 relative">
                      {isEditing && avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Avatar Preview" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        userData?.avatar ? (
                          <img 
                            src={userData.avatar} 
                            alt={userData.name || "User"} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                            <User size={36} className="text-gray-500 dark:text-gray-400" />
                          </div>
                        )
                      )}
                      
                      {isEditing && (
                        <button 
                          onClick={handleAvatarClick}
                          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full text-white"
                        >
                          <Camera size={20} />
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* User info */}
            <div className="pt-16 pb-6 px-6">
              <div className="text-center mb-4">
                <h1 className="text-xl font-bold dark:text-white">{userData?.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">{userData?.email}</p>
                <div className="mt-2 flex justify-center space-x-2">
                  {userData?.isInventor && (
                    <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded">
                      Inventor
                    </span>
                  )}
                  {userData?.isInvestor && (
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded">
                      Investor
                    </span>
                  )}
                </div>
              </div>
              
              {/* User bio */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Bio</h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {userData?.bio || "No bio available."}
                </p>
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-center">
                {!isEditing ? (
                  <button
                    onClick={handleEditClick}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    <Edit2 size={16} className="mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Navigation menu */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <nav className="px-4 py-2">
                <ul className="space-y-1">
                  <li>
                    <a 
                      href="/profile" 
                      className="flex items-center px-3 py-2 text-sm rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium"
                    >
                      <User size={16} className="mr-3" />
                      Profile
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/profile/payment" 
                      className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <CreditCard size={16} className="mr-3" />
                      Subscription & Payments
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/profile/settings" 
                      className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Settings size={16} className="mr-3" />
                      Account Settings
                    </a>
                  </li>
                  <li>
                    <button 
                      className="w-full flex items-center px-3 py-2 text-sm rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Subscription card - only shown for inventors */}
          {userData?.isInventor && (
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 px-6 py-4">
                <h2 className="text-white font-bold text-lg">Inventor Subscription</h2>
              </div>
              <div className="p-6">
                {subscriptionStatus?.active ? (
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      <span className="font-medium dark:text-white">Active Subscription</span>
                    </div>
                    
                    {subscriptionStatus?.onTrial ? (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        You are currently on a free trial. {subscriptionStatus?.daysRemaining > 0 && `${subscriptionStatus.daysRemaining} days remaining.`}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Your subscription renews on {new Date(subscriptionStatus?.endDate).toLocaleDateString()}.
                      </p>
                    )}
                    
                    <a
                      href="/profile/payment"
                      className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors text-sm"
                    >
                      Manage Subscription
                    </a>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      <span className="font-medium dark:text-white">Inactive Subscription</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {userData.trialUsed 
                        ? "Your trial period has ended. Subscribe to continue using inventor features."
                        : "Start your 7-day free trial to access all inventor features."}
                    </p>
                    
                    <a
                      href="/profile/payment"
                      className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors text-sm"
                    >
                      {userData.trialUsed ? "Subscribe Now" : "Start Free Trial"}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Profile edit form or content */}
        <div className="lg:col-span-2">
          {/* Edit form */}
          {isEditing ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6 dark:text-white">Edit Profile</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-1 dark:text-white">Inventions</h3>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {isInventionsLoading ? "..." : userInventions?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {userData?.isInventor ? "Your created inventions" : "Inventions you're following"}
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-1 dark:text-white">Investments</h3>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {isInvestmentsLoading ? "..." : userInvestments?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Your active investments
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-1 dark:text-white">Account Type</h3>
                  <div className="flex space-x-2 mt-2">
                    {userData?.isInventor && (
                      <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-sm font-medium px-2.5 py-0.5 rounded">
                        Inventor
                      </span>
                    )}
                    {userData?.isInvestor && (
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-medium px-2.5 py-0.5 rounded">
                        Investor
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {userData?.isInventor && userData?.isInvestor 
                      ? "You can both create and invest"
                      : userData?.isInventor 
                        ? "You can create inventions"
                        : "You can invest in inventions"}
                  </p>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6 dark:text-white">Recent Activity</h2>
                
                {/* Activity list */}
                <div className="space-y-6">
                  {/* Example activity items - in a real app these would come from the API */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Edit2 size={18} />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-base font-medium dark:text-white">Profile Updated</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">2 days ago</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        You updated your profile information.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                      <Mail size={18} />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-base font-medium dark:text-white">Email Verified</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">5 days ago</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your email address has been verified.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <Key size={18} />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-base font-medium dark:text-white">Account Created</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">1 week ago</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Welcome to Future Forge! Your account has been created.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* External Account Connections */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold dark:text-white">Connected Accounts</h2>
                  <a href="/profile/settings" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Manage Connections
                  </a>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <span className="text-xl font-bold">G</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base font-medium dark:text-white">Google</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Connect your Google account for easier login
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center px-3 py-1 text-sm border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <ExternalLink size={14} className="mr-1" />
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}