import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Scatter, ScatterChart } from 'recharts';
import { DashboardChart } from '@/types';

interface DynamicChartsProps {
  charts: DashboardChart[];
  data: Record<string, unknown>[];
  className?: string;
}

const DynamicCharts = ({ charts, data, className }: DynamicChartsProps) => {
  const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
    '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
  ];

  const processDataForChart = (chart: DashboardChart) => {
    // Check for chart-specific data (from API responses with SQL queries)
    const chartWithData = chart as DashboardChart & { data?: Record<string, unknown>[] };
    if (chartWithData.data && chartWithData.data.length > 0) {
      // Use predefined data (e.g., for charts with SQL queries)
      // Note: Predefined chart data doesn't get filtered by the dashboard filters
      return chartWithData.data;
    }

    // Use filtered data from the dashboard
    const workingData = data.filter(item => {
      // Filter out null/undefined values for better visualization
      return Object.values(item).some(value => value !== null && value !== undefined && value !== '');
    });

    // Process data based on chart type
    if (chart.type === 'pie') {
      // Support both formats: xAxis/yAxis and categoryField/field
      const chartWithFields = chart as DashboardChart & { categoryField?: string; field?: string };
      const categoryField = chartWithFields.categoryField || chart.xAxis;
      const valueField = chartWithFields.field || chart.yAxis;
      
      if (!categoryField || !valueField) {
        console.warn('Pie chart missing required fields:', { categoryField, valueField, chart });
        return [];
      }

      // Group data by category field and sum value field
      const grouped = workingData.reduce((acc, item) => {
        const categoryValue = item[categoryField];
        const numericValue = item[valueField];
        
        // Skip items with null/undefined values
        if (categoryValue === null || categoryValue === undefined || 
            numericValue === null || numericValue === undefined) {
          return acc;
        }
        
        const key = String(categoryValue);
        const value = Number(numericValue) || 0;
        
        if (acc[key]) {
          acc[key] = (acc[key] as number) + value;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(grouped)
        .filter(([_, value]) => (value as number) > 0) // Remove zero values
        .map(([name, value]) => ({
          name,
          value: value as number
        }));
    }

    // For other chart types, return filtered data with proper field mapping
    return workingData
      .filter(item => {
        // Ensure chart fields have valid values
        const xValue = item[chart.xAxis];
        const yValue = item[chart.yAxis];
        return xValue !== null && xValue !== undefined && 
               yValue !== null && yValue !== undefined;
      })
      .map(item => ({
        ...item,
        [chart.xAxis]: item[chart.xAxis],
        [chart.yAxis]: item[chart.yAxis]
      }));
  };

  const renderTooltip = (chart: DashboardChart) => {
    if (!chart.tooltip?.enabled) return null;

    return (
      <ChartTooltip
        content={({ active, payload, label }) => {
          if (!active || !payload || payload.length === 0) return null;

          return (
            <div className="bg-background border border-border rounded-lg shadow-lg p-3">
              {chart.type === 'pie' && payload[0] ? (
                <div>
                  <p className="font-medium">{payload[0].name}</p>
                  <p className="text-sm" style={{ color: payload[0].color }}>
                    Value: {payload[0].value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payload[0].payload?.percent ? `${(payload[0].payload.percent * 100).toFixed(1)}%` : ''}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">{label}</p>
                  {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                      {entry.name}: {entry.value}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      />
    );
  };

  const renderChart = (chart: DashboardChart) => {
    const chartData = processDataForChart(chart);
    const tooltip = renderTooltip(chart);

    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chart.xAxis} />
              <YAxis />
              {tooltip}
              <Legend />
              {chart.series.map((series, index) => (
                <Bar
                  key={series.name}
                  dataKey={series.field}
                  fill={COLORS[index % COLORS.length]}
                  name={series.name}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
      case 'dual-axis-line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chart.xAxis} />
              <YAxis />
              {tooltip}
              <Legend />
              {chart.series.map((series, index) => (
                <Line
                  key={series.name}
                  type="monotone"
                  dataKey={series.field}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  name={series.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label={({ name, value, percent }) => 
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {tooltip}
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chart.xAxis} />
              <YAxis dataKey={chart.yAxis} />
              {tooltip}
              <Legend />
              {chart.series.map((series, index) => (
                <Scatter
                  key={series.name}
                  name={series.name}
                  data={chartData}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'heatmap':
        // Simplified heatmap - in a real app you might use a specialized heatmap library
        return (
          <div className="grid grid-cols-10 gap-1 h-64">
            {chartData.map((item, index) => {
              const value = Number(item[chart.series[0]?.field] || 0);
              const intensity = Math.min(value / 100, 1); // Normalize to 0-1
              
              return (
                <div
                  key={index}
                  className="aspect-square rounded-sm flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                    color: intensity > 0.5 ? 'white' : 'black'
                  }}
                  title={`${chart.xAxis}: ${item[chart.xAxis]}, ${chart.yAxis}: ${item[chart.yAxis]}, Value: ${value}`}
                >
                  {value.toFixed(0)}
                </div>
              );
            })}
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Chart type "{chart.type}" not supported
          </div>
        );
    }
  };

  if (charts.length === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {charts.map((chart) => (
        <Card key={chart.id} className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">{chart.title}</CardTitle>
            <CardDescription>
              {chart.type.charAt(0).toUpperCase() + chart.type.slice(1)} chart
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderChart(chart)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DynamicCharts;