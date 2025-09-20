import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import DynamicFilters from './DynamicFilters';
import DynamicCards from './DynamicCards';
import DynamicCharts from './DynamicCharts';
import DynamicTable from './DynamicTable';
import { Search, AlertCircle, BarChart3, Send, RefreshCw } from 'lucide-react';
import { apiService } from '@/services/api';
import { DashboardData } from '@/types';
import { toast } from '@/hooks/use-toast';

interface DynamicDashboardProps {
  className?: string;
}

const DynamicDashboard = ({ className }: DynamicDashboardProps) => {
  const [query, setQuery] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [filteredData, setFilteredData] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example queries for user guidance
  const exampleQueries = [
    "Show me sales performance by region",
    "Display revenue trends over time",
    "Analyze product performance metrics",
    "Create a dashboard for customer analytics"
  ];

  const submitQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a query to generate your dashboard.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.query.submit({ query: query.trim() });
      setDashboardData(response.data);
      setFilteredData(response.data.data || []);
      
      toast({
        title: "Dashboard Generated",
        description: "Your custom dashboard has been created successfully.",
      });
    } catch (err: unknown) {
      const error = err as { 
        response?: { data?: { detail?: string } }; 
        code?: string; 
        message?: string;
      };
      
      let errorMessage = 'Failed to generate dashboard';
      let errorDetails = '';
      
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        errorMessage = 'Connection Error';
        errorDetails = 'Unable to connect to the server. Please check if the backend is running.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request Timeout';
        errorDetails = 'The request took too long to complete. Please try again.';
      } else if (error.response?.data?.detail) {
        errorMessage = 'Server Error';
        errorDetails = error.response.data.detail;
      } else if (error.message) {
        errorMessage = 'Request Failed';
        errorDetails = error.message;
      }
      
      setError(`${errorMessage}: ${errorDetails}`);
      
      toast({
        title: errorMessage,
        description: errorDetails,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      submitQuery();
    }
  };

  const regenerateDashboard = () => {
    if (dashboardData) {
      submitQuery();
    }
  };

  const handleFiltersChange = (newFilteredData: Record<string, unknown>[]) => {
    setFilteredData(newFilteredData);
  };

  const renderQueryInput = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Query Your Data
        </CardTitle>
        <CardDescription>
          Describe what kind of dashboard or analysis you want to see
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="query">Your Query</Label>
            <Textarea
              id="query"
              placeholder="e.g., Show me sales data by region with revenue trends..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Press Ctrl+Enter to submit
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
            <Button
              onClick={submitQuery}
              disabled={isLoading || !query.trim()}
              className="sm:w-auto"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Generating...' : 'Generate Dashboard'}
            </Button>

            {dashboardData && (
              <Button
                variant="outline"
                onClick={regenerateDashboard}
                disabled={isLoading}
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            )}
          </div>

          {/* Example queries */}
          <div>
            <p className="text-sm font-medium mb-2">Example queries:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(example)}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderLoadingSkeleton = () => (
    <div className="space-y-6">
      {/* Loading message */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            <div>
              <p className="text-lg font-medium">Generating your dashboard...</p>
              <p className="text-sm text-muted-foreground">
                This may take up to 5 minutes. Please wait while we process your query.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Skeleton className="h-64 w-full" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
      
      <Skeleton className="h-96 w-full" />
    </div>
  );

  const renderError = () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  const renderDashboard = () => {
    if (!dashboardData) return null;

    return (
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {dashboardData.title}
          </h1>
          {dashboardData.description && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {dashboardData.description}
            </p>
          )}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            Template: {dashboardData.template}
          </div>
        </div>

        {/* Filters */}
        {dashboardData.filters && dashboardData.filters.length > 0 && (
          <DynamicFilters
            filters={dashboardData.filters}
            data={dashboardData.data}
            onFiltersChange={handleFiltersChange}
          />
        )}

        {/* Cards */}
        {dashboardData.cards && dashboardData.cards.length > 0 && (
          <DynamicCards
            cards={dashboardData.cards}
            data={filteredData}
          />
        )}

        {/* Charts */}
        {dashboardData.charts && dashboardData.charts.length > 0 && (
          <DynamicCharts
            charts={dashboardData.charts}
            data={filteredData}
          />
        )}

        {/* Tables */}
        {dashboardData.table && (
          <DynamicTable
            table={dashboardData.table}
            data={filteredData}
          />
        )}

        {dashboardData.tables && dashboardData.tables.map((table) => (
          <DynamicTable
            key={table.id}
            table={table}
            data={filteredData}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={className}>
      {renderQueryInput()}
      
      {error && renderError()}
      
      {isLoading && renderLoadingSkeleton()}
      
      {!isLoading && !error && renderDashboard()}
      
      {!isLoading && !error && !dashboardData && (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Dashboard Generated</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Enter a query above to generate a custom dashboard based on your data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DynamicDashboard;