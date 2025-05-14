import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Future Forge</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            The platform connecting inventors with investors to bring revolutionary ideas to life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button asChild size="lg" className="px-8">
                  <Link href="/register">Sign Up</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                  <Link href="/login">Log In</Link>
                </Button>
              </>
            ) : (
              <Button asChild size="lg" className="px-8">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How Future Forge Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Your Invention</h3>
              <p className="text-gray-600">
                Create a profile and showcase your invention to potential investors and the community.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Funded</h3>
              <p className="text-gray-600">
                Connect with investors who see the potential in your idea and receive the funding you need.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="bg-purple-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Bring Ideas to Life</h3>
              <p className="text-gray-600">
                Use AI-powered assistance and community feedback to refine and improve your invention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-xl">JD</span>
                </div>
                <div>
                  <h3 className="font-semibold">Jane Doe</h3>
                  <p className="text-sm text-gray-500">Smart Home Inventor</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Future Forge helped me connect with the perfect investors for my smart home device. 
                The platform's AI feedback was invaluable in refining my prototype."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold text-xl">MS</span>
                </div>
                <div>
                  <h3 className="font-semibold">Michael Smith</h3>
                  <p className="text-sm text-gray-500">Angel Investor</p>
                </div>
              </div>
              <p className="text-gray-600">
                "As an investor, Future Forge has connected me with innovative ideas that I would never have discovered otherwise. 
                The quality of inventions on this platform is impressive."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Forge the Future?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of inventors and investors today. Get a 7-day free trial for inventors!
          </p>
          <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-gray-100 px-8">
            <Link href="/register">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}