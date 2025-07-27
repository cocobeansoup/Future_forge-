import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import ReferralSystem from '@/components/ReferralSystem';

export default function Referrals() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Gift className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
            <p className="text-gray-600 mb-4">
              You need to be logged in to access the referral system.
            </p>
            <Link href="/signup">
              <a>
                <Button>Sign Up / Login</Button>
              </a>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/profile">
            <a className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-6">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Profile
            </a>
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Referral Program</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Invite friends and earn bonus days on your subscription
            </p>
          </div>
        </div>

        {/* Referral System */}
        <ReferralSystem />
      </div>
    </div>
  );
}