import React from 'react';
import { Shield, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VerifiedBadgeProps {
  verified?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function VerifiedBadge({ verified = false, size = 'md', showText = false }: VerifiedBadgeProps) {
  if (!verified) return null;

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  }[size];

  const badgeSize = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }[size];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {showText ? (
            <Badge 
              variant="default" 
              className={`bg-green-600 hover:bg-green-700 text-white border-0 ${badgeSize} flex items-center gap-1`}
            >
              <Shield className={iconSize} />
              Verified
            </Badge>
          ) : (
            <div className="relative inline-flex">
              <Shield className={`${iconSize} text-green-600 fill-current`} />
              <Check className="h-2 w-2 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            <strong>Verified Inventor</strong><br />
            This inventor has completed identity verification and document review.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default VerifiedBadge;