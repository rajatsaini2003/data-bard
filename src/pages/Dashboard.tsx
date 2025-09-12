import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import DynamicDashboard from "@/components/DynamicDashboard";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  MessageSquare, 
  Send,
  PieChart,
  Brain,
  Sparkles
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("analyze");
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
    
    // Simulate AI analysis with dashboard generation - returns JSON for dashboard
    setTimeout(() => {
      const dashboardJson = {
        query: query,
        insights: [
          "Revenue increased 15% compared to last quarter",
          "Top performing region is North America with 45% of total sales", 
          "Customer retention rate improved by 8%"
        ],
        dashboard: mockDashboardConfig
      };
      
      setAnalysisResults(dashboardJson);
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

  // Mock dashboard configuration - JSON structure for dashboard generation
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
          <p className="text-muted-foreground">AI-powered data analysis at your fingertips.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="analyze">AI Analysis</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze">
            {/* Centered AI Analysis Section */}
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-border">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
                    <Brain className="h-10 w-10 mr-3 text-primary" />
                    AI Data Analyst
                  </h1>
                  <p className="text-xl text-muted-foreground">Ask questions about your data in plain English and get instant insights</p>
                </div>
              
                <div className="space-y-6">
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Ask anything about your data in plain English..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="flex-1 bg-background/50 border-border min-h-[80px] resize-none text-lg"
                      rows={3}
                    />
                    <Button 
                      variant="hero" 
                      onClick={analyzeData}
                      disabled={isAnalyzing}
                      className="px-8 py-4 text-lg h-auto"
                    >
                      {isAnalyzing ? (
                        <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  
                  {isAnalyzing ? (
                    <div className="h-80 bg-muted/30 rounded-lg border border-border flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="animate-spin h-12 w-12 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                        <p className="text-lg text-muted-foreground">Analyzing your data...</p>
                        <p className="text-muted-foreground">Generating dashboard from your query...</p>
                      </div>
                    </div>
                  ) : analysisResults ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-background/50 rounded-lg border border-border">
                        <h3 className="text-lg font-semibold mb-3">Analysis Results</h3>
                        <p className="text-muted-foreground mb-4">Query: "{analysisResults.query}"</p>
                        <div className="space-y-3">
                          {analysisResults.insights.map((insight: string, index: number) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <p className="text-sm">{insight}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Button 
                          variant="hero" 
                          onClick={() => setActiveTab("dashboard")}
                          className="px-8"
                        >
                          View Generated Dashboard
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-80 bg-muted/30 rounded-lg border border-border flex items-center justify-center">
                      <div className="text-center">
                        <MessageSquare className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg text-muted-foreground mb-2">Your analysis will appear here</p>
                        <p className="text-muted-foreground">Ask a question to get started with AI-powered insights</p>
                      </div>
                    </div>
                  )}

                  {/* Sample Queries */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-primary" />
                      Try these sample queries
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  </div>
                </div>
              </Card>
            </div>
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