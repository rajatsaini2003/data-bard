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
    medicalAnalysis: {
      title: "Medical Data Analysis (Your Backend Response)",
      json: {
        "template": "minimal-reports",
        "title": "Breast Cancer Diagnosis Dashboard",
        "data": [
          {
            "id": 842302,
            "diagnosis": "M",
            "radius_mean": 17.99,
            "texture_mean": 10.38,
            "perimeter_mean": 122.8,
            "area_mean": 1001.0,
            "smoothness_mean": 0.1184,
            "compactness_mean": 0.2776,
            "concavity_mean": 0.3001,
            "concave_points_mean": 0.1471,
            "symmetry_mean": 0.2419,
            "fractal_dimension_mean": 0.07871
          },
          {
            "id": 842517,
            "diagnosis": "M",
            "radius_mean": 20.57,
            "texture_mean": 17.77,
            "perimeter_mean": 132.9,
            "area_mean": 1326.0,
            "smoothness_mean": 0.08474,
            "compactness_mean": 0.07864,
            "concavity_mean": 0.0869,
            "concave_points_mean": 0.07017,
            "symmetry_mean": 0.1812,
            "fractal_dimension_mean": 0.05667
          },
          {
            "id": 8510426,
            "diagnosis": "B",
            "radius_mean": 13.54,
            "texture_mean": 14.36,
            "perimeter_mean": 87.46,
            "area_mean": 566.3,
            "smoothness_mean": 0.09779,
            "compactness_mean": 0.08129,
            "concavity_mean": 0.06664,
            "concave_points_mean": 0.04781,
            "symmetry_mean": 0.1885,
            "fractal_dimension_mean": 0.05766
          },
          {
            "id": 8510653,
            "diagnosis": "B",
            "radius_mean": 13.08,
            "texture_mean": 15.71,
            "perimeter_mean": 85.63,
            "area_mean": 520.0,
            "smoothness_mean": 0.1075,
            "compactness_mean": 0.127,
            "concavity_mean": 0.04568,
            "concave_points_mean": 0.0311,
            "symmetry_mean": 0.1967,
            "fractal_dimension_mean": 0.06811
          }
        ],
        "filters": [
          {
            "field": "diagnosis",
            "type": "dropdown",
            "options": ["All", "M", "B"],
            "label": "Diagnosis Type (M=Malignant, B=Benign)"
          }
        ],
        "cards": [
          {
            "id": "card-1",
            "title": "Total Records",
            "valueField": "id",
            "aggregation": "count",
            "format": "number"
          },
          {
            "id": "card-2",
            "title": "Average Radius",
            "valueField": "radius_mean",
            "aggregation": "avg",
            "format": "decimal"
          },
          {
            "id": "card-3",
            "title": "Average Area",
            "valueField": "area_mean",
            "aggregation": "avg",
            "format": "decimal"
          }
        ],
        "charts": [
          {
            "id": "chart-1",
            "type": "bar",
            "title": "Average Measurements by Diagnosis",
            "xAxis": "diagnosis",
            "yAxis": "radius_mean",
            "series": [
              {
                "name": "Radius Mean",
                "field": "radius_mean",
                "type": "bar"
              }
            ]
          },
          {
            "id": "chart-2",
            "type": "pie",
            "title": "Diagnosis Distribution",
            "categoryField": "diagnosis",
            "field": "id"
          },
          {
            "id": "chart-3",
            "type": "line",
            "title": "Texture vs Radius Relationship",
            "xAxis": "texture_mean",
            "yAxis": "radius_mean",
            "series": [
              {
                "name": "Texture vs Radius",
                "field": "radius_mean",
                "type": "line"
              }
            ]
          }
        ],
        "tables": [
          {
            "id": "table-1",
            "title": "Medical Data Analysis",
            "columns": [
              {
                "field": "id",
                "header": "Patient ID",
                "sortable": true
              },
              {
                "field": "diagnosis",
                "header": "Diagnosis",
                "sortable": true
              },
              {
                "field": "radius_mean",
                "header": "Radius Mean",
                "format": "decimal",
                "sortable": true
              },
              {
                "field": "texture_mean",
                "header": "Texture Mean",
                "format": "decimal",
                "sortable": true
              },
              {
                "field": "area_mean",
                "header": "Area Mean",
                "format": "decimal",
                "sortable": true
              },
              {
                "field": "smoothness_mean",
                "header": "Smoothness Mean",
                "format": "decimal",
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
    realMovieData: {
      title: "Real Movie Dataset (From Your Backend)",
      json: {
        "template": "minimal-reports",
        "title": "Movies Dataset Dashboard",
        "data": [
          {
            "unnamed:_0": 0,
            "moive_name": " Leave the World Behind",
            "rating": 6.5,
            "votes": 90000.0,
            "meta_score": 67.0,
            "genre": "Drama, Mystery, Thriller",
            "pg_rating": "R",
            "year": 2023,
            "duration": "2h 18m",
            "cast": "Julia Roberts, Mahershala Ali, Ethan Hawke, Myha'la",
            "director": "Sam Esmail"
          },
          {
            "unnamed:_0": 1,
            "moive_name": " Wonka",
            "rating": 7.4,
            "votes": 24000.0,
            "meta_score": 66.0,
            "genre": "Adventure, Comedy, Family",
            "pg_rating": "PG",
            "year": 2023,
            "duration": "1h 56m",
            "cast": "Timothée Chalamet, Gustave Die, Murray McArthur, Paul G. Raymond",
            "director": "Paul King"
          },
          {
            "unnamed:_0": 2,
            "moive_name": " Poor Things",
            "rating": 8.5,
            "votes": 6700.0,
            "meta_score": 86.0,
            "genre": "Comedy, Drama, Romance",
            "pg_rating": "R",
            "year": 2023,
            "duration": "2h 21m",
            "cast": "Emma Stone, Mark Ruffalo, Willem Dafoe, Ramy Youssef",
            "director": "Yorgos Lanthimos"
          },
          {
            "unnamed:_0": 3,
            "moive_name": " Killers of the Flower Moon",
            "rating": 7.8,
            "votes": 128000.0,
            "meta_score": 89.0,
            "genre": "Crime, Drama, History",
            "pg_rating": "R",
            "year": 2023,
            "duration": "3h 26m",
            "cast": "Leonardo DiCaprio, Robert De Niro, Lily Gladstone, Jesse Plemons",
            "director": "Martin Scorsese"
          }
        ]
      }
    },
    movieAnalysis: {
      title: "Movies Dataset Analysis (Fixed Structure)",
      json: {
        "template": "minimal-reports",
        "title": "Movies Dataset Dashboard",
        "data": [
          {
            "unnamed:_0": 0,
            "moive_name": " Leave the World Behind",
            "rating": 6.5,
            "votes": 90000.0,
            "meta_score": 67.0,
            "genre": "Drama, Mystery, Thriller",
            "pg_rating": "R",
            "year": 2023,
            "duration": "2h 18m",
            "cast": "Julia Roberts, Mahershala Ali, Ethan Hawke, Myha'la",
            "director": "Sam Esmail"
          },
          {
            "unnamed:_0": 1,
            "moive_name": " Wonka",
            "rating": 7.4,
            "votes": 85000.0,
            "meta_score": 73.0,
            "genre": "Adventure, Comedy, Family",
            "pg_rating": "PG",
            "year": 2023,
            "duration": "1h 56m",
            "cast": "Timothée Chalamet, Calah Lane, Keegan-Michael Key",
            "director": "Paul King"
          },
          {
            "unnamed:_0": 2,
            "moive_name": " Poor Things",
            "rating": 8.5,
            "votes": 95000.0,
            "meta_score": 88.0,
            "genre": "Comedy, Drama, Romance",
            "pg_rating": "R",
            "year": 2023,
            "duration": "2h 21m",
            "cast": "Emma Stone, Mark Ruffalo, Willem Dafoe",
            "director": "Yorgos Lanthimos"
          }
        ],
        "filters": [
          {
            "field": "genre",
            "type": "dropdown",
            "options": ["Drama, Mystery, Thriller", "Adventure, Comedy, Family", "Comedy, Drama, Romance"],
            "label": "Genre Filter"
          },
          {
            "field": "year",
            "type": "dropdown",
            "options": ["2023", "2022", "2021"],
            "label": "Year"
          },
          {
            "field": "pg_rating",
            "type": "dropdown",
            "options": ["R", "PG", "PG-13", "G"],
            "label": "Rating"
          }
        ],
        "cards": [
          {
            "id": "card-1",
            "title": "Average Rating",
            "valueField": "rating",
            "aggregation": "avg",
            "format": "decimal"
          },
          {
            "id": "card-2",
            "title": "Total Movies",
            "valueField": "moive_name",
            "aggregation": "count",
            "format": "number"
          },
          {
            "id": "card-3",
            "title": "Average Meta Score",
            "valueField": "meta_score",
            "aggregation": "avg",
            "format": "decimal"
          },
          {
            "id": "card-4",
            "title": "Total Votes",
            "valueField": "votes",
            "aggregation": "sum",
            "format": "number"
          }
        ],
        "charts": [
          {
            "id": "chart-1",
            "type": "bar",
            "title": "Movies by Genre",
            "xAxis": "genre",
            "yAxis": "rating",
            "series": [
              {
                "name": "Average Rating",
                "field": "rating",
                "type": "bar"
              }
            ]
          },
          {
            "id": "chart-2",
            "type": "pie",
            "title": "Movies Distribution by Rating",
            "categoryField": "pg_rating",
            "field": "votes"
          },
          {
            "id": "chart-3",
            "type": "line",
            "title": "Rating vs Meta Score",
            "xAxis": "rating",
            "yAxis": "meta_score",
            "series": [
              {
                "name": "Meta Score",
                "field": "meta_score",
                "type": "line"
              }
            ]
          }
        ],
        "tables": [
          {
            "id": "table-1",
            "title": "Movie Data",
            "columns": [
              {
                "field": "moive_name",
                "header": "Movie Name",
                "sortable": true
              },
              {
                "field": "rating",
                "header": "Rating",
                "sortable": true,
                "format": "decimal"
              },
              {
                "field": "genre",
                "header": "Genre",
                "sortable": true
              },
              {
                "field": "year",
                "header": "Year",
                "sortable": true
              },
              {
                "field": "director",
                "header": "Director",
                "sortable": true
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

  const fixDashboardConfiguration = (parsedData: Record<string, unknown>) => {
    if (!parsedData.data || !Array.isArray(parsedData.data) || parsedData.data.length === 0) {
      return parsedData;
    }

    const sampleRecord = parsedData.data[0];
    const availableFields = Object.keys(sampleRecord);

    // Create default cards if missing or empty
    if (!parsedData.cards || !Array.isArray(parsedData.cards) || parsedData.cards.length === 0) {
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
          aggregation: 'count',
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
        let aggregation = 'avg';
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

      parsedData.cards = defaultCards;
    }

    // Fix existing cards that reference non-existent fields
    if (parsedData.cards && Array.isArray(parsedData.cards)) {
      parsedData.cards = parsedData.cards.map((card: Record<string, unknown>) => {
        if (card.valueField && !availableFields.includes(card.valueField as string)) {
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
            aggregation: 'count',
            title: card.title || 'Count'
          };
        }
        return card;
      });
    }

    // Fix charts that reference non-existent fields
    if (parsedData.charts && Array.isArray(parsedData.charts)) {
      parsedData.charts = parsedData.charts.map((chart: Record<string, unknown>) => {
        const updatedChart = { ...chart };

        // If chart has its own data, use that for field validation, otherwise use main data
        const chartData = (chart.data && Array.isArray(chart.data) && chart.data.length > 0) 
          ? chart.data[0] 
          : sampleRecord;
        const chartFields = Object.keys(chartData);

        // Fix xAxis field
        if (chart.xAxis && !chartFields.includes(chart.xAxis as string)) {
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
        if (chart.yAxis && !chartFields.includes(chart.yAxis as string)) {
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
        if (chart.type === 'pie' && chart.categoryField && !chartFields.includes(chart.categoryField as string)) {
          const categoricalField = chartFields.find(field => 
            typeof chartData[field] === 'string'
          );
          if (categoricalField) {
            updatedChart.categoryField = categoricalField;
          }
        }

        // Fix field for pie charts
        if (chart.type === 'pie' && chart.field && !chartFields.includes(chart.field as string)) {
          const numericField = chartFields.find(field => 
            typeof chartData[field] === 'number'
          );
          if (numericField) {
            updatedChart.field = numericField;
          }
        }

        // Fix series fields
        if (chart.series && Array.isArray(chart.series)) {
          updatedChart.series = chart.series.map((series: Record<string, unknown>) => {
            if (series.field && !availableFields.includes(series.field as string)) {
              const numericField = availableFields.find(field => 
                typeof sampleRecord[field] === 'number' && field !== 'id'
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
    if (parsedData.tables && Array.isArray(parsedData.tables)) {
      parsedData.tables = parsedData.tables.map((table: Record<string, unknown>) => {
        if (table.columns && Array.isArray(table.columns)) {
          const validColumns = table.columns.filter((col: Record<string, unknown>) => 
            availableFields.includes(col.field as string)
          );
          
          // If no valid columns, create some from available fields
          if (validColumns.length === 0) {
            const defaultColumns = availableFields.slice(0, 5).map(field => ({
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

    // Fix filters with complex structure and nested data
    if (parsedData.filters && Array.isArray(parsedData.filters)) {
      parsedData.filters = parsedData.filters.map((filter: Record<string, unknown>) => {
        const fixedFilter = { ...filter };
        
        // If filter has its own data array with options, extract them
        if (filter.data && Array.isArray(filter.data) && filter.data.length > 0) {
          const filterOptions = filter.data.map((item: Record<string, unknown>) => {
            const field = filter.target_field || filter.field;
            return item[field as string] || item[Object.keys(item)[0]];
          }).filter(Boolean);
          
          fixedFilter.options = [...new Set(filterOptions)].slice(0, 20); // Limit to 20 options
        }
        
        // Ensure the filter field exists in main data
        if (filter.field && !availableFields.includes(filter.field as string)) {
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

    return parsedData;
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
      const fixedData = fixDashboardConfiguration(parsedData);
      
      setDashboardData(fixedData as unknown as DashboardData);
      setFilteredData((fixedData.data as Record<string, unknown>[]) || []);
      setError(null);
      
      toast({
        title: "Dashboard Rendered",
        description: "Your JSON has been successfully parsed and rendered. Configuration was automatically adjusted to match your data structure.",
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

  const loadSampleDashboard = async () => {
    try {
      // Import the sample dashboard JSON file
      const sampleDashboard = await import('@/utils/sampledashboard.json');
      const jsonString = JSON.stringify(sampleDashboard.default || sampleDashboard, null, 2);
      setJsonInput(jsonString);
      
      toast({
        title: "Sample Dashboard Loaded",
        description: "Full movie dataset with dashboard configuration loaded from sampledashboard.json",
      });
    } catch (err) {
      toast({
        title: "Load Failed",
        description: "Failed to load sampledashboard.json file.",
        variant: "destructive"
      });
    }
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