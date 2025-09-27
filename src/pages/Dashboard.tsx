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
                AI-powered data analysis with intelligent field mapping and visualization
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Enhanced Dashboard Features</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Now includes automatic field mapping, improved error handling, and intelligent chart configuration. 
                  The system will automatically adjust configurations to match your data structure.
                </p>
              </div>
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