import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useDatasetStore } from '@/store/datasetStore';
import { cn } from '@/lib/utils';

interface DatasetUploadProps {
  onUploadComplete?: () => void;
}

export function DatasetUpload({ onUploadComplete }: DatasetUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState({
    name: '',
    description: '',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  
  const { uploadDataset, uploads } = useDatasetStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    
    // Auto-populate name from first file if empty
    if (!metadata.name && acceptedFiles.length > 0) {
      const name = acceptedFiles[0].name.replace(/\.[^/.]+$/, "");
      setMetadata(prev => ({ ...prev, name }));
    }
  }, [metadata.name]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleUpload = async () => {
    if (files.length === 0 || !metadata.name.trim()) return;

    try {
      for (const file of files) {
        await uploadDataset(file, {
          name: `${metadata.name}${files.length > 1 ? ` - ${file.name}` : ''}`,
          description: metadata.description || undefined,
          tags: metadata.tags.length > 0 ? metadata.tags : undefined
        });
      }
      
      // Reset form
      setFiles([]);
      setMetadata({ name: '', description: '', tags: [] });
      setTagInput('');
      
      onUploadComplete?.();
    } catch (error) {
      // Error handling is done in the store
    }
  };

  const getUploadStatus = (fileName: string) => {
    const upload = Object.values(uploads).find(u => u.file.name === fileName);
    return upload;
  };

  const canUpload = files.length > 0 && metadata.name.trim();

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Upload Datasets</h3>
        <p className="text-sm text-muted-foreground">
          Upload CSV, XLS, or XLSX files to analyze data relationships
        </p>
      </div>

      {/* File Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          files.length > 0 && "border-primary/30"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? "Drop files here..." : "Drag & drop files here"}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          or click to browse files
        </p>
        <Badge variant="secondary">CSV, XLS, XLSX up to 100MB</Badge>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Files</Label>
          <div className="space-y-2">
            {files.map((file, index) => {
              const upload = getUploadStatus(file.name);
              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {upload && (
                      <div className="mt-2">
                        {upload.status === 'uploading' && (
                          <div className="space-y-1">
                            <Progress value={upload.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              Uploading... {upload.progress}%
                            </p>
                          </div>
                        )}
                        {upload.status === 'complete' && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs">Upload complete</span>
                          </div>
                        )}
                        {upload.status === 'error' && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-xs">{upload.error}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {!upload && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metadata Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Dataset Name *</Label>
          <Input
            id="name"
            value={metadata.name}
            onChange={(e) => setMetadata(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter dataset name"
            className="bg-background/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={metadata.description}
            onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Optional description for this dataset"
            className="bg-background/50"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add tags (press Enter)"
              className="bg-background/50"
            />
            <Button type="button" onClick={addTag} variant="outline">
              Add
            </Button>
          </div>
          {metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {metadata.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleUpload}
          disabled={!canUpload}
          variant="hero"
          className="min-w-32"
        >
          Upload {files.length > 1 ? `${files.length} Files` : 'File'}
        </Button>
      </div>
    </Card>
  );
}