import React from 'react';
import { Shield, Check, AlertTriangle, Lock, Eye, FileCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SecurityFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'pending' | 'disabled';
}

interface SecurityBadgeProps {
  features?: SecurityFeature[];
  compact?: boolean;
}

export function SecurityBadge({ features, compact = false }: SecurityBadgeProps) {
  const defaultFeatures: SecurityFeature[] = [
    {
      id: 'file_scan',
      name: 'File Sanitization',
      description: 'All uploads are scanned for viruses and metadata is stripped for security',
      icon: <FileCheck className="h-4 w-4" />,
      status: 'active'
    },
    {
      id: 'identity_verify',
      name: 'Identity Verification', 
      description: 'Inventors can verify their identity through document verification',
      icon: <Shield className="h-4 w-4" />,
      status: 'active'
    },
    {
      id: '2fa',
      name: '2FA Protection',
      description: 'Two-factor authentication available for enhanced account security',
      icon: <Lock className="h-4 w-4" />,
      status: 'pending'
    },
    {
      id: 'privacy',
      name: 'Privacy Controls',
      description: 'Full control over who can see your inventions and personal information',
      icon: <Eye className="h-4 w-4" />,
      status: 'active'
    }
  ];

  const securityFeatures = features || defaultFeatures;
  const activeFeatures = securityFeatures.filter(f => f.status === 'active');

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-green-600" />
              <Badge variant="secondary" className="text-xs">
                Secured
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm max-w-xs">
              <strong>Security Features Active:</strong>
              <ul className="mt-1 space-y-1">
                {activeFeatures.map(feature => (
                  <li key={feature.id} className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500" />
                    {feature.name}
                  </li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Shield className="h-6 w-6 text-green-600 mr-3" />
        <h3 className="text-lg font-semibold dark:text-white">Security & Trust</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityFeatures.map((feature) => (
          <div
            key={feature.id}
            className={`flex items-start p-3 rounded-lg border ${
              feature.status === 'active' 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : feature.status === 'pending'
                ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                : 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-700'
            }`}
          >
            <div className={`p-2 rounded-lg mr-3 ${
              feature.status === 'active' 
                ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300' 
                : feature.status === 'pending'
                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
            }`}>
              {feature.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm dark:text-white">{feature.name}</h4>
                {feature.status === 'active' && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
                {feature.status === 'pending' && (
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
              
              {feature.status === 'pending' && (
                <Badge variant="outline" className="mt-2 text-xs">
                  Coming Soon
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center">
          <Shield className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
            Future Forge Security Score: {Math.round((activeFeatures.length / securityFeatures.length) * 100)}%
          </span>
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          Your data and inventions are protected by industry-leading security measures.
        </p>
      </div>
    </div>
  );
}

export default SecurityBadge;