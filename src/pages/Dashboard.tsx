import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import AnalyticsNotebook from "@/components/AnalyticsNotebook";
import DynamicDashboard from "@/components/DynamicDashboard";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { InviteMemberDialog } from "@/components/admin/InviteMemberDialog";
import { useDatasetStore } from "@/store/datasetStore";
import { useAuthStore } from "@/store/authStore";
import { 
  BarChart3, 
  Users, 
  Database, 
  TrendingUp, 
  MessageSquare, 
  Send,
  Plus,
  Filter,
  Download,
  Upload,
  FileText,
  Table,
  PieChart,
  LineChart,
  Paperclip,
  Sparkles,
  Brain,
  FileUp
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("analyze");
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { datasets, isLoading: datasetLoading, loadDatasets, uploadDataset } = useDatasetStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadDatasets();
    }
  }, [user, loadDatasets]);

  const stats = [
    {
      title: "Total Revenue",
      value: "$2.4M",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-primary"
    },
    {
      title: "Active Users",
      value: "15.8K",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "text-accent-teal"
    },
    {
      title: "Data Sources",
      value: "24",
      change: "+3",
      trend: "up",
      icon: Database,
      color: "text-accent-purple"
    },
    {
      title: "Queries Today",
      value: "342",
      change: "+15.3%",
      trend: "up",
      icon: MessageSquare,
      color: "text-accent-blue"
    }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileUpload started');
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    console.log('Files selected:', files.length);
    try {
      for (const file of files) {
        console.log('Processing file:', file.name, file.type);
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          console.log('Starting upload for:', file.name);
          await uploadDataset(file, {
            name: file.name.replace('.csv', ''),
            description: `Uploaded dataset: ${file.name}`,
            tags: ['uploaded']
          });
          console.log('Upload completed for:', file.name);
        } else {
          toast({
            title: "File type not supported",
            description: "Please upload CSV files only",
            variant: "destructive"
          });
        }
      }
      
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
      console.log('handleFileUpload completed successfully');
    } catch (error) {
      console.error('Upload error in handleFileUpload:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading files",
        variant: "destructive"
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    try {
      for (const file of files) {
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          await uploadDataset(file, {
            name: file.name.replace('.csv', ''),
            description: `Uploaded dataset: ${file.name}`,
            tags: ['uploaded']
          });
        } else {
          toast({
            title: "File type not supported",
            description: "Please upload CSV files only",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Drop upload error:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading files",
        variant: "destructive"
      });
    }
  };

  const analyzeData = async () => {
    if (!query.trim()) {
      toast({
        title: "Please enter a query",
        description: "Ask a question about your data to get started",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis with dashboard generation
    setTimeout(() => {
      setAnalysisResults({
        query: query,
        insights: [
          "Revenue increased 15% compared to last quarter",
          "Top performing region is North America with 45% of total sales",
          "Customer retention rate improved by 8%"
        ],
        chartType: "bar",
        data: [
          { name: "Q1", value: 2400 },
          { name: "Q2", value: 2800 },
          { name: "Q3", value: 3200 },
          { name: "Q4", value: 3600 }
        ],
        dashboard: mockDashboardConfig
      });
      setIsAnalyzing(false);
      // Auto-switch to dashboard tab when query completes
      setActiveTab("dashboard");
    }, 2000);
  };


  const sampleQueries = [
    "Show me revenue trends for the last 6 months",
    "What are the top performing products by region?",
    "Analyze customer acquisition costs by channel",
    "Create a dashboard showing key performance metrics",
    "Compare sales performance year over year",
    "Identify patterns in customer behavior data"
  ];

  // Mock dashboard configuration as requested by user
  const mockDashboardConfig = {
    "layout": "minimal-reports",
    "cards": [
      "sales",
      "revenue", 
      "region"
    ],
    "filters": [
      {
        "label": "region",
        "id": "region_1",
        "type": "multichoice" as const
      },
      {
        "label": "sales",
        "id": "sales_1", 
        "type": "slider" as const
      }
    ],
    "alleys": [
      {
        "charts": [
          {
            "title": "Sales by Regions",
            "type": "bar" as const,
            "x": "Regions",
            "y": "sales", 
            "description": "Breakdown of Sales by Regions",
            "color": "#3b82f6"
          },
          {
            "title": "Revenue by Regions",
            "type": "histogram" as const,
            "x": "Regions",
            "y": "Revenue",
            "description": "Breakdown of Revenue by regions", 
            "color": "#3b82f6"
          }
        ],
        "title": "Alley 1"
      }
    ],
    "include_table": true,
    "theme": "light" as const
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your data overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-current/10 ${stat.color}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-success">{stat.change}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </Card>
            );
          })}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="analyze">AI Analysis</TabsTrigger>
            <TabsTrigger value="notebook">Notebook</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze">
            <div className="grid lg:grid-cols-3 gap-8">
          {/* File Upload & AI Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload Section - Admin Only */}
            {user?.is_admin && (
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <FileUp className="h-5 w-5 mr-2 text-primary" />
                    Upload Your Data
                  </h2>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Ready
                  </Badge>
                </div>
                
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Drop your files here or click to upload</p>
                  <p className="text-sm text-muted-foreground">Supports CSV, Excel, JSON, and more</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".csv,.xlsx,.xls,.json,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {datasets && datasets.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Your Datasets:</p>
                    {datasets.slice(0, 3).map((dataset, index) => (
                      <div key={dataset.id} className="flex items-center justify-between p-2 bg-background/50 rounded-lg border border-border">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{dataset.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {new Date(dataset.created_at).toLocaleDateString()}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                    {datasets && datasets.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{datasets.length - 3} more datasets
                      </p>
                    )}
                  </div>
                )}
              </Card>
            )}

            {/* AI Analysis Section */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-primary" />
                  AI Data Analyst
                </h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Ask anything about your data in plain English..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-background/50 border-border min-h-[60px] resize-none"
                    rows={2}
                  />
                  <Button 
                    variant="hero" 
                    onClick={analyzeData}
                    disabled={isAnalyzing}
                    className="px-6"
                  >
                    {isAnalyzing ? (
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {isAnalyzing ? (
                  <div className="h-64 bg-muted/30 rounded-lg border border-border flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                      <p className="text-muted-foreground">Analyzing your data...</p>
                      <p className="text-sm text-muted-foreground">This may take a few moments</p>
                    </div>
                  </div>
                ) : analysisResults ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-background/50 rounded-lg border border-border">
                      <h3 className="font-medium mb-2">Analysis Results</h3>
                      <p className="text-sm text-muted-foreground mb-3">Query: "{analysisResults.query}"</p>
                      <div className="space-y-2">
                        {analysisResults.insights.map((insight: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <p className="text-sm">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center border border-border">
                        <BarChart3 className="h-12 w-12 text-primary" />
                      </div>
                      <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center border border-border">
                        <PieChart className="h-12 w-12 text-accent-teal" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 bg-muted/30 rounded-lg border border-border flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Your analysis will appear here</p>
                      <p className="text-sm text-muted-foreground">Upload data and ask a question to get started</p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Notebook
                    </Button>
                    <Button variant="outline" size="sm">
                      <LineChart className="h-4 w-4 mr-2" />
                      Chart Types
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* AI Suggestions & Quick Actions */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                AI Suggestions
              </h3>
              <div className="space-y-3">
                {sampleQueries.map((sampleQuery, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-lg bg-background/50 border border-border hover:bg-accent/50 cursor-pointer transition-colors text-sm group"
                    onClick={() => setQuery(sampleQuery)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{sampleQuery}</span>
                      <Send className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Brain className="h-4 w-4 mr-2" />
                Generate More Ideas
              </Button>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="dashboard" className="w-full justify-start" onClick={() => setActiveTab('dashboard')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Dashboard
                </Button>
                <Button variant="dashboard" className="w-full justify-start" onClick={() => {
                  try {
                    navigate('/datasets');
                  } catch (error) {
                    console.error('Navigation error:', error);
                  }
                }}>
                  <Database className="h-4 w-4 mr-2" />
                  Manage Datasets
                </Button>
                <InviteMemberDialog
                  trigger={
                    <Button variant="dashboard" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Invite Team Member
                    </Button>
                  }
                />
              </div>
            </Card>
          </div>
        </div>
          </TabsContent>

          <TabsContent value="notebook">
            <AnalyticsNotebook />
          </TabsContent>

          <TabsContent value="dashboard">
            <DynamicDashboard 
              data={mockDashboardConfig} 
              chartData={[]} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;