import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import { 
  BarChart3, 
  Users, 
  Database, 
  TrendingUp, 
  MessageSquare, 
  Send,
  Plus,
  Filter,
  Download
} from "lucide-react";

const Dashboard = () => {
  const [query, setQuery] = useState("");

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

  const recentQueries = [
    "Show me revenue by region for the last quarter",
    "What are the top performing products this month?",
    "Compare user engagement across different channels",
    "Analyze customer churn rate by segment"
  ];

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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Natural Language Query */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  AI Query Assistant
                </h2>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask anything about your data..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-background/50 border-border"
                  />
                  <Button variant="hero">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="h-64 bg-muted/30 rounded-lg border border-border flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Your visualization will appear here</p>
                    <p className="text-sm text-muted-foreground">Ask a question to get started</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Try asking: "Show me sales trends for the last 6 months"
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Queries & Quick Actions */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <h3 className="text-lg font-semibold mb-4">Recent Queries</h3>
              <div className="space-y-3">
                {recentQueries.map((query, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-lg bg-background/50 border border-border hover:bg-accent/50 cursor-pointer transition-colors text-sm"
                  >
                    {query}
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Queries
              </Button>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="dashboard" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Dashboard
                </Button>
                <Button variant="dashboard" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Connect Data Source
                </Button>
                <Button variant="dashboard" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Team Member
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;