import React from 'react';
import { Trophy, Lightbulb, DollarSign, Users, Zap, Star, Crown, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

interface AchievementBadgesProps {
  userId: number;
  inventions?: number;
  investments?: number;
  views?: number;
  funding?: number;
  compact?: boolean;
}

export function AchievementBadges({ 
  userId, 
  inventions = 0, 
  investments = 0, 
  views = 0, 
  funding = 0,
  compact = false 
}: AchievementBadgesProps) {
  
  const achievements: Achievement[] = [
    {
      id: 'first_invention',
      name: 'First Creation',
      description: 'Created your first invention',
      icon: <Lightbulb className="h-4 w-4" />,
      color: 'bg-blue-500',
      unlocked: inventions >= 1
    },
    {
      id: 'inventor_pro',
      name: 'Inventor Pro',
      description: 'Created 5 inventions',
      icon: <Zap className="h-4 w-4" />,
      color: 'bg-purple-500',
      unlocked: inventions >= 5,
      progress: inventions,
      total: 5
    },
    {
      id: 'innovation_master',
      name: 'Innovation Master',
      description: 'Created 10 inventions',
      icon: <Crown className="h-4 w-4" />,
      color: 'bg-yellow-500',
      unlocked: inventions >= 10,
      progress: inventions,
      total: 10
    },
    {
      id: 'first_investment',
      name: 'First Investor',
      description: 'Made your first investment',
      icon: <DollarSign className="h-4 w-4" />,
      color: 'bg-green-500',
      unlocked: investments >= 1
    },
    {
      id: 'generous_backer',
      name: 'Generous Backer',
      description: 'Invested in 5 different inventions',
      icon: <Target className="h-4 w-4" />,
      color: 'bg-emerald-500',
      unlocked: investments >= 5,
      progress: investments,
      total: 5
    },
    {
      id: 'popular_creator',
      name: 'Popular Creator',
      description: 'Received 1,000 total views',
      icon: <Star className="h-4 w-4" />,
      color: 'bg-orange-500',
      unlocked: views >= 1000,
      progress: views,
      total: 1000
    },
    {
      id: 'funded_inventor',
      name: 'Funded Inventor',
      description: 'Raised $1,000 in funding',
      icon: <Trophy className="h-4 w-4" />,
      color: 'bg-pink-500',
      unlocked: funding >= 1000,
      progress: funding,
      total: 1000
    },
    {
      id: 'community_favorite',
      name: 'Community Favorite',
      description: 'Received 50 total views across all inventions',
      icon: <Users className="h-4 w-4" />,
      color: 'bg-indigo-500',
      unlocked: views >= 50,
      progress: views,
      total: 50
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const inProgressAchievements = achievements.filter(a => !a.unlocked && a.progress !== undefined);

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {unlockedAchievements.slice(0, 3).map((achievement) => (
          <TooltipProvider key={achievement.id}>
            <Tooltip>
              <TooltipTrigger>
                <div className={`${achievement.color} p-1.5 rounded-full text-white`}>
                  {achievement.icon}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <strong>{achievement.name}</strong><br />
                  {achievement.description}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        {unlockedAchievements.length > 3 && (
          <div className="bg-gray-400 p-1.5 rounded-full text-white text-xs font-bold min-w-[28px] h-7 flex items-center justify-center">
            +{unlockedAchievements.length - 3}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Achievements Unlocked ({unlockedAchievements.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {unlockedAchievements.map((achievement) => (
              <div 
                key={achievement.id}
                className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className={`${achievement.color} p-3 rounded-full text-white mb-2`}>
                  {achievement.icon}
                </div>
                <h4 className="font-semibold text-sm text-center">{achievement.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">
                  {achievement.description}
                </p>
                <Badge variant="default" className="mt-2 text-xs">
                  Unlocked
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In Progress Achievements */}
      {inProgressAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-500" />
            In Progress ({inProgressAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inProgressAchievements.map((achievement) => (
              <div 
                key={achievement.id}
                className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className={`${achievement.color} p-2 rounded-full text-white mr-4 opacity-50`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{achievement.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {achievement.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${achievement.color}`}
                        style={{ 
                          width: `${Math.min((achievement.progress! / achievement.total!) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {unlockedAchievements.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Achievements Yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start creating inventions and investing to unlock achievements!
          </p>
        </div>
      )}
    </div>
  );
}

export default AchievementBadges;