import { create } from 'zustand';
import { Organization } from '@/types';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface OrganizationState {
  organization: Organization | null;
  isLoading: boolean;
  error: string | null;
}

interface OrganizationActions {
  getOrganization: () => Promise<void>;
  updateOrganization: (data: Partial<Organization>) => Promise<void>;
  updateSettings: (settings: Partial<Organization['settings']>) => Promise<void>;
  clearError: () => void;
}

type OrganizationStore = OrganizationState & OrganizationActions;

export const useOrganizationStore = create<OrganizationStore>((set, get) => ({
  organization: null,
  isLoading: false,
  error: null,

  getOrganization: async () => {
    set({ isLoading: true, error: null });
    try {
      const organization = await apiService.organization.get();
      set({ organization, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch organization';
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateOrganization: async (data: Partial<Organization>) => {
    set({ isLoading: true, error: null });
    try {
      const organization = await apiService.organization.update(data);
      set({ organization, isLoading: false });
      toast({
        title: "Organization updated",
        description: "Organization information has been updated successfully."
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to update organization';
      set({ error: errorMessage, isLoading: false });
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  },

  updateSettings: async (settings: Partial<Organization['settings']>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSettings = await apiService.organization.updateSettings(settings);
      const currentOrg = get().organization;
      if (currentOrg) {
        set({ 
          organization: { ...currentOrg, settings: updatedSettings },
          isLoading: false 
        });
      }
      toast({
        title: "Settings updated",
        description: "Organization settings have been updated successfully."
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to update settings';
      set({ error: errorMessage, isLoading: false });
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));