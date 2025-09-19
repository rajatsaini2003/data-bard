import Navigation from "@/components/Navigation";
import DynamicDashboard from "@/components/dashboard/DynamicDashboard";
import { 
  BarChart3
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                AI-powered data analysis and visualization
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Dashboard */}
        <DynamicDashboard />
      </div>
    </div>
  );
};

export default Dashboard;