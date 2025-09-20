import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DynamicFilters from '@/components/dashboard/DynamicFilters';
import DynamicCards from '@/components/dashboard/DynamicCards';
import DynamicCharts from '@/components/dashboard/DynamicCharts';
import DynamicTable from '@/components/dashboard/DynamicTable';
import { DashboardData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { 
  TestTube, 
  Download, 
  Upload, 
  Code, 
  AlertCircle,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

const TestDashboard = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [filteredData, setFilteredData] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  // Sample JSON responses for testing
  const sampleJsonResponses = {
    salesAnalysis: {
      title: "Sample Sales Analysis",
      json: {
        "template": "minimal-reports",
        "title": "Product Sales Analysis",
        "data": [
          {
            "id": 1,
            "name": "Product A",
            "category": "Electronics",
            "total_revenue": 15000,
            "total_quantity_sold": 30,
            "average_product_price": 500,
            "number_of_sales": 25
          },
          {
            "id": 2,
            "name": "Product B",
            "category": "Clothing",
            "total_revenue": 8000,
            "total_quantity_sold": 40,
            "average_product_price": 200,
            "number_of_sales": 20
          },
          {
            "id": 3,
            "name": "Product C",
            "category": "Home Goods",
            "total_revenue": 12000,
            "total_quantity_sold": 20,
            "average_product_price": 600,
            "number_of_sales": 15
          }
        ],
        "filters": [
          {
            "field": "category",
            "type": "dropdown",
            "options": ["Electronics", "Clothing", "Home Goods"],
            "label": "Product Category"
          }
        ],
        "cards": [
          {
            "id": "card-1",
            "title": "Total Revenue",
            "valueField": "total_revenue",
            "aggregation": "sum",
            "format": "currency"
          },
          {
            "id": "card-2",
            "title": "Total Units Sold",
            "valueField": "total_quantity_sold",
            "aggregation": "sum",
            "format": "number"
          }
        ],
        "charts": [
          {
            "id": "chart-1",
            "type": "bar",
            "title": "Revenue by Category",
            "xAxis": "category",
            "yAxis": "total_revenue",
            "series": [
              {
                "name": "Revenue",
                "field": "total_revenue",
                "type": "bar"
              }
            ]
          },
          {
            "id": "chart-2",
            "type": "pie",
            "title": "Sales Distribution",
            "categoryField": "category",
            "field": "total_revenue"
          }
        ],
        "tables": [
          {
            "id": "table-1",
            "title": "Product Details",
            "columns": [
              {
                "field": "name",
                "header": "Product Name",
                "sortable": true
              },
              {
                "field": "category",
                "header": "Category",
                "sortable": true
              },
              {
                "field": "total_revenue",
                "header": "Revenue",
                "format": "currency",
                "sortable": true
              }
            ]
          }
        ]
      }
    },
    customerAnalytics: {
      title: "Customer Analytics",
      json: {
        "template": "analytics-dashboard",
        "title": "Customer Analytics Dashboard",
        "data": [
          {
            "month": "Jan",
            "new_customers": 120,
            "returning_customers": 80,
            "total_revenue": 25000,
            "avg_order_value": 156.25
          },
          {
            "month": "Feb",
            "new_customers": 150,
            "returning_customers": 95,
            "total_revenue": 30000,
            "avg_order_value": 163.93
          },
          {
            "month": "Mar",
            "new_customers": 180,
            "returning_customers": 110,
            "total_revenue": 35000,
            "avg_order_value": 170.73
          }
        ],
        "filters": [
          {
            "field": "month",
            "type": "dropdown",
            "options": ["Jan", "Feb", "Mar"],
            "label": "Month"
          }
        ],
        "cards": [
          {
            "id": "card-1",
            "title": "New Customers",
            "valueField": "new_customers",
            "aggregation": "sum",
            "format": "number"
          },
          {
            "id": "card-2",
            "title": "Revenue",
            "valueField": "total_revenue",
            "aggregation": "sum",
            "format": "currency"
          }
        ],
        "charts": [
          {
            "id": "chart-1",
            "type": "line",
            "title": "Customer Growth",
            "xAxis": "month",
            "yAxis": "new_customers",
            "series": [
              {
                "name": "New Customers",
                "field": "new_customers",
                "type": "line"
              }
            ]
          }
        ]
      }
    },
    performanceMetrics: {
      title: "Performance Metrics",
      json: {
        "template": "performance-dashboard",
        "title": "Performance Metrics",
        "data": [
          {
            "department": "Sales",
            "performance_score": 85,
            "target": 80,
            "achievement": 106.25,
            "employees": 25
          },
          {
            "department": "Marketing",
            "performance_score": 92,
            "target": 85,
            "achievement": 108.24,
            "employees": 15
          },
          {
            "department": "Support",
            "performance_score": 78,
            "target": 75,
            "achievement": 104.00,
            "employees": 20
          }
        ],
        "cards": [
          {
            "id": "card-1",
            "title": "Average Performance",
            "valueField": "performance_score",
            "aggregation": "avg",
            "format": "number"
          },
          {
            "id": "card-2",
            "title": "Total Employees",
            "valueField": "employees",
            "aggregation": "sum",
            "format": "number"
          }
        ],
        "charts": [
          {
            "id": "chart-1",
            "type": "bar",
            "title": "Performance by Department",
            "xAxis": "department",
            "yAxis": "performance_score",
            "series": [
              {
                "name": "Performance",
                "field": "performance_score",
                "type": "bar"
              }
            ]
          }
        ]
      }
    }
  };

  const handleJsonSubmit = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "JSON Required",
        description: "Please enter JSON data to render the dashboard.",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsedData = JSON.parse(jsonInput);
      setDashboardData(parsedData);
      setFilteredData(parsedData.data || []);
      setError(null);
      
      toast({
        title: "Dashboard Rendered",
        description: "Your JSON has been successfully parsed and rendered.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid JSON format';
      setError(errorMessage);
      
      toast({
        title: "Parse Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleSampleLoad = (sampleKey: keyof typeof sampleJsonResponses) => {
    const sample = sampleJsonResponses[sampleKey];
    setJsonInput(JSON.stringify(sample.json, null, 2));
    
    toast({
      title: "Sample Loaded",
      description: `${sample.title} JSON has been loaded into the editor.`,
    });
  };

  const handleCopyJson = async (sampleKey: keyof typeof sampleJsonResponses) => {
    const sample = sampleJsonResponses[sampleKey];
    try {
      await navigator.clipboard.writeText(JSON.stringify(sample.json, null, 2));
      setCopied(sampleKey);
      setTimeout(() => setCopied(null), 2000);
      
      toast({
        title: "Copied!",
        description: `${sample.title} JSON copied to clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy JSON to clipboard.",
        variant: "destructive"
      });
    }
  };

  const clearDashboard = () => {
    setJsonInput('');
    setDashboardData(null);
    setFilteredData([]);
    setError(null);
  };

  const downloadJson = () => {
    if (!jsonInput.trim()) return;
    
    const blob = new Blob([jsonInput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFiltersChange = (newFilteredData: Record<string, unknown>[]) => {
    setFilteredData(newFilteredData);
  };

  const renderDashboard = () => {
    if (!dashboardData) return null;

    return (
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{dashboardData.title || 'Test Dashboard'}</h2>
            <p className="text-muted-foreground">Rendered from JSON input</p>
          </div>
          <Badge variant="secondary">
            {dashboardData.template || 'Custom'}
          </Badge>
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
        {dashboardData.tables && dashboardData.tables.map((table) => (
          <DynamicTable
            key={table.id}
            table={table}
            data={filteredData}
          />
        ))}

        {dashboardData.table && (
          <DynamicTable
            table={dashboardData.table}
            data={filteredData}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <TestTube className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Dashboard Test Page
              </h1>
              <p className="text-muted-foreground mt-1">
                Test dashboard rendering by directly inputting JSON responses
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="input">JSON Input</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* JSON Input */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      JSON Input
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Paste your dashboard JSON here..."
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        className="min-h-[400px] font-mono text-sm"
                      />
                      
                      <div className="flex gap-2">
                        <Button onClick={handleJsonSubmit} className="flex-1">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Render Dashboard
                        </Button>
                        <Button variant="outline" onClick={downloadJson} disabled={!jsonInput.trim()}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" onClick={clearDashboard}>
                          Clear
                        </Button>
                      </div>

                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sample JSON Options */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Sample JSON Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(sampleJsonResponses).map(([key, sample]) => (
                        <div key={key} className="p-3 border rounded-lg space-y-2">
                          <h4 className="font-medium text-sm">{sample.title}</h4>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSampleLoad(key as keyof typeof sampleJsonResponses)}
                              className="flex-1"
                            >
                              Load
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopyJson(key as keyof typeof sampleJsonResponses)}
                            >
                              {copied === key ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            {dashboardData ? (
              renderDashboard()
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <TestTube className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Dashboard Data</h3>
                  <p className="text-muted-foreground mb-4">
                    Enter JSON data in the input tab to see the dashboard preview here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestDashboard;