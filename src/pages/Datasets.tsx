import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navigation from "@/components/Navigation";
import MappingDisplay from "@/components/datasets/MappingDisplay";
import { useDatasetStore } from "@/store/datasetStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { 
  Database, 
  Plus, 
  Upload, 
  FileText, 
  Eye,
  Share2,
  Calendar,
  User,
  Filter,
  Search,
  MoreHorizontal,
  Trash2,
  Settings
} from "lucide-react";

const Datasets = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  const [datasetSchema, setDatasetSchema] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const { 
    datasets, 
    isLoading, 
    loadDatasets, 
    uploadDataset, 
    deleteDataset,
    pagination 
  } = useDatasetStore();
  
  const { user } = useAuthStore();
  const isAdmin = user?.is_admin || false;

  useEffect(() => {
    loadDatasets();
  }, [loadDatasets]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    try {
      for (const file of files) {
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          await uploadDataset(file, {
            name: file.name.replace('.csv', ''),
            description: `Uploaded dataset: ${file.name}`,
            tags: ['uploaded']
          });
        } else {
          toast({
            title: "File type not supported",
            description: "Please upload CSV files only",
            variant: "destructive"
          });
        }
      }
      
      if (event.target) {
        event.target.value = '';
      }
      setShowUploadDialog(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading files",
        variant: "destructive"
      });
    }
  };

  const viewDatasetSchema = async (datasetId: number) => {
    try {
      const schemaData = await apiService.datasets.getSchema(datasetId);
      const dataset = datasets?.find(d => d.id === datasetId);
      
      // Get the first table schema (assuming single table per dataset for now)
      const firstTableKey = Object.keys(schemaData.schemas)[0];
      const tableSchema = schemaData.schemas[firstTableKey];
      
      setDatasetSchema({
        tableName: tableSchema.table_name,
        columns: tableSchema.columns.sort((a, b) => a.position - b.position),
        rowCount: dataset?.row_count || 0,
        size: formatBytes(dataset?.file_size || 0)
      });
      setSelectedDataset(dataset);
    } catch (error) {
      toast({
        title: "Failed to load schema",
        description: "Could not retrieve dataset schema",
        variant: "destructive"
      });
    }
  };

  const createMapping = async () => {
    if (!datasets || datasets.length < 2) {
      toast({
        title: "Insufficient datasets",
        description: "You need at least 2 datasets to create mappings",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get mapping for the first dataset as an example
      const firstDataset = datasets[0];
      await apiService.datasets.getMapping(firstDataset.id);
      toast({
        title: "Mapping loaded successfully",
        description: "Dataset relationships have been loaded"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dataset mapping",
        variant: "destructive"
      });
    }
  };

  const filteredDatasets = datasets?.filter(dataset =>
    dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dataset.description && dataset.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  // Calculate stats from actual data
  const totalRecords = datasets?.reduce((sum, dataset) => sum + (dataset.row_count || 0), 0) || 0;
  const totalStorage = datasets?.reduce((sum, dataset) => sum + (dataset.file_size || 0), 0) || 0;
  const lastDataset = datasets?.reduce((latest, current) => 
    new Date(current.created_at) > new Date(latest?.created_at || '') ? current : latest, 
    datasets[0]
  );

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const stats = [
    { label: "Total Datasets", value: datasets?.length || 0, icon: Database },
    { label: "Total Records", value: formatNumber(totalRecords), icon: FileText },
    { label: "Storage Used", value: formatBytes(totalStorage), icon: Upload },
    { label: "Last Updated", value: lastDataset ? getRelativeTime(lastDataset.created_at) : 'No data', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Datasets
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your uploaded datasets and create data relationships
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {datasets && datasets.length > 1 && (
              <Button variant="outline" onClick={createMapping}>
                <Share2 className="h-4 w-4 mr-2" />
                Create Mapping
              </Button>
            )}
            
            {isAdmin && (
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Dataset
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload New Dataset</DialogTitle>
                    <DialogDescription>
                      Upload a CSV file to add a new dataset to your collection
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div 
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Click to upload files</p>
                      <p className="text-sm text-muted-foreground">Supports CSV files</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Organization Mapping */}
        <div className="mb-8">
          <MappingDisplay />
        </div>

        {/* Search and Filters */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search datasets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Datasets Table */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Your Datasets</CardTitle>
            <CardDescription>
              {datasets?.length || 0} datasets available
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDatasets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center gap-4">
                          <Database className="h-12 w-12 text-muted-foreground" />
                          <div>
                            <p className="text-lg font-medium">No datasets found</p>
                            <p className="text-sm text-muted-foreground">
                              {isAdmin ? "Upload your first dataset to get started" : "No datasets have been uploaded yet"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDatasets.map((dataset) => (
                      <TableRow key={dataset.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{dataset.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {dataset.description || "No description"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(dataset.created_at).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewDatasetSchema(dataset.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Schema
                            </Button>
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteDataset(dataset.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Dataset Schema Dialog */}
        {selectedDataset && datasetSchema && (
          <Dialog open={!!selectedDataset} onOpenChange={() => {
            setSelectedDataset(null);
            setDatasetSchema(null);
          }}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Dataset Schema: {selectedDataset.name}</DialogTitle>
                <DialogDescription>
                  Column definitions and data types for this dataset
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Rows:</span> {datasetSchema.rowCount}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span> {datasetSchema.size}
                  </div>
                  <div>
                    <span className="font-medium">Columns:</span> {datasetSchema.columns.length}
                  </div>
                </div>
                
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background">
                      <TableRow>
                        <TableHead>Position</TableHead>
                        <TableHead>Column</TableHead>
                        <TableHead>Data Type</TableHead>
                        <TableHead>Pandas Type</TableHead>
                        <TableHead>Nullable</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {datasetSchema.columns.map((column, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{column.position}</TableCell>
                          <TableCell className="font-medium">{column.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{column.dtype}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{column.pandas_dtype}</Badge>
                          </TableCell>
                          <TableCell>
                            {column.nullable ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Yes</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">No</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Datasets;