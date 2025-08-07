import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import { 
  Database, 
  Plus, 
  Settings, 
  Wifi, 
  WifiOff, 
  Cloud, 
  Server, 
  Link, 
  TestTube,
  Shield,
  Key,
  Globe,
  Smartphone,
  Monitor,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Connections = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  const testConnection = async (connectionId: string) => {
    setTestingConnection(connectionId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestingConnection(null);
    
    toast({
      title: "Connection Test",
      description: "Connection test completed successfully.",
    });
  };

  const stats = [
    { label: "Active Connections", value: "8", icon: Wifi },
    { label: "Total Data Sources", value: "15", icon: Database },
    { label: "API Endpoints", value: "12", icon: Link },
    { label: "Uptime", value: "99.8%", icon: Activity },
  ];

  const databases = [
    {
      id: "mysql-prod",
      name: "MySQL Production",
      type: "MySQL",
      host: "prod-mysql.company.com",
      status: "connected",
      lastTest: "2 minutes ago",
      icon: "🐬"
    },
    {
      id: "postgres-analytics",
      name: "PostgreSQL Analytics",
      type: "PostgreSQL",
      host: "analytics-pg.company.com",
      status: "connected",
      lastTest: "15 minutes ago",
      icon: "🐘"
    },
    {
      id: "mongodb-logs",
      name: "MongoDB Logs",
      type: "MongoDB",
      host: "logs-mongo.company.com",
      status: "disconnected",
      lastTest: "1 hour ago",
      icon: "🍃"
    },
    {
      id: "redis-cache",
      name: "Redis Cache",
      type: "Redis",
      host: "cache-redis.company.com",
      status: "connected",
      lastTest: "5 minutes ago",
      icon: "🔴"
    },
  ];

  const cloudSources = [
    {
      id: "aws-s3",
      name: "AWS S3 Data Lake",
      type: "Amazon S3",
      region: "us-west-2",
      status: "connected",
      lastSync: "30 minutes ago",
      icon: "☁️"
    },
    {
      id: "gcp-bigquery",
      name: "Google BigQuery",
      type: "BigQuery",
      region: "us-central1",
      status: "connected",
      lastSync: "1 hour ago",
      icon: "📊"
    },
    {
      id: "azure-data-lake",
      name: "Azure Data Lake",
      type: "Azure",
      region: "East US",
      status: "error",
      lastSync: "Failed",
      icon: "🌊"
    },
  ];

  const apiConnections = [
    {
      id: "salesforce-api",
      name: "Salesforce CRM",
      type: "REST API",
      endpoint: "https://company.salesforce.com/api",
      status: "connected",
      rateLimit: "5000/hour",
      icon: "💼"
    },
    {
      id: "stripe-api",
      name: "Stripe Payments",
      type: "REST API",
      endpoint: "https://api.stripe.com/v1",
      status: "connected",
      rateLimit: "1000/hour",
      icon: "💳"
    },
    {
      id: "analytics-webhook",
      name: "Analytics Webhook",
      type: "Webhook",
      endpoint: "https://webhook.company.com/analytics",
      status: "active",
      rateLimit: "Unlimited",
      icon: "📈"
    },
  ];

  const fileConnections = [
    {
      id: "sftp-server",
      name: "SFTP File Server",
      type: "SFTP",
      host: "files.company.com",
      status: "connected",
      lastAccess: "1 hour ago",
      icon: "📁"
    },
    {
      id: "ftp-legacy",
      name: "Legacy FTP",
      type: "FTP",
      host: "legacy-ftp.company.com",
      status: "disconnected",
      lastAccess: "3 days ago",
      icon: "📂"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
        return "bg-success text-white";
      case "disconnected":
        return "bg-muted text-muted-foreground";
      case "error":
        return "bg-destructive text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
        return <Wifi className="h-3 w-3" />;
      case "disconnected":
      case "error":
        return <WifiOff className="h-3 w-3" />;
      default:
        return <WifiOff className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Data Connections
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your data sources and integrations
              </p>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Connection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Connection</DialogTitle>
                <DialogDescription>
                  Choose the type of data source you want to connect
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                {[
                  { name: "Database", icon: Database },
                  { name: "Cloud Storage", icon: Cloud },
                  { name: "API", icon: Link },
                  { name: "File Server", icon: Server },
                ].map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button key={type.name} variant="outline" className="h-20 flex-col">
                      <Icon className="h-6 w-6 mb-2" />
                      {type.name}
                    </Button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
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

        {/* Connection Tabs */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <Tabs defaultValue="databases" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="databases" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span className="hidden sm:inline">Databases</span>
                </TabsTrigger>
                <TabsTrigger value="cloud" className="flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  <span className="hidden sm:inline">Cloud Sources</span>
                </TabsTrigger>
                <TabsTrigger value="apis" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  <span className="hidden sm:inline">APIs</span>
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  <span className="hidden sm:inline">File Sources</span>
                </TabsTrigger>
              </TabsList>

              {/* Database Connections */}
              <TabsContent value="databases" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {databases.map((db) => (
                    <Card key={db.id} className="border-border/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{db.icon}</span>
                            <div>
                              <CardTitle className="text-lg">{db.name}</CardTitle>
                              <CardDescription>{db.type}</CardDescription>
                            </div>
                          </div>
                          <Badge className={getStatusColor(db.status)}>
                            {getStatusIcon(db.status)}
                            <span className="ml-1 capitalize">{db.status}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Host:</span>
                          <span className="ml-2 font-mono">{db.host}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Last Test:</span>
                          <span className="ml-2">{db.lastTest}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => testConnection(db.id)}
                            disabled={testingConnection === db.id}
                          >
                            {testingConnection === db.id ? (
                              <>
                                <Activity className="h-3 w-3 mr-1 animate-spin" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <TestTube className="h-3 w-3 mr-1" />
                                Test
                              </>
                            )}
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Settings className="h-3 w-3 mr-1" />
                            Configure
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Cloud Sources */}
              <TabsContent value="cloud" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cloudSources.map((source) => (
                    <Card key={source.id} className="border-border/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{source.icon}</span>
                            <div>
                              <CardTitle className="text-lg">{source.name}</CardTitle>
                              <CardDescription>{source.type}</CardDescription>
                            </div>
                          </div>
                          <Badge className={getStatusColor(source.status)}>
                            {getStatusIcon(source.status)}
                            <span className="ml-1 capitalize">{source.status}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Region:</span>
                          <span className="ml-2">{source.region}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Last Sync:</span>
                          <span className="ml-2">{source.lastSync}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline">
                            <Activity className="h-3 w-3 mr-1" />
                            Sync Now
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Settings className="h-3 w-3 mr-1" />
                            Configure
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* API Connections */}
              <TabsContent value="apis" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {apiConnections.map((api) => (
                    <Card key={api.id} className="border-border/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{api.icon}</span>
                            <div>
                              <CardTitle className="text-lg">{api.name}</CardTitle>
                              <CardDescription>{api.type}</CardDescription>
                            </div>
                          </div>
                          <Badge className={getStatusColor(api.status)}>
                            {getStatusIcon(api.status)}
                            <span className="ml-1 capitalize">{api.status}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Endpoint:</span>
                          <span className="ml-2 font-mono text-xs break-all">{api.endpoint}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Rate Limit:</span>
                          <span className="ml-2">{api.rateLimit}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline">
                            <TestTube className="h-3 w-3 mr-1" />
                            Test API
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Key className="h-3 w-3 mr-1" />
                            Credentials
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* File Sources */}
              <TabsContent value="files" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fileConnections.map((file) => (
                    <Card key={file.id} className="border-border/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{file.icon}</span>
                            <div>
                              <CardTitle className="text-lg">{file.name}</CardTitle>
                              <CardDescription>{file.type}</CardDescription>
                            </div>
                          </div>
                          <Badge className={getStatusColor(file.status)}>
                            {getStatusIcon(file.status)}
                            <span className="ml-1 capitalize">{file.status}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Host:</span>
                          <span className="ml-2 font-mono">{file.host}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Last Access:</span>
                          <span className="ml-2">{file.lastAccess}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline">
                            <TestTube className="h-3 w-3 mr-1" />
                            Test Connection
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Shield className="h-3 w-3 mr-1" />
                            Security
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Connections;