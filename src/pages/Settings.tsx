import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { 
  Settings as SettingsIcon, 
  Building2, 
  User, 
  Shield, 
  Key, 
  Plug, 
  CreditCard, 
  History,
  Bell,
  Palette,
  Globe,
  Database
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSave = async (section: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    toast({
      title: "Settings saved",
      description: `${section} settings have been updated successfully.`,
    });
  };

  const stats = [
    { label: "Active Users", value: "12", icon: User },
    { label: "API Calls Today", value: "1,234", icon: Key },
    { label: "Storage Used", value: "2.4 GB", icon: Database },
    { label: "Uptime", value: "99.9%", icon: Shield },
  ];

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Settings Tabs */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <Tabs defaultValue="organization" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                <TabsTrigger value="organization" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Organization</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Preferences</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="api" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  <span className="hidden sm:inline">API</span>
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <Plug className="h-4 w-4" />
                  <span className="hidden sm:inline">Integrations</span>
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:inline">Billing</span>
                </TabsTrigger>
                <TabsTrigger value="audit" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">Audit</span>
                </TabsTrigger>
              </TabsList>

              {/* Organization Settings */}
              <TabsContent value="organization" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Organization Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-name">Organization Name</Label>
                      <Input id="org-name" defaultValue="Acme Corp" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-domain">Domain</Label>
                      <Input id="org-domain" defaultValue="acme.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-description">Description</Label>
                      <Input id="org-description" defaultValue="Leading innovation" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-timezone">Timezone</Label>
                      <Input id="org-timezone" defaultValue="UTC-8 (Pacific)" />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={() => handleSave("Organization")} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </TabsContent>

              {/* User Preferences */}
              <TabsContent value="preferences" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Display Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive email updates</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-save Queries</Label>
                        <p className="text-sm text-muted-foreground">Automatically save query history</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={() => handleSave("Preferences")} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Password & Authentication</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Badge variant="outline">Not Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Session Timeout</Label>
                        <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                      </div>
                      <Badge variant="secondary">30 minutes</Badge>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Enable 2FA</Button>
                  <Button onClick={() => handleSave("Security")} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </TabsContent>

              {/* API Configuration */}
              <TabsContent value="api" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">API Keys & Access</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Label>Production API Key</Label>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <Input value="sk-•••••••••••••••••••••••••••••••••••••••••••••••••" readOnly />
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Label>Development API Key</Label>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <Input value="sk-dev-•••••••••••••••••••••••••••••••••••••••••••••••••" readOnly />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Generate New Key</Button>
                  <Button onClick={() => handleSave("API")} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </TabsContent>

              {/* Integrations */}
              <TabsContent value="integrations" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Connected Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "Slack", status: "Connected", icon: "💬" },
                      { name: "Microsoft Teams", status: "Not Connected", icon: "👥" },
                      { name: "Google Workspace", status: "Connected", icon: "📧" },
                      { name: "Webhook Endpoint", status: "Active", icon: "🔗" },
                    ].map((integration) => (
                      <div key={integration.name} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{integration.icon}</span>
                            <div>
                              <p className="font-medium">{integration.name}</p>
                              <p className="text-sm text-muted-foreground">{integration.status}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            {integration.status === "Connected" || integration.status === "Active" ? "Configure" : "Connect"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Billing */}
              <TabsContent value="billing" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Subscription & Usage</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Current Plan</CardTitle>
                        <CardDescription>Professional Plan</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Monthly Cost</span>
                            <span className="font-semibold">$99/month</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Next Billing</span>
                            <span>Jan 15, 2025</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Usage This Month</CardTitle>
                        <CardDescription>API calls and storage</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>API Calls</span>
                            <span>34,567 / 100,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Storage</span>
                            <span>2.4 GB / 10 GB</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Audit Logs */}
              <TabsContent value="audit" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: "User login", user: "admin@acme.com", time: "2 minutes ago" },
                      { action: "Dataset uploaded", user: "john@acme.com", time: "1 hour ago" },
                      { action: "API key generated", user: "admin@acme.com", time: "3 hours ago" },
                      { action: "User invited", user: "admin@acme.com", time: "1 day ago" },
                    ].map((log, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-muted-foreground">by {log.user}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;