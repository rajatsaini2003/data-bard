import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { 
  MessageSquare, 
  History, 
  Bookmark, 
  Sparkles, 
  Clock, 
  Share, 
  Play, 
  Save,
  Search,
  Filter,
  TrendingUp,
  Database,
  BarChart3,
  PieChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Queries = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [queryText, setQueryText] = useState("");

  const executeQuery = async () => {
    if (!queryText.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a query to execute.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    
    toast({
      title: "Query Executed",
      description: "Your AI query has been processed successfully.",
    });
  };

  const stats = [
    { label: "Queries Today", value: "23", icon: MessageSquare },
    { label: "Avg Response Time", value: "1.2s", icon: Clock },
    { label: "Saved Queries", value: "47", icon: Bookmark },
    { label: "Success Rate", value: "98.5%", icon: TrendingUp },
  ];

  const queryHistory = [
    {
      id: 1,
      query: "Show me the top 10 customers by revenue this quarter",
      timestamp: "2 minutes ago",
      status: "completed",
      executionTime: "0.8s",
      results: "10 rows"
    },
    {
      id: 2,
      query: "What are the trending products in the last 30 days?",
      timestamp: "15 minutes ago",
      status: "completed",
      executionTime: "1.2s",
      results: "25 rows"
    },
    {
      id: 3,
      query: "Analyze customer churn rate by region",
      timestamp: "1 hour ago",
      status: "completed",
      executionTime: "2.1s",
      results: "Chart generated"
    },
    {
      id: 4,
      query: "Generate a sales forecast for Q1 2025",
      timestamp: "3 hours ago",
      status: "completed",
      executionTime: "3.4s",
      results: "Forecast model"
    },
  ];

  const savedQueries = [
    {
      id: 1,
      name: "Monthly Revenue Report",
      query: "Generate monthly revenue breakdown by product category",
      tags: ["revenue", "monthly", "products"],
      lastUsed: "Yesterday"
    },
    {
      id: 2,
      name: "Customer Segmentation",
      query: "Segment customers based on purchase behavior and frequency",
      tags: ["customers", "segmentation", "behavior"],
      lastUsed: "3 days ago"
    },
    {
      id: 3,
      name: "Inventory Analysis",
      query: "Show low stock items and forecast reorder points",
      tags: ["inventory", "stock", "forecast"],
      lastUsed: "1 week ago"
    },
  ];

  const queryTemplates = [
    {
      category: "Sales Analytics",
      icon: TrendingUp,
      templates: [
        "Show top performing products this month",
        "Compare sales year over year",
        "Generate sales forecast for next quarter"
      ]
    },
    {
      category: "Customer Insights",
      icon: Database,
      templates: [
        "Identify high-value customers",
        "Analyze customer retention rates",
        "Find customers at risk of churning"
      ]
    },
    {
      category: "Operational Reports",
      icon: BarChart3,
      templates: [
        "Show inventory turnover rates",
        "Analyze shipping performance",
        "Track employee productivity metrics"
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Queries
            </h1>
            <p className="text-muted-foreground mt-1">
              Natural language data analysis and insights
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Query Interface */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Query Interface
                </CardTitle>
                <CardDescription>
                  Ask questions about your data in natural language
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="query">Your Question</Label>
                  <Textarea
                    id="query"
                    placeholder="e.g., Show me the top 10 customers by revenue this quarter..."
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={executeQuery} 
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Execute Query
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Query Results Placeholder */}
            {loading && (
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 mt-6">
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Processing your query...</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Query Templates */}
          <div>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Query Templates</CardTitle>
                <CardDescription>Quick start with common queries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {queryTemplates.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.category}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{category.category}</span>
                      </div>
                      <div className="space-y-1 ml-6">
                        {category.templates.map((template, index) => (
                          <button
                            key={index}
                            onClick={() => setQueryText(template)}
                            className="text-left text-sm text-muted-foreground hover:text-foreground block w-full p-2 rounded hover:bg-accent/50 transition-colors"
                          >
                            {template}
                          </button>
                        ))}
                      </div>
                      {category !== queryTemplates[queryTemplates.length - 1] && (
                        <Separator className="mt-3" />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs for History and Saved Queries */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 mt-8">
          <CardContent className="p-6">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Query History
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Saved Queries
                </TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search query history..." className="pl-10" />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {queryHistory.map((query) => (
                      <div key={query.id} className="p-4 border border-border rounded-lg hover:bg-accent/20 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-sm">{query.query}</p>
                          <Badge variant={query.status === "completed" ? "secondary" : "outline"}>
                            {query.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{query.timestamp}</span>
                          <span>⚡ {query.executionTime}</span>
                          <span>📊 {query.results}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" onClick={() => setQueryText(query.query)}>
                            Rerun
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Bookmark className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="saved" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search saved queries..." className="pl-10" />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {savedQueries.map((query) => (
                      <div key={query.id} className="p-4 border border-border rounded-lg hover:bg-accent/20 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{query.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{query.query}</p>
                          </div>
                          <Badge variant="outline">Saved</Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          {query.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Last used: {query.lastUsed}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setQueryText(query.query)}>
                              Use Query
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Share className="h-3 w-3 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
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

export default Queries;