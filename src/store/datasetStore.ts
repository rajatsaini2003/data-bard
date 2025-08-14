import { create } from 'zustand';
import { Dataset, DataMapping, UploadProgress, PaginatedResponse, ListParams } from '@/types';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface DatasetState {
  datasets: Dataset[];
  currentDataset: Dataset | null;
  mapping: DataMapping | null;
  uploads: Record<string, UploadProgress>;
  isLoading: boolean;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  filters: ListParams;
}

interface DatasetActions {
  loadDatasets: (params?: ListParams) => Promise<void>;
  uploadDataset: (file: File, metadata: { name: string; description?: string; tags?: string[] }) => Promise<void>;
  getDataset: (id: number) => Promise<void>;
  deleteDataset: (id: number) => Promise<void>;
  bulkDeleteDatasets: (ids: number[]) => Promise<void>;
  getMapping: (id: number) => Promise<void>;
  updateMapping: (id: number, relationships: any[]) => Promise<void>;
  setFilters: (filters: Partial<ListParams>) => void;
  clearCurrentDataset: () => void;
}

type DatasetStore = DatasetState & DatasetActions;

export const useDatasetStore = create<DatasetStore>((set, get) => ({
  datasets: [],
  currentDataset: null,
  mapping: null,
  uploads: {},
  isLoading: false,
  pagination: {
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0
  },
  filters: {
    page: 1,
    page_size: 20
  },

  loadDatasets: async (params?: ListParams) => {
    console.log('loadDatasets started with params:', params);
    set({ isLoading: true });
    try {
      const queryParams = { ...get().filters, ...params };
      console.log('Calling apiService with params:', queryParams);
      const response = await apiService.datasets.list(queryParams);
      console.log('API response received:', response);
      
      set({
        datasets: response.items || [],
        pagination: {
          total: response.total,
          page: response.page,
          pageSize: response.page_size,
          totalPages: response.total_pages
        },
        filters: queryParams,
        isLoading: false
      });
      console.log('loadDatasets completed successfully');
    } catch (error: any) {
      console.error('loadDatasets failed:', error);
      set({ isLoading: false });
      toast({
        title: "Failed to load datasets",
        description: error.response?.data?.detail || "An error occurred",
        variant: "destructive"
      });
    }
  },

  uploadDataset: async (file: File, metadata) => {
    console.log('uploadDataset started for:', file.name);
    const uploadId = `${file.name}-${Date.now()}`;
    
    // Initialize upload progress
    set(state => {
      console.log('Setting upload state for:', uploadId);
      return {
        uploads: {
          ...state.uploads,
          [uploadId]: {
            file,
            progress: 0,
            status: 'uploading'
          }
        }
      };
    });

    try {
      console.log('Calling apiService.datasets.upload');
      const dataset = await apiService.datasets.upload(
        file,
        metadata,
        (progress) => {
          console.log('Upload progress:', progress, 'for file:', file.name);
          set(state => ({
            uploads: {
              ...state.uploads,
              [uploadId]: {
                ...state.uploads[uploadId],
                progress
              }
            }
          }));
        }
      );

      console.log('Upload successful, dataset:', dataset);
      // Update upload status to complete
      set(state => ({
        uploads: {
          ...state.uploads,
          [uploadId]: {
            ...state.uploads[uploadId],
            status: 'complete',
            dataset_id: dataset.id
          }
        }
      }));

      console.log('Reloading datasets...');
      // Reload datasets to include the new one
      await get().loadDatasets();
      console.log('Datasets reloaded successfully');

      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded successfully.`
      });

    } catch (error: any) {
      console.error('Upload failed with error:', error);
      set(state => ({
        uploads: {
          ...state.uploads,
          [uploadId]: {
            ...state.uploads[uploadId],
            status: 'error',
            error: error.response?.data?.detail || 'Upload failed'
          }
        }
      }));

      toast({
        title: "Upload failed",
        description: error.response?.data?.detail || "An error occurred during upload",
        variant: "destructive"
      });
    }
  },

  getDataset: async (id: number) => {
    set({ isLoading: true });
    try {
      const dataset = await apiService.datasets.get(id);
      set({ currentDataset: dataset, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      toast({
        title: "Failed to load dataset",
        description: error.response?.data?.detail || "An error occurred",
        variant: "destructive"
      });
    }
  },

  deleteDataset: async (id: number) => {
    try {
      await apiService.datasets.delete(id);
      
      // Remove from local state
      set(state => ({
        datasets: state.datasets.filter(d => d.id !== id),
        currentDataset: state.currentDataset?.id === id ? null : state.currentDataset
      }));

      toast({
        title: "Dataset deleted",
        description: "The dataset has been permanently deleted."
      });
    } catch (error: any) {
      toast({
        title: "Failed to delete dataset",
        description: error.response?.data?.detail || "An error occurred",
        variant: "destructive"
      });
    }
  },

  bulkDeleteDatasets: async (ids: number[]) => {
    try {
      await apiService.datasets.bulkDelete(ids);
      
      // Remove from local state
      set(state => ({
        datasets: state.datasets.filter(d => !ids.includes(d.id))
      }));

      toast({
        title: "Datasets deleted",
        description: `${ids.length} datasets have been deleted.`
      });
    } catch (error: any) {
      toast({
        title: "Failed to delete datasets",
        description: error.response?.data?.detail || "An error occurred",
        variant: "destructive"
      });
    }
  },

  getMapping: async (id: number) => {
    try {
      const mapping = await apiService.datasets.getMapping(id);
      set({ mapping });
    } catch (error: any) {
      toast({
        title: "Failed to load mapping",
        description: error.response?.data?.detail || "An error occurred",
        variant: "destructive"
      });
    }
  },

  updateMapping: async (id: number, relationships: any[]) => {
    try {
      const mapping = await apiService.datasets.updateMapping(id, relationships);
      set({ mapping });
      
      toast({
        title: "Mapping updated",
        description: "The data relationships have been updated."
      });
    } catch (error: any) {
      toast({
        title: "Failed to update mapping",
        description: error.response?.data?.detail || "An error occurred",
        variant: "destructive"
      });
    }
  },

  setFilters: (filters: Partial<ListParams>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearCurrentDataset: () => {
    set({ currentDataset: null, mapping: null });
  }
}));