import React, { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { 
  Brain, 
  Users, 
  Lightbulb, 
  TrendingUp, 
  DollarSign, 
  Rocket, 
  Shield, 
  Star, 
  ArrowRight,
  ChevronRight 
} from 'lucide-react';

export default function Signup() {
  const { isAuthenticated } = useAuth();
  const [userType, setUserType] = useState<'inventor' | 'investor' | null>(null);
  
  const handleSelectType = (type: 'inventor' | 'investor') => {
    setUserType(type);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      {/* Tesla-like header with big brand name */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIj48L3JlY3Q+PC9zdmc+')] opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
              FUTURE FORGE
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-12 max-w-3xl mx-auto text-gray-300">
            Innovation's Launchpad. Tomorrow's Technology, Today.
          </p>
          
          {isAuthenticated ? (
            <div className="flex flex-col items-center">
              <p className="text-xl mb-6">You're already signed in!</p>
              <div className="flex gap-4">
                <Link href="/explore">
                  <a className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center font-medium">
                    Explore Inventions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Link>
                <Link href="/profile">
                  <a className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors font-medium">
                    Go to Profile
                  </a>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <button
                  onClick={() => handleSelectType('inventor')}
                  className={`group relative px-8 py-6 rounded-xl transition-all duration-300 w-full md:w-80 ${
                    userType === 'inventor' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-0' 
                      : 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-blue-500'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <Lightbulb className={`h-16 w-16 mb-4 ${userType === 'inventor' ? 'text-white' : 'text-blue-400 group-hover:text-blue-300'}`} />
                    <h3 className="text-2xl font-bold mb-2">I'm an Inventor</h3>
                    <p className="text-gray-300">I want to showcase my innovations and find investors</p>
                  </div>
                </button>
                
                <button
                  onClick={() => handleSelectType('investor')}
                  className={`group relative px-8 py-6 rounded-xl transition-all duration-300 w-full md:w-80 ${
                    userType === 'investor' 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 border-0' 
                      : 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-green-500'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <DollarSign className={`h-16 w-16 mb-4 ${userType === 'investor' ? 'text-white' : 'text-green-400 group-hover:text-green-300'}`} />
                    <h3 className="text-2xl font-bold mb-2">I'm an Investor</h3>
                    <p className="text-gray-300">I want to discover promising innovations to invest in</p>
                  </div>
                </button>
              </div>
              
              <Link href="/api/login">
                <a className={`
                  px-12 py-4 text-lg font-medium rounded-md transition-all duration-300 flex items-center
                  ${!userType 
                    ? 'bg-gray-700 text-gray-300 cursor-not-allowed opacity-70' 
                    : userType === 'inventor'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                  }
                `}
                  onClick={(e) => !userType && e.preventDefault()}
                >
                  Create Your Account
                  <ChevronRight className="ml-2 h-5 w-5" />
                </a>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Benefits sections */}
      <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Why Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Future Forge</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 transform transition-transform hover:scale-[1.02]">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
                <Lightbulb className="text-blue-400 mr-3 h-8 w-8" />
                For Inventors
              </h3>
              
              <ul className="space-y-4">
                <li className="flex">
                  <Brain className="text-blue-400 mr-3 h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">AI-Powered Design Assistance</h4>
                    <p className="text-gray-300">Get intelligent feedback on your designs and automatic 3D modeling suggestions to perfect your invention</p>
                  </div>
                </li>
                <li className="flex">
                  <TrendingUp className="text-blue-400 mr-3 h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">Market Analysis</h4>
                    <p className="text-gray-300">Receive detailed market assessments for your innovations with potential pricing, target audiences, and competitive analysis</p>
                  </div>
                </li>
                <li className="flex">
                  <Users className="text-blue-400 mr-3 h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">Direct Investor Access</h4>
                    <p className="text-gray-300">Connect with verified investors looking for the next big innovation in your specific industry</p>
                  </div>
                </li>
                <li className="flex">
                  <Shield className="text-blue-400 mr-3 h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">IP Protection Tools</h4>
                    <p className="text-gray-300">Keep your ideas safe with our built-in intellectual property protection tools and resources</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8 p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
                <h4 className="font-semibold flex items-center">
                  <Star className="text-yellow-400 mr-2 h-5 w-5" />
                  Premium Inventor Features
                </h4>
                <p className="text-gray-300 text-sm">Start with a 7-day free trial, then just $20/month for all premium features, 3D modeling workspace, and AI assistance</p>
              </div>
            </div>
            
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 transform transition-transform hover:scale-[1.02]">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
                <DollarSign className="text-green-400 mr-3 h-8 w-8" />
                For Investors
              </h3>
              
              <ul className="space-y-4">
                <li className="flex">
                  <Rocket className="text-green-400 mr-3 h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">Early Access to Innovations</h4>
                    <p className="text-gray-300">Discover groundbreaking inventions before they hit the market, with complete 3D visualizations and prototypes</p>
                  </div>
                </li>
                <li className="flex">
                  <TrendingUp className="text-green-400 mr-3 h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">Data-Driven Investment Opportunities</h4>
                    <p className="text-gray-300">Use our AI-powered analytics to identify high-potential inventions based on market trends and consumer demand</p>
                  </div>
                </li>
                <li className="flex">
                  <Shield className="text-green-400 mr-3 h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">Secure Transaction Platform</h4>
                    <p className="text-gray-300">Invest with confidence using our secure, transparent investment platform with built-in legal frameworks</p>
                  </div>
                </li>
                <li className="flex">
                  <Users className="text-green-400 mr-3 h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">Direct Inventor Communication</h4>
                    <p className="text-gray-300">Connect directly with inventors to discuss potential improvements or customizations before investing</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8 p-4 bg-green-900/30 border border-green-800 rounded-lg">
                <h4 className="font-semibold flex items-center">
                  <Star className="text-yellow-400 mr-2 h-5 w-5" />
                  Free Access For Investors
                </h4>
                <p className="text-gray-300 text-sm">Browsing and basic investment features are completely free - we only take a 5% fee on successful investments</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/api/login">
              <a className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white rounded-md transition-colors text-xl font-medium inline-flex items-center">
                Join Future Forge Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Link>
            <p className="mt-4 text-gray-400">No credit card required to get started</p>
          </div>
        </div>
      </section>
    </div>
  );
}