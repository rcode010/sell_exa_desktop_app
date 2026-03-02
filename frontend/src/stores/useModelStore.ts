import { create } from "zustand";
import { AxiosError } from "axios";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { CompanyModel } from "../types/company";
import { ModelStore } from "../types/company";

export const useModelStore = create<ModelStore>((set, get) => ({
  // States
  models: [] as CompanyModel[],
  modelsCount: 0,
  loading: false,

  // Actions
  getModels: async (companyId: string) => {
    const hasData = get().models.length > 0;
    if (!hasData) set({ loading: true });

    try {
      const response = await axios.get(`/api/model/${companyId}/models`);
      const models = response.data.data;

      set({ models, modelsCount: models.length, loading: false });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error(err.response?.data?.message || "Failed to fetch models");

      set({ loading: false });
      return false;
    }
  },

  createModel: async (companyId: string, modelName: string) => {
    set({ loading: true });
    try {
      const response = await axios.post(`/api/model/${companyId}/models`, {
        modelName: modelName.trim(),
      });

      toast.success(response.data.message || "Model added successfully");

      await get().getModels(companyId);

      set({ loading: false });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error(err.response?.data?.message || "Failed to add model");

      set({ loading: false });
      return false;
    }
  },

  updateModel: async (companyId: string, modelId: string, newName: string) => {
    set({ loading: true });
    try {
      const response = await axios.patch(
        `/api/model/${companyId}/models/${modelId}`,
        {
          newName: newName.trim(),
        }
      );

      toast.success(response.data.message || "Model updated successfully");

      await get().getModels(companyId);

      set({ loading: false });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error(err.response?.data?.message || "Failed to update model");

      set({ loading: false });
      return false;
    }
  },

  deleteModel: async (companyId: string, modelId: string) => {
    set({ loading: true });
    try {
      const response = await axios.delete(
        `/api/model/${companyId}/models/${modelId}`
      );

      toast.success(response.data.message || "Model deleted successfully");

      await get().getModels(companyId);

      set({ loading: false });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error(err.response?.data?.message || "Failed to delete model");

      set({ loading: false });
      return false;
    }
  },
}));
