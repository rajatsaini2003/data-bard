import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { Settings as SettingsIcon, Building2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { useOrganizationStore } from "@/store/organizationStore";
import { Skeleton } from "@/components/ui/skeleton";

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { organization, isLoading, getOrganization, updateOrganization, updateSettings } = useOrganizationStore();
  
  const [orgData, setOrgData] = useState({
    name: '',
    description: ''
  });
  const [settings, setSettings] = useState({
    max_datasets: 0,
    allow_file_sharing: false,
    webhook_url: ''
  });

  useEffect(() => {
    getOrganization();
  }, [getOrganization]);

  useEffect(() => {
    if (organization) {
      setOrgData({
        name: organization.name || '',
        description: organization.description || ''
      });
      setSettings({
        max_datasets: organization.settings?.max_datasets || 0,
        allow_file_sharing: organization.settings?.allow_file_sharing || false,
        webhook_url: organization.settings?.webhook_url || ''
      });
    }
  }, [organization]);

  const handleUpdateOrganization = async () => {
    try {
      await updateOrganization(orgData);
    } catch (error) {
      // Error handled in store
    }
  };

  const handleUpdateSettings = async () => {
    try {
      await updateSettings(settings);
    } catch (error) {
      // Error handled in store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your organization and platform preferences
            </p>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.email}</h2>
                <p className="text-muted-foreground">
                  {user?.is_admin ? 'Administrator' : 'User'} • {user?.organization_name || 'No Organization'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                {user?.is_admin && (
                  <TabsTrigger value="organization" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>Organization</span>
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Profile Settings */}
              <TabsContent value="profile" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">User Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={user?.email || ''} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input value={user?.is_admin ? 'Administrator' : 'User'} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Organization</Label>
                      <Input value={user?.organization_name || 'No Organization'} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <Input value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''} disabled />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Organization Settings - Admin Only */}
              {user?.is_admin && (
                <TabsContent value="organization" className="space-y-6 mt-6">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Organization Profile</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="org-name">Organization Name</Label>
                            <Input 
                              id="org-name" 
                              value={orgData.name}
                              onChange={(e) => setOrgData(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="org-description">Description</Label>
                            <Input 
                              id="org-description" 
                              value={orgData.description}
                              onChange={(e) => setOrgData(prev => ({ ...prev, description: e.target.value }))}
                            />
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Organization Settings</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="max-datasets">Maximum Datasets</Label>
                            <Input 
                              id="max-datasets" 
                              type="number"
                              value={settings.max_datasets}
                              onChange={(e) => setSettings(prev => ({ ...prev, max_datasets: parseInt(e.target.value) || 0 }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Allow File Sharing</Label>
                              <p className="text-sm text-muted-foreground">Enable file sharing between team members</p>
                            </div>
                            <Switch 
                              checked={settings.allow_file_sharing}
                              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allow_file_sharing: checked }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="webhook-url">Webhook URL</Label>
                            <Input 
                              id="webhook-url" 
                              value={settings.webhook_url}
                              onChange={(e) => setSettings(prev => ({ ...prev, webhook_url: e.target.value }))}
                              placeholder="https://your-webhook-endpoint.com"
                            />
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex justify-end gap-2">
                        <Button onClick={handleUpdateOrganization} disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save Organization"}
                        </Button>
                        <Button onClick={handleUpdateSettings} disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save Settings"}
                        </Button>
                      </div>
                    </>
                  )}
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;