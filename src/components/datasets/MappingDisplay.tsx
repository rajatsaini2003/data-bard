import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
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
        
        // Poll for completion (optional - you might want to use websockets or server-sent events)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'generating':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatMappingData = (data: Record<string, unknown>) => {
    // This is a simplified display - you might want to create a more sophisticated visualization
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return 'Invalid mapping data';
    }
  };

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
              Organization Data Mapping
              {mapping && (
                <Badge variant="secondary" className={getStatusColor(mapping.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(mapping.status)}
                    {mapping.status}
                  </div>
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
              disabled={isGenerating || mapping?.status === 'generating'}
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {new Date(mapping.created_at).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Updated:</span>{' '}
                {new Date(mapping.updated_at).toLocaleDateString()}
              </div>
            </div>

            {mapping.status === 'ready' && mapping.mapping_data && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-2">Mapping Data:</h4>
                <pre className="text-xs overflow-auto max-h-64 bg-white p-3 rounded border">
                  {formatMappingData(mapping.mapping_data)}
                </pre>
              </div>
            )}

            {mapping.status === 'generating' && (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-muted-foreground">
                  Generating mapping... This may take a few minutes.
                </p>
              </div>
            )}

            {mapping.status === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  There was an error generating the mapping. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {!mapping && !error && (
          <div className="text-center py-8">
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