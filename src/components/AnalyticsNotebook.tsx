import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, 
  Plus, 
  Code2, 
  BarChart3, 
  Database, 
  Save,
  Share2,
  MoreVertical
} from "lucide-react";

interface NotebookCell {
  id: string;
  type: 'query' | 'chart' | 'insight';
  content: string;
  output?: any;
  isRunning?: boolean;
}

const AnalyticsNotebook = () => {
  const [cells, setCells] = useState<NotebookCell[]>([
    {
      id: '1',
      type: 'query',
      content: 'Show me revenue trends for the last 6 months',
      output: {
        type: 'chart',
        chartType: 'line',
        data: [
          { month: 'Jan', revenue: 45000 },
          { month: 'Feb', revenue: 52000 },
          { month: 'Mar', revenue: 48000 },
          { month: 'Apr', revenue: 61000 },
          { month: 'May', revenue: 55000 },
          { month: 'Jun', revenue: 67000 }
        ]
      }
    }
  ]);

  const addCell = () => {
    const newCell: NotebookCell = {
      id: Date.now().toString(),
      type: 'query',
      content: '',
    };
    setCells([...cells, newCell]);
  };

  const runCell = (cellId: string) => {
    setCells(cells.map(cell => 
      cell.id === cellId 
        ? { ...cell, isRunning: true }
        : cell
    ));

    // Simulate analysis
    setTimeout(() => {
      setCells(cells.map(cell => 
        cell.id === cellId 
          ? { 
              ...cell, 
              isRunning: false,
              output: {
                type: 'insight',
                insights: [
                  'Revenue shows an upward trend with 15% growth',
                  'Peak performance in June with $67,000',
                  'Consistent month-over-month improvement'
                ]
              }
            }
          : cell
      ));
    }, 2000);
  };

  const updateCell = (cellId: string, content: string) => {
    setCells(cells.map(cell =>
      cell.id === cellId
        ? { ...cell, content }
        : cell
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Analytics Notebook</h2>
            <p className="text-sm text-muted-foreground">Interactive data analysis workspace</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {cells.map((cell, index) => (
            <Card key={cell.id} className="p-4 bg-background/50 border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    Cell {index + 1}
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      cell.type === 'query' ? 'bg-primary/10 text-primary' :
                      cell.type === 'chart' ? 'bg-accent-teal/10 text-accent-teal' :
                      'bg-accent-purple/10 text-accent-purple'
                    }`}
                  >
                    {cell.type === 'query' ? <Database className="h-3 w-3 mr-1" /> :
                     cell.type === 'chart' ? <BarChart3 className="h-3 w-3 mr-1" /> :
                     <Code2 className="h-3 w-3 mr-1" />}
                    {cell.type}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => runCell(cell.id)}
                  disabled={cell.isRunning}
                >
                  {cell.isRunning ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Textarea
                value={cell.content}
                onChange={(e) => updateCell(cell.id, e.target.value)}
                placeholder="Enter your query or analysis..."
                className="mb-3 bg-background/50 border-border"
                rows={2}
              />

              {cell.output && (
                <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border">
                  {cell.output.type === 'chart' && (
                    <div className="h-40 bg-background/50 rounded flex items-center justify-center">
                      <BarChart3 className="h-16 w-16 text-primary" />
                    </div>
                  )}
                  {cell.output.type === 'insight' && (
                    <div className="space-y-2">
                      {cell.output.insights.map((insight: string, i: number) => (
                        <div key={i} className="flex items-start space-x-2">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <p className="text-sm">{insight}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}

          <Button 
            variant="outline" 
            onClick={addCell}
            className="w-full border-dashed hover:border-primary/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Cell
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsNotebook;