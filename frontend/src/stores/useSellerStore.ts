import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { Seller, SellerStore } from "../types/seller";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useSellerStore = create<SellerStore>((set) => ({
  sellers: [],
  loading: false,

  getAllSellers: async () => {
    try {
      set({ loading: true });

      // Token is automatically added by interceptor inside axios.ts | no need to pass it manually!
      const response = await axiosInstance.get("/api/seller/some", {
        headers: {
          limit: 20,
          page: 1,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch sellers");
      }

      console.log("sellers: ", response.data.data);

      set({ sellers: response.data.data, loading: false });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error(err.response?.data?.message || "Something went wrong");

      set({ loading: false });
    }
  },

  createSeller: async (seller: Seller) => {
    try {
      set({ loading: true });

      // Token is automatically added by interceptor
      const response = await axiosInstance.post("/api/seller/create", seller);

      if (response.status !== 201) {
        throw new Error("Failed to create seller");
      }

      // Update sellers state after creation
      set((state) => ({
        sellers: [...state.sellers, response.data.data],
        loading: false,
      }));

      toast.success("Seller created successfully!");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error(err.response?.data?.message || "Something went wrong");

      set({ loading: false });
    }
  },

  deleteSeller: async (id: string) => {
    try {
      set({ loading: true });

      // Token is automatically added by interceptor
      const response = await axiosInstance.delete(`/api/seller/${id}`);

      if (response.status !== 200) {
        throw new Error("Failed to delete seller");
      }

      // Update sellers state after deletion
      set((state) => ({
        sellers: state.sellers.filter((seller) => seller._id != id),
        loading: false,
      }));

      toast.success("Seller deleted successfully!");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error(err.response?.data?.message || "Something went wrong");

      set({ loading: false });
    }
  },

  updateSeller: async (id: string, seller: Seller) => {
    try {
      set({ loading: true });

      console.log("Updating seller: ", seller, " with id: ", id);

      // Token is automatically added by interceptor
      const response = await axiosInstance.patch(`/api/seller/${id}`, seller);

      if (response.status !== 200) {
        throw new Error("Failed to update seller");
      }

      // Update sellers state after update
      set((state) => ({
        sellers: state.sellers.map((s) =>
          s._id == id ? { ...s, ...seller } : s
        ),
        loading: false,
      }));

      toast.success("Seller updated successfully!");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error(err.response?.data?.message || "Something went wrong");

      set({ loading: false });
    }
  },
}));
