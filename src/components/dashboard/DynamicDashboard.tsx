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
import { DashboardData, DashboardChart, TableColumn } from '@/types';
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
    "Show me sales performance by region with revenue breakdown",
    "Display revenue trends over the last 12 months with comparison",
    "Analyze product performance metrics including quantity and profit margins",
    "Create a customer analytics dashboard with demographic insights",
    "Show employee performance metrics by department",
    "Display medical data analysis with diagnostic patterns"
  ];

  // Auto-fix configuration function to handle field mapping mismatches
  const fixDashboardConfiguration = (data: DashboardData): DashboardData => {
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      return data;
    }

    const sampleRecord = data.data[0];
    const availableFields = Object.keys(sampleRecord);
    const fixedData = { ...data };

    // Create default cards if missing or empty
    if (!fixedData.cards || !Array.isArray(fixedData.cards) || fixedData.cards.length === 0) {
      const numericFields = availableFields.filter(field => 
        typeof sampleRecord[field] === 'number' && 
        field !== 'id' && 
        !field.startsWith('unnamed') &&
        sampleRecord[field] !== null
      );
      
      // Get a meaningful identifier field for counting
      const countField = availableFields.find(field => 
        field.includes('name') || field.includes('title') || field === 'id' ||
        (typeof sampleRecord[field] === 'string' && sampleRecord[field])
      ) || availableFields[0];
      
      const defaultCards = [];
      
      // Total count card with proper field
      if (countField) {
        defaultCards.push({
          id: 'card-count',
          title: 'Total Movies',
          valueField: countField,
          aggregation: 'count' as const,
          format: 'number'
        });
      }

      // Add cards for meaningful numeric fields
      const priorityFields = ['rating', 'votes', 'meta_score', 'year'];
      const selectedFields = [];
      
      // First, try to get priority fields
      priorityFields.forEach(priority => {
        const field = numericFields.find(f => f.includes(priority));
        if (field && selectedFields.length < 3) {
          selectedFields.push(field);
        }
      });
      
      // Fill remaining slots with other numeric fields
      numericFields.forEach(field => {
        if (selectedFields.length < 3 && !selectedFields.includes(field)) {
          selectedFields.push(field);
        }
      });

      selectedFields.forEach((field, index) => {
        let title = field.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
        let aggregation: 'avg' | 'sum' | 'count' = 'avg';
        let format = 'number';
        
        // Customize based on field type
        if (field.includes('rating') || field.includes('score')) {
          title = `Average ${title}`;
          format = 'decimal';
        } else if (field.includes('votes') || field.includes('count')) {
          title = `Total ${title}`;
          aggregation = 'sum';
        } else if (field.includes('year')) {
          title = `Average ${title}`;
        }
        
        defaultCards.push({
          id: `card-${index + 1}`,
          title,
          valueField: field,
          aggregation,
          format
        });
      });

      fixedData.cards = defaultCards;
    }

    // Fix existing cards that reference non-existent fields
    if (fixedData.cards && Array.isArray(fixedData.cards)) {
      fixedData.cards = fixedData.cards.map((card) => {
        if (card.valueField && !availableFields.includes(card.valueField)) {
          // Try to find a suitable numeric field, avoid unnamed fields
          const numericField = availableFields.find(field => 
            typeof sampleRecord[field] === 'number' && 
            field !== 'id' && 
            !field.startsWith('unnamed') &&
            sampleRecord[field] !== null
          );
          
          if (numericField) {
            return { ...card, valueField: numericField };
          }
          
          // Fallback to count aggregation on a meaningful field
          const countField = availableFields.find(field => 
            field.includes('name') || field.includes('title') || field === 'id'
          ) || availableFields[0];
          
          return { 
            ...card, 
            valueField: countField,
            aggregation: 'count' as const,
            title: card.title || 'Count'
          };
        }
        return card;
      });
    }

    // Fix charts that reference non-existent fields
    if (fixedData.charts && Array.isArray(fixedData.charts)) {
      fixedData.charts = fixedData.charts.map((chart) => {
        const updatedChart = { ...chart };
        const chartWithExtended = chart as DashboardChart & { categoryField?: string; field?: string; data?: Record<string, unknown>[] };

        // If chart has its own data, use that for field validation, otherwise use main data
        const chartData = (chartWithExtended.data && Array.isArray(chartWithExtended.data) && chartWithExtended.data.length > 0) 
          ? chartWithExtended.data[0] 
          : sampleRecord;
        const chartFields = Object.keys(chartData);

        // Fix xAxis field
        if (chart.xAxis && !chartFields.includes(chart.xAxis)) {
          const categoricalField = chartFields.find(field => 
            !field.startsWith('unnamed') &&
            (typeof chartData[field] === 'string' || 
            (typeof chartData[field] === 'number' && (field.includes('year') || field === 'id')))
          );
          if (categoricalField) {
            updatedChart.xAxis = categoricalField;
          }
        }

        // Fix yAxis field
        if (chart.yAxis && !chartFields.includes(chart.yAxis)) {
          const numericField = chartFields.find(field => 
            !field.startsWith('unnamed') &&
            typeof chartData[field] === 'number' && 
            !field.includes('year') && 
            field !== 'id' &&
            chartData[field] !== null
          );
          if (numericField) {
            updatedChart.yAxis = numericField;
          }
        }

        // Fix categoryField for pie charts
        if (chart.type === 'pie' && chartWithExtended.categoryField && !chartFields.includes(chartWithExtended.categoryField)) {
          const categoricalField = chartFields.find(field => 
            typeof chartData[field] === 'string'
          );
          if (categoricalField) {
            (updatedChart as typeof chartWithExtended).categoryField = categoricalField;
          }
        }

        // Fix field for pie charts
        if (chart.type === 'pie' && chartWithExtended.field && !chartFields.includes(chartWithExtended.field)) {
          const numericField = chartFields.find(field => 
            typeof chartData[field] === 'number'
          );
          if (numericField) {
            (updatedChart as typeof chartWithExtended).field = numericField;
          }
        }

        // Fix series fields
        if (chart.series && Array.isArray(chart.series)) {
          updatedChart.series = chart.series.map((series) => {
            if (series.field && !chartFields.includes(series.field)) {
              const numericField = chartFields.find(field => 
                typeof chartData[field] === 'number' && !field.includes('year') && field !== 'id'
              );
              if (numericField) {
                return { ...series, field: numericField };
              }
            }
            return series;
          });
        }

        return updatedChart;
      });
    }

    // Fix table columns that reference non-existent fields
    if (fixedData.tables && Array.isArray(fixedData.tables)) {
      fixedData.tables = fixedData.tables.map((table) => {
        if (table.columns && Array.isArray(table.columns)) {
          const validColumns = table.columns.filter((col) => 
            availableFields.includes(col.field)
          );
          
          // If no valid columns, create some from available fields
          if (validColumns.length === 0) {
            const defaultColumns: TableColumn[] = availableFields.slice(0, 5).map(field => ({
              field,
              header: field.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
              sortable: true,
              format: typeof sampleRecord[field] === 'number' ? 'number' : 'text'
            }));
            return { ...table, columns: defaultColumns };
          }
          
          return { ...table, columns: validColumns };
        }
        return table;
      });
    }

    // Fix single table that references non-existent fields
    if (fixedData.table && fixedData.table.columns && Array.isArray(fixedData.table.columns)) {
      const validColumns = fixedData.table.columns.filter((col) => 
        availableFields.includes(col.field)
      );
      
      // If no valid columns, create some from available fields
      if (validColumns.length === 0) {
        const defaultColumns: TableColumn[] = availableFields.slice(0, 5).map(field => ({
          field,
          header: field.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          sortable: true,
          format: typeof sampleRecord[field] === 'number' ? 'number' : 'text'
        }));
        fixedData.table = { ...fixedData.table, columns: defaultColumns };
      } else {
        fixedData.table = { ...fixedData.table, columns: validColumns };
      }
    }

    // Fix filters with complex structure and nested data
    if (fixedData.filters && Array.isArray(fixedData.filters)) {
      fixedData.filters = fixedData.filters.map((filter) => {
        const fixedFilter = { ...filter };
        const filterWithData = filter as typeof filter & { data?: Record<string, unknown>[]; target_field?: string };
        
        // If filter has its own data array with options, extract them
        if (filterWithData.data && Array.isArray(filterWithData.data) && filterWithData.data.length > 0) {
          const filterOptions = filterWithData.data.map((item: Record<string, unknown>) => {
            const field = filterWithData.target_field || filter.field;
            return String(item[field as string] || item[Object.keys(item)[0]] || '');
          }).filter(Boolean);
          
          fixedFilter.options = [...new Set(filterOptions)].slice(0, 20); // Limit to 20 options
        }
        
        // Ensure the filter field exists in main data
        if (filter.field && !availableFields.includes(filter.field)) {
          const categoricalField = availableFields.find(field => 
            typeof sampleRecord[field] === 'string'
          );
          if (categoricalField) {
            fixedFilter.field = categoricalField;
          }
        }
        
        return fixedFilter;
      });
    }

    return fixedData;
  };

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
      
      // Apply auto-fix configuration to handle field mapping mismatches
      const fixedData = fixDashboardConfiguration(response.data);
      
      setDashboardData(fixedData);
      setFilteredData(fixedData.data || []);
      
      // Check if any auto-fixes were applied by comparing original and fixed data
      const hasFieldMappingIssues = JSON.stringify(response.data) !== JSON.stringify(fixedData);
      
      toast({
        title: "Dashboard Generated",
        description: hasFieldMappingIssues 
          ? "Your custom dashboard has been created successfully. Configuration was automatically adjusted to match your data structure."
          : "Your custom dashboard has been created successfully.",
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
        errorDetails = 'Unable to connect to the server. Please check if the backend is running and try again.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request Timeout';
        errorDetails = 'The request took too long to complete. The server may be processing a large query. Please try again or simplify your query.';
      } else if (error.response?.data?.detail) {
        errorMessage = 'Server Error';
        errorDetails = error.response.data.detail;
      } else if (error.message) {
        errorMessage = 'Request Failed';
        errorDetails = error.message;
      } else {
        errorMessage = 'Unknown Error';
        errorDetails = 'An unexpected error occurred while processing your request.';
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
                This may take up to 5 minutes. We're analyzing your data and creating visualizations with automatic field mapping.
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
            <h3 className="text-lg font-medium mb-2">Ready to Generate Your Dashboard</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Enter a query above to generate a custom dashboard with automatic field mapping and intelligent visualizations based on your data.
            </p>
            <p className="text-xs text-muted-foreground">
              Our System will automatically handle field mismatches and optimize your dashboard layout.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DynamicDashboard;