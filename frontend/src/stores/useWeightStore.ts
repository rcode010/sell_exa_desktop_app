import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { Weight } from "../types/weight";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface WeightState {
    weights: Weight[];
    loading: boolean;
    getWeights: () => Promise<void>;
    createWeight: (data: Omit<Weight, "_id" | "createdAt" | "updatedAt">) => Promise<boolean>;
    updateWeight: (
        id: string,
        data: Partial<Omit<Weight, "_id" | "createdAt" | "updatedAt">>
    ) => Promise<boolean>;
    deleteWeight: (id: string) => Promise<boolean>;
}

export const useWeightStore = create<WeightState>((set, get) => ({
    weights: [],
    loading: false,

    getWeights: async () => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get("/api/weight/all");
            if (response.data.success) {
                set({ weights: response.data.data });
            } else {
                toast.error(response.data.message || "Failed to fetch weights");
            }
        } catch (e) {
            const error = e as AxiosError<{ message?: string }>;
            toast.error(
                error.response?.data?.message || "Failed to load weights"
            );
        } finally {
            set({ loading: false });
        }
    },

    createWeight: async (data) => {
        set({ loading: true });
        try {
            const response = await axiosInstance.post("/api/weight", data);
            if (response.data.success) {
                toast.success("Delivery price created successfully");
                // Refetch after create
                await get().getWeights();
                return true;
            }
            toast.error(response.data.message || "Failed to create delivery price");
            return false;
        } catch (e) {
            const error = e as AxiosError<{ message?: string }>;
            toast.error(
                error.response?.data?.message || "An error occurred while creating delivery price"
            );
            return false;
        } finally {
            set({ loading: false });
        }
    },

    updateWeight: async (id, data) => {
        set({ loading: true });
        try {
            const response = await axiosInstance.patch(`/api/weight?weightId=${id}`, data);
            if (response.data.success) {
                toast.success("Delivery price updated successfully");
                // Update local state directly to be snappy
                set((state) => ({
                    weights: state.weights.map((w) => (w._id === id ? { ...w, ...data } : w)),
                }));
                return true;
            }
            toast.error(response.data.message || "Failed to update delivery price");
            return false;
        } catch (e) {
            const error = e as AxiosError<{ message?: string }>;
            toast.error(
                error.response?.data?.message || "An error occurred while updating delivery price"
            );
            return false;
        } finally {
            set({ loading: false });
        }
    },

    deleteWeight: async (id) => {
        set({ loading: true });
        try {
            await axiosInstance.delete(`/api/weight?weightId=${id}`);
            toast.success("Delivery price deleted successfully");
            set((state) => ({
                weights: state.weights.filter((w) => w._id !== id),
            }));
            return true;
        } catch (e) {
            const error = e as AxiosError<{ message?: string }>;
            toast.error(
                error.response?.data?.message || "An error occurred while deleting delivery price"
            );
            return false;
        } finally {
            set({ loading: false });
        }
    },
}));
