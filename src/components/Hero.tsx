import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Brain, Database } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-analytics.jpg";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-dashboard"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              <span className="text-foreground">Data Analytics</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Transform your organization's data into actionable insights with natural language queries. 
              Connect your databases, invite your team, and unlock the power of AI-driven analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="hero" size="lg" className="group" asChild>
                <Link to="/auth">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border animate-slide-up">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Natural Language</h3>
                  <p className="text-sm text-muted-foreground">Ask questions in plain English</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="p-2 rounded-lg bg-accent-blue/10">
                  <Database className="h-6 w-6 text-accent-blue" />
                </div>
                <div>
                  <h3 className="font-semibold">Multi-Database</h3>
                  <p className="text-sm text-muted-foreground">Connect any data source</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="p-2 rounded-lg bg-accent-purple/10">
                  <BarChart3 className="h-6 w-6 text-accent-purple" />
                </div>
                <div>
                  <h3 className="font-semibold">Smart Dashboards</h3>
                  <p className="text-sm text-muted-foreground">Auto-generated insights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Dashboard Preview */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-accent rounded-2xl blur-3xl opacity-30"></div>
              <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Revenue Analytics</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold text-primary">$2.4M</p>
                      <p className="text-sm text-success">+12.5%</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent-teal/10 border border-accent-teal/20">
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold text-accent-teal">15.8K</p>
                      <p className="text-sm text-success">+8.2%</p>
                    </div>
                  </div>
                  
                  <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground" />
                  </div>
                  
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm font-medium">💬 "Show me revenue by region for the last quarter"</p>
                    <p className="text-xs text-muted-foreground mt-1">Natural language query</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;