import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid
} from "recharts";
import { Filter, Download, RefreshCcw } from "lucide-react";

interface ChartConfig {
  title: string;
  type: "bar" | "line" | "pie" | "histogram";
  x: string;
  y: string;
  description: string;
  color: string;
}

interface FilterConfig {
  label: string;
  id: string;
  type: "multichoice" | "slider";
}

interface DashboardData {
  layout: string;
  cards: string[];
  filters: FilterConfig[];
  alleys: {
    charts: ChartConfig[];
    title: string;
  }[];
  include_table: boolean;
  theme: "light" | "dark";
}

interface DynamicDashboardProps {
  data: DashboardData;
  chartData: any[];
}

// Mock chart data for different visualizations
const mockChartData = {
  sales: [
    { name: "North America", sales: 4500, revenue: 120000 },
    { name: "Europe", sales: 3800, revenue: 98000 },
    { name: "Asia", sales: 5200, revenue: 145000 },
    { name: "South America", sales: 2100, revenue: 55000 },
    { name: "Africa", sales: 1800, revenue: 42000 },
  ],
  revenue: [
    { month: "Jan", revenue: 65000, sales: 2400 },
    { month: "Feb", revenue: 78000, sales: 2800 },
    { month: "Mar", revenue: 92000, sales: 3200 },
    { month: "Apr", revenue: 88000, sales: 3100 },
    { month: "May", revenue: 105000, sales: 3600 },
    { month: "Jun", revenue: 125000, sales: 4200 },
  ]
};

const DynamicDashboard = ({ data, chartData }: DynamicDashboardProps) => {
  const renderChart = (chart: ChartConfig, index: number) => {
    const chartDataToUse = mockChartData.sales; // Default data

    const chartConfig = {
      [chart.y]: {
        label: chart.y,
        color: chart.color,
      },
    };

    switch (chart.type) {
      case "bar":
        return (
          <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{chart.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{chart.description}</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={chartDataToUse}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={chart.x.toLowerCase().replace(' ', '_')} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey={chart.y.toLowerCase()} 
                    fill={chart.color} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        );

      case "line":
        return (
          <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{chart.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{chart.description}</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart data={mockChartData.revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey={chart.y.toLowerCase()} 
                    stroke={chart.color}
                    strokeWidth={3}
                    dot={{ fill: chart.color, r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        );

      case "pie":
        return (
          <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{chart.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{chart.description}</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <PieChart>
                  <Pie
                    data={chartDataToUse}
                    dataKey={chart.y.toLowerCase()}
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {chartDataToUse.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${220 + index * 30}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        );

      case "histogram":
        return (
          <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{chart.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{chart.description}</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={chartDataToUse}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={chart.x.toLowerCase().replace(' ', '_')} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey={chart.y.toLowerCase()} 
                    fill={chart.color}
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderFilter = (filter: FilterConfig, index: number) => {
    switch (filter.type) {
      case "multichoice":
        return (
          <Card key={index} className="p-4 bg-card/30 backdrop-blur-sm border-border/50">
            <div className="space-y-2">
              <label className="text-sm font-medium">{filter.label}</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${filter.label}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {filter.label}</SelectItem>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        );

      case "slider":
        return (
          <Card key={index} className="p-4 bg-card/30 backdrop-blur-sm border-border/50">
            <div className="space-y-3">
              <label className="text-sm font-medium">{filter.label}</label>
              <Slider
                defaultValue={[50]}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>100</span>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderCard = (cardType: string, index: number) => {
    const cardData = {
      sales: { title: "Total Sales", value: "45.2K", change: "+12.5%" },
      revenue: { title: "Revenue", value: "$2.4M", change: "+8.3%" },
      region: { title: "Top Region", value: "North America", change: "45% of total" }
    };

    const card = cardData[cardType as keyof typeof cardData];
    if (!card) return null;

    return (
      <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">{card.title}</p>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-sm text-success mt-1">{card.change}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderDataTable = () => {
    if (!data.include_table) return null;

    return (
      <Card className="mt-8 bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Data Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockChartData.sales.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.sales.toLocaleString()}</TableCell>
                  <TableCell>${row.revenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-success/10 text-success">
                      +{(Math.random() * 20 + 5).toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dynamic Dashboard</h2>
          <p className="text-muted-foreground">Layout: {data.layout}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {data.cards.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.cards.map((card, index) => renderCard(card, index))}
          </div>
        </div>
      )}

      {/* Filters */}
      {data.filters.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.filters.map((filter, index) => renderFilter(filter, index))}
          </div>
        </div>
      )}

      {/* Chart Alleys */}
      {data.alleys.map((alley, alleyIndex) => (
        <div key={alleyIndex}>
          <h3 className="text-lg font-semibold mb-4">{alley.title}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {alley.charts.map((chart, chartIndex) => renderChart(chart, chartIndex))}
          </div>
        </div>
      ))}

      {/* Data Table */}
      {renderDataTable()}
    </div>
  );
};

export default DynamicDashboard;