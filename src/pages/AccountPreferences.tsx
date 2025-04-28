
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const AccountPreferences = () => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [preferences, setPreferences] = React.useState({
    emailNewContent: true,
    emailMarketAlerts: true,
    emailWeeklyDigest: true,
    pushNotifications: false,
  });

  // In a real implementation, you would fetch the user's preferences from the database
  React.useEffect(() => {
    // Placeholder for fetching user preferences
    // This would be replaced with an actual API call
  }, [user]);

  const handleSavePreferences = async () => {
    setLoading(true);
    // Placeholder for saving preferences
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="container mx-auto py-10 px-6">
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>You need to be logged in to view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-supernova-gold">Notification Preferences</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Manage your email notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-new-content" className="flex flex-col gap-1">
                <span>New Newsletter Notifications</span>
                <span className="text-sm text-muted-foreground">
                  Receive an email when new newsletters are published
                </span>
              </Label>
              <Switch
                id="email-new-content"
                checked={preferences.emailNewContent}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNewContent: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email-market-alerts" className="flex flex-col gap-1">
                <span>Market Alert Notifications</span>
                <span className="text-sm text-muted-foreground">
                  Receive important market alerts and opportunities
                </span>
              </Label>
              <Switch
                id="email-market-alerts"
                checked={preferences.emailMarketAlerts}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailMarketAlerts: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email-weekly-digest" className="flex flex-col gap-1">
                <span>Weekly Digest</span>
                <span className="text-sm text-muted-foreground">
                  Receive a weekly summary of content and market updates
                </span>
              </Label>
              <Switch
                id="email-weekly-digest"
                checked={preferences.emailWeeklyDigest}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailWeeklyDigest: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex flex-col gap-1">
                <span>Push Notifications</span>
                <span className="text-sm text-muted-foreground">
                  Receive browser push notifications (coming soon)
                </span>
              </Label>
              <Switch
                id="push-notifications"
                checked={preferences.pushNotifications}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pushNotifications: checked }))}
              />
            </div>
            
            <Button 
              onClick={handleSavePreferences} 
              disabled={loading}
              className="mt-4"
            >
              {loading ? "Saving..." : "Save Preferences"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountPreferences;
