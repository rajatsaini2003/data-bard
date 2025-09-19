import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, AlertCircle, CheckCircle, Clock, Database, Key, Link } from 'lucide-react';
import { apiService } from '@/services/api';
import { OrganizationMapping } from '@/types';
import { toast } from '@/hooks/use-toast';

const MappingDisplay = () => {
  const [mapping, setMapping] = useState<OrganizationMapping | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMapping = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const mappingData = await apiService.mappings.get();
      setMapping(mappingData);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { detail?: string } } };
      if (error.response?.status === 404) {
        setMapping(null);
        setError('No mapping found for your organization. Generate one to get started.');
      } else {
        setError(error.response?.data?.detail || 'Failed to load mapping');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateMapping = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      const response = await apiService.mappings.generate();
      
      if (response.status === 'started') {
        toast({
          title: "Mapping Generation Started",
          description: "Your organization mapping is being generated. This may take a few moments.",
        });
        
        // Poll for completion
        setTimeout(() => {
          fetchMapping();
        }, 5000);
      } else if (response.status === 'completed') {
        toast({
          title: "Mapping Generated",
          description: "Your organization mapping has been successfully generated.",
        });
        fetchMapping();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      const errorMessage = error.response?.data?.detail || 'Failed to generate mapping';
      setError(errorMessage);
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchMapping();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Organization Data Mapping</CardTitle>
          <CardDescription>
            AI-generated data relationships and structure mapping
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Organization Data Mapping
              {mapping && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ready
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              AI-generated data relationships and structure mapping using ADEL Lite
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMapping}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              onClick={generateMapping}
              disabled={isGenerating}
              size="sm"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                'Generate Mapping'
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mapping && (
          <div className="space-y-6">
            {/* Mapping Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Database className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{mapping.table_count}</div>
                <div className="text-sm text-muted-foreground">Tables</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Key className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{mapping.primary_keys.length}</div>
                <div className="text-sm text-muted-foreground">Primary Keys</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Link className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <div className="text-2xl font-bold">{mapping.foreign_keys.length}</div>
                <div className="text-sm text-muted-foreground">Foreign Keys</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{(mapping.confidence_score * 100).toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Confidence</div>
              </div>
            </div>

            {/* Mapping Details */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="primary-keys">Primary Keys</TabsTrigger>
                <TabsTrigger value="foreign-keys">Foreign Keys</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Version:</span> {mapping.version}
                  </div>
                  <div>
                    <span className="font-medium">Generated:</span>{' '}
                    {new Date(mapping.generated_at).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>{' '}
                    {new Date(mapping.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Confidence Score:</span>{' '}
                    {(mapping.confidence_score * 100).toFixed(1)}%
                  </div>
                </div>
                
                {mapping.composite_keys.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Composite Keys:</h4>
                    <div className="space-y-2">
                      {mapping.composite_keys.map((key, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded border">
                          <div className="font-medium">{key.table}</div>
                          <div className="text-sm text-gray-600">
                            Columns: {key.columns.join(', ')} (Confidence: {(key.confidence * 100).toFixed(0)}%)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="primary-keys">
                {mapping.primary_keys.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Table</TableHead>
                        <TableHead>Column</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Uniqueness</TableHead>
                        <TableHead>Null Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mapping.primary_keys.map((key, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{key.table}</TableCell>
                          <TableCell>{key.column}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {(key.confidence * 100).toFixed(0)}%
                            </Badge>
                          </TableCell>
                          <TableCell>{(key.uniqueness_ratio * 100).toFixed(1)}%</TableCell>
                          <TableCell>{key.null_count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No primary keys detected
                  </div>
                )}
              </TabsContent>

              <TabsContent value="foreign-keys">
                {mapping.foreign_keys.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source Table</TableHead>
                        <TableHead>Source Column</TableHead>
                        <TableHead>Target Table</TableHead>
                        <TableHead>Target Column</TableHead>
                        <TableHead>Confidence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mapping.foreign_keys.map((key, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{key.source_table}</TableCell>
                          <TableCell>{key.source_column}</TableCell>
                          <TableCell className="font-medium">{key.target_table}</TableCell>
                          <TableCell>{key.target_column}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {(key.confidence * 100).toFixed(0)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No foreign key relationships detected
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!mapping && !error && (
          <div className="text-center py-8">
            <Database className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Mapping Available</h3>
            <p className="text-sm text-muted-foreground mb-4">
              No mapping has been generated yet for your organization.
            </p>
            <Button onClick={generateMapping} disabled={isGenerating}>
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Generate First Mapping
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MappingDisplay;