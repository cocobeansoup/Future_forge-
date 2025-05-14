import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to Future Forge</h1>
      <p className="text-xl mb-8">
        A platform connecting inventors with investors to bring innovative ideas to life
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">For Inventors</h2>
          <p className="mb-4">
            Showcase your inventions, find funding, and get AI-powered feedback to improve your products.
          </p>
          {isAuthenticated && user?.isInventor ? (
            <Link to="/ai-assistant">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                Try AI Assistant
              </button>
            </Link>
          ) : (
            <p className="text-blue-600">
              Register as an inventor to access our AI assistant and other premium features.
            </p>
          )}
        </div>

        <div className="bg-gray-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">For Investors</h2>
          <p className="mb-4">
            Discover promising inventions, connect with innovative creators, and fund the future.
          </p>
          {isAuthenticated && user?.isInvestor ? (
            <Link to="/inventions">
              <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
                Browse Inventions
              </button>
            </Link>
          ) : (
            <p className="text-green-600">
              Register as an investor to browse investment opportunities.
            </p>
          )}
        </div>
      </div>

      {!isAuthenticated && (
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Get Started</h2>
          <div className="flex gap-4">
            <Link to="/login">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                Log In
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
                Register
              </button>
            </Link>
          </div>
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">AI-Powered Feedback</h3>
            <p>
              Get expert analysis and suggestions for your inventions using our advanced AI assistant.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">3D Model Creation</h3>
            <p className="mb-3">
              Turn your ideas into visual 3D models with AI-guided modeling suggestions.
            </p>
            <Link to="/model-workspace">
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Open 3D Workspace
              </button>
            </Link>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Market Analysis</h3>
            <p>
              Understand your target market, competitive landscape, and pricing strategies.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Bring Your Ideas to Life?</h2>
        <Link to={isAuthenticated ? "/inventions" : "/register"}>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 text-lg">
            {isAuthenticated ? "Explore Inventions" : "Join Future Forge"}
          </button>
        </Link>
      </div>
    </div>
  );
}