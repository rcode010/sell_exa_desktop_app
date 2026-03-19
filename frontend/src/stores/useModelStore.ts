import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AxiosError } from "axios";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { CompanyModel } from "../types/company";
import { ModelStore } from "../types/company";

export const useModelStore = create<ModelStore>()(
  persist(
    (set, get) => ({
      // States
      models: [] as CompanyModel[],
      modelsCount: 0,
      loading: false,
      isOffline: false,
      lastUpdated: null,

      // Actions
      getModels: async (companyId: string) => {
        const hasData = get().models.length > 0;
        if (!hasData) set({ loading: true });

        try {
          const response = await axios.get(`/api/model/${companyId}/models`);
          const models = response.data.data;

          set({
            models,
            modelsCount: models.length,
            loading: false,
            isOffline: false,
            lastUpdated: Date.now(),
          });
          return true;
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;

          console.log("Error: " + err.message);

          // If we have stale data, just set offline flag and don't toast
          if (get().models.length > 0) {
            set({ isOffline: true, loading: false });
          } else {
            toast.error(err.response?.data?.message || "Failed to fetch models");
            set({ loading: false });
          }

          return false;
        }
      },

      createModel: async (companyId: string, modelName: string) => {
        set({ loading: true });
        try {
          const response = await axios.post(`/api/model/${companyId}/models`, {
            modelName: modelName.trim(),
          });

          // Optimistic update: append the new model returned by the server
          const newModel = response.data.data as CompanyModel;
          set((state) => ({
            models: [...state.models, newModel],
            modelsCount: state.modelsCount + 1,
            loading: false,
          }));

          toast.success(response.data.message || "Model added successfully");
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

          // Optimistic update: swap the renamed model in-place
          set((state) => ({
            models: state.models.map((m) =>
              m._id === modelId ? { ...m, name: newName.trim() } : m
            ),
            loading: false,
          }));

          toast.success(response.data.message || "Model updated successfully");
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

          // Optimistic update: remove the deleted model from local state
          set((state) => ({
            models: state.models.filter((m) => m._id !== modelId),
            modelsCount: state.modelsCount - 1,
            loading: false,
          }));

          toast.success(response.data.message || "Model deleted successfully");
          return true;
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;

          console.log("Error: " + err.message);
          toast.error(err.response?.data?.message || "Failed to delete model");

          set({ loading: false });
          return false;
        }
      },

      hideModel: async (companyId: string, modelId: string) => {
        set({ loading: true });
        try {
          const response = await axios.patch(
            `/api/model/${companyId}/models/${modelId}/toggle`
          );

          // Optimistic update: use the toggled model returned by the server
          const updatedModel = response.data.data as CompanyModel;
          set((state) => ({
            models: state.models.map((m) =>
              m._id === modelId ? updatedModel : m
            ),
            loading: false,
          }));

          toast.success(response.data.message || "Model visibility updated");
          return true;
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;

          console.log("Error: " + err.message);
          toast.error(
            err.response?.data?.message || "Failed to update model visibility"
          );

          set({ loading: false });
          return false;
        }
      },
    }),
    {
      name: "sell-exa-models",
      partialize: (state) => ({
        models: state.models,
        modelsCount: state.modelsCount,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);