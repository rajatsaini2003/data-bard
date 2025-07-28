import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Filter,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { DataMapping, Relationship } from '@/types';
import { cn } from '@/lib/utils';

interface RelationshipVisualizationProps {
  mapping: DataMapping;
  onRelationshipUpdate?: (relationships: Relationship[]) => void;
  className?: string;
}

interface Node {
  id: string;
  table: string;
  x: number;
  y: number;
  connections: number;
}

interface Edge {
  id: string;
  from: string;
  to: string;
  relationship: Relationship;
}

export function RelationshipVisualization({ 
  mapping, 
  onRelationshipUpdate,
  className 
}: RelationshipVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);
  const [confidenceFilter, setConfidenceFilter] = useState([0]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!mapping?.relationships) return;

    // Extract unique tables
    const tables = new Set<string>();
    mapping.relationships.forEach(rel => {
      tables.add(rel.from_table);
      tables.add(rel.to_table);
    });

    // Create nodes
    const nodeArray = Array.from(tables).map((table, index) => {
      const connections = mapping.relationships.filter(
        rel => rel.from_table === table || rel.to_table === table
      ).length;

      // Simple circular layout
      const angle = (index * 2 * Math.PI) / tables.size;
      const radius = Math.min(250, Math.max(150, tables.size * 30));
      
      return {
        id: table,
        table,
        x: 300 + radius * Math.cos(angle),
        y: 250 + radius * Math.sin(angle),
        connections
      };
    });

    // Create edges
    const edgeArray = mapping.relationships
      .filter(rel => rel.confidence >= confidenceFilter[0] / 100)
      .map(rel => ({
        id: rel.id,
        from: rel.from_table,
        to: rel.to_table,
        relationship: rel
      }));

    setNodes(nodeArray);
    setEdges(edgeArray);
  }, [mapping, confidenceFilter]);

  const handleRelationshipAction = (relationshipId: string, action: 'confirm' | 'reject') => {
    if (!onRelationshipUpdate) return;

    const updatedRelationships = mapping.relationships.map(rel =>
      rel.id === relationshipId
        ? { ...rel, status: (action === 'confirm' ? 'confirmed' : 'rejected') as 'confirmed' | 'rejected' }
        : rel
    );

    onRelationshipUpdate(updatedRelationships);
  };

  const exportVisualization = () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = 'data-relationships.png';
      link.href = canvas.toDataURL();
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const getNodeFromId = (id: string) => nodes.find(n => n.id === id);

  const getRelationshipColor = (relationship: Relationship) => {
    if (relationship.status === 'confirmed') return '#22c55e';
    if (relationship.status === 'rejected') return '#ef4444';
    if (relationship.confidence > 0.8) return '#3b82f6';
    if (relationship.confidence > 0.6) return '#f59e0b';
    return '#6b7280';
  };

  const getRelationshipOpacity = (relationship: Relationship) => {
    if (selectedRelationship && selectedRelationship !== relationship.id) return 0.3;
    return relationship.status === 'rejected' ? 0.5 : 1;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Data Relationships</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setZoom(zoom * 1.2)}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setZoom(zoom * 0.8)}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={exportVisualization}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Confidence:</span>
            <div className="w-32">
              <Slider
                value={confidenceFilter}
                onValueChange={setConfidenceFilter}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {confidenceFilter[0]}%+
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Rejected</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>High Confidence</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Medium Confidence</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Visualization */}
      <Card className="p-4">
        <div className="relative overflow-hidden rounded-lg border" style={{ height: '500px' }}>
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`${-pan.x} ${-pan.y} ${600 / zoom} ${500 / zoom}`}
            className="bg-background/50"
          >
            {/* Edges */}
            {edges.map(edge => {
              const fromNode = getNodeFromId(edge.from);
              const toNode = getNodeFromId(edge.to);
              
              if (!fromNode || !toNode) return null;

              return (
                <g key={edge.id}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={getRelationshipColor(edge.relationship)}
                    strokeWidth={2}
                    strokeOpacity={getRelationshipOpacity(edge.relationship)}
                    className="cursor-pointer"
                    onClick={() => setSelectedRelationship(
                      selectedRelationship === edge.id ? null : edge.id
                    )}
                  />
                  {/* Confidence label */}
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2}
                    textAnchor="middle"
                    className="text-xs fill-current"
                    opacity={0.8}
                  >
                    {Math.round(edge.relationship.confidence * 100)}%
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map(node => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={20 + node.connections * 3}
                  fill="hsl(var(--primary))"
                  fillOpacity={0.8}
                  stroke="hsl(var(--primary-foreground))"
                  strokeWidth={2}
                  className="cursor-pointer"
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  className="text-sm font-medium fill-primary-foreground"
                >
                  {node.table}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </Card>

      {/* Relationship Details */}
      {selectedRelationship && (
        <Card className="p-4">
          {(() => {
            const relationship = mapping.relationships.find(r => r.id === selectedRelationship);
            if (!relationship) return null;

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Relationship Details</h4>
                  <Badge variant={
                    relationship.status === 'confirmed' ? 'default' :
                    relationship.status === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {relationship.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">From:</span>
                    <p className="font-medium">{relationship.from_table}.{relationship.from_column}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">To:</span>
                    <p className="font-medium">{relationship.to_table}.{relationship.to_column}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium">{relationship.relationship_type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Confidence:</span>
                    <p className="font-medium">{Math.round(relationship.confidence * 100)}%</p>
                  </div>
                </div>

                {relationship.status === 'detected' && onRelationshipUpdate && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleRelationshipAction(relationship.id, 'confirm')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRelationshipAction(relationship.id, 'reject')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            );
          })()}
        </Card>
      )}
    </div>
  );
}