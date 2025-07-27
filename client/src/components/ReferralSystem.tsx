import React, { useState } from 'react';
import { Share2, Copy, Gift, Users, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ReferralData {
  referralCode: string;
  referralCount: number;
  bonusDays: number;
  referralLink: string;
}

export function ReferralSystem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralData, setReferralData] = useState<ReferralData>({
    referralCode: user?.id ? `FORGE${user.id.toString().padStart(4, '0')}` : 'FORGE0000',
    referralCount: 0,
    bonusDays: 0,
    referralLink: `${window.location.origin}/signup?ref=${user?.id ? `FORGE${user.id.toString().padStart(4, '0')}` : 'FORGE0000'}`
  });

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralData.referralLink);
      toast({
        title: "Link Copied!",
        description: "Your referral link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the link below.",
        variant: "destructive",
      });
    }
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralData.referralCode);
      toast({
        title: "Code Copied!",
        description: "Your referral code has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the code.",
        variant: "destructive",
      });
    }
  };

  const shareToSocial = (platform: 'twitter' | 'linkedin') => {
    const text = encodeURIComponent(`🚀 Just discovered Future Forge - where inventors meet investors! Join me and get +7 days free trial with my referral: ${referralData.referralLink}`);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralData.referralLink)}&summary=${text}`
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="space-y-6">
      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{referralData.referralCount}</div>
            <div className="text-sm text-gray-600">Friends Referred</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Gift className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{referralData.bonusDays}</div>
            <div className="text-sm text-gray-600">Bonus Days Earned</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">
              {referralData.referralCount >= 10 ? 'Gold' : referralData.referralCount >= 5 ? 'Silver' : 'Bronze'}
            </div>
            <div className="text-sm text-gray-600">Referral Tier</div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Program Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="h-5 w-5 mr-2" />
            Invite Friends & Get Rewarded
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">How it works:</h4>
            <ul className="text-sm space-y-1">
              <li>• Share your referral link with friends</li>
              <li>• They get <strong>+7 days free trial</strong> when they sign up</li>
              <li>• You get <strong>+7 days added</strong> to your subscription</li>
              <li>• No limit on referrals - keep inviting!</li>
            </ul>
          </div>

          {/* Referral Tiers */}
          <div className="space-y-2">
            <h4 className="font-semibold">Referral Tiers & Bonuses:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Badge variant={referralData.referralCount >= 1 ? "default" : "outline"} className="p-2 justify-center">
                Bronze (1+): +7 days each
              </Badge>
              <Badge variant={referralData.referralCount >= 5 ? "default" : "outline"} className="p-2 justify-center">
                Silver (5+): +10 days each
              </Badge>
              <Badge variant={referralData.referralCount >= 10 ? "default" : "outline"} className="p-2 justify-center">
                Gold (10+): +14 days each
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Options */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Referral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Referral Link */}
          <div>
            <label className="text-sm font-medium mb-2 block">Your Referral Link</label>
            <div className="flex gap-2">
              <Input
                value={referralData.referralLink}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyReferralLink} variant="outline" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Referral Code */}
          <div>
            <label className="text-sm font-medium mb-2 block">Your Referral Code</label>
            <div className="flex gap-2">
              <Input
                value={referralData.referralCode}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyReferralCode} variant="outline" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={() => shareToSocial('twitter')} 
              variant="outline" 
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share on Twitter
            </Button>
            <Button 
              onClick={() => shareToSocial('linkedin')} 
              variant="outline" 
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share on LinkedIn
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReferralSystem;