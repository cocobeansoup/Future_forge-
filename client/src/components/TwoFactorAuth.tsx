import React, { useState } from 'react';
import { Shield, Smartphone, Key, Check, AlertTriangle, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

interface TwoFactorAuthProps {
  isEnabled?: boolean;
  userEmail?: string;
  userPhone?: string;
}

export function TwoFactorAuth({ 
  isEnabled = false, 
  userEmail = "",
  userPhone = ""
}: TwoFactorAuthProps) {
  const [is2FAEnabled, setIs2FAEnabled] = useState(isEnabled);
  const [setupStep, setSetupStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [method, setMethod] = useState<'sms' | 'email'>('sms');
  const [verificationCode, setVerificationCode] = useState('');
  const [phone, setPhone] = useState(userPhone);
  const [email, setEmail] = useState(userEmail);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle2FA = async () => {
    if (is2FAEnabled) {
      // Disable 2FA
      try {
        setIsLoading(true);
        // API call to disable 2FA would go here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        setIs2FAEnabled(false);
        setSetupStep('setup');
        toast({
          title: "2FA Disabled",
          description: "Two-factor authentication has been disabled for your account.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to disable 2FA. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Start 2FA setup
      setSetupStep('setup');
    }
  };

  const handleSendVerification = async () => {
    try {
      setIsLoading(true);
      // API call to send verification code would go here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      setSetupStep('verify');
      toast({
        title: "Verification Code Sent",
        description: `A verification code has been sent to your ${method === 'sms' ? 'phone' : 'email'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // API call to verify code would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setIs2FAEnabled(true);
      setSetupStep('complete');
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled for your account.",
      });
    } catch (error) {
      toast({
        title: "Invalid Code",
        description: "The verification code is incorrect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const backupCodes = [
    '8A7C-9F4E-2D1B',
    'B3E5-7G9H-K4M6',
    'C8X2-V5N7-P9Q1',
    'D4F6-H8J0-L2N4',
    'E9R5-T7Y3-U1I8'
  ];

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    toast({
      title: "Backup Codes Copied",
      description: "Store these codes in a safe place. You can use them if you lose access to your device.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Two-Factor Authentication
          {is2FAEnabled && (
            <Badge className="ml-2 bg-green-500 hover:bg-green-600">
              <Check className="h-3 w-3 mr-1" />
              Enabled
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status and Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div>
            <h4 className="font-medium">
              {is2FAEnabled ? "2FA is protecting your account" : "Secure your account with 2FA"}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {is2FAEnabled 
                ? "Your account requires a verification code in addition to your password." 
                : "Add an extra layer of security to your Future Forge account."
              }
            </p>
          </div>
          <Switch
            checked={is2FAEnabled}
            onCheckedChange={handleToggle2FA}
            disabled={isLoading}
          />
        </div>

        {/* Setup Process */}
        {!is2FAEnabled && setupStep !== 'complete' && (
          <div className="space-y-4">
            {setupStep === 'setup' && (
              <>
                <div>
                  <h4 className="font-medium mb-3">Choose verification method:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={() => setMethod('sms')}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        method === 'sms' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
                        <span className="font-medium">SMS Text Message</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Receive codes via text message
                      </p>
                    </button>

                    <button
                      onClick={() => setMethod('email')}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        method === 'email' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Key className="h-5 w-5 mr-2 text-green-600" />
                        <span className="font-medium">Email</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Receive codes via email
                      </p>
                    </button>
                  </div>
                </div>

                {method === 'sms' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="mb-3"
                    />
                  </div>
                )}

                {method === 'email' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="mb-3"
                    />
                  </div>
                )}

                <Button 
                  onClick={handleSendVerification}
                  disabled={isLoading || (method === 'sms' && !phone) || (method === 'email' && !email)}
                  className="w-full"
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </>
            )}

            {setupStep === 'verify' && (
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm">
                    We sent a 6-digit code to your {method === 'sms' ? 'phone' : 'email'}. 
                    Enter it below to complete setup.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Verification Code</label>
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="text-center text-2xl tracking-widest"
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSetupStep('setup')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleVerifyCode}
                    disabled={isLoading || verificationCode.length !== 6}
                    className="flex-1"
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Backup Codes (shown when 2FA is enabled) */}
        {is2FAEnabled && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center">
                <Key className="h-4 w-4 mr-2" />
                Backup Recovery Codes
              </h4>
              <Button variant="outline" size="sm" onClick={copyBackupCodes}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Save these codes in a secure location. Each code can only be used once.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div key={index} className="p-2 bg-white dark:bg-gray-800 border rounded text-center">
                  {code}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        {!is2FAEnabled && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-300">Why enable 2FA?</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 mt-2 space-y-1">
                  <li>• Protect your inventions and investment data</li>
                  <li>• Prevent unauthorized access to your account</li>
                  <li>• Build trust with investors and partners</li>
                  <li>• Required for high-value transactions</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TwoFactorAuth;