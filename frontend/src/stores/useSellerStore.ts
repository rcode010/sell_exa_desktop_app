import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { Seller } from "../types/seller";
import toast from "react-hot-toast";

export const useSellerStore = create((set) => ({
  sellers: [],
  loading: false,

  getAllSellers: async () => {
    try {
      set({ loading: true });
      const sellers = await axiosInstance.get("/api/seller/some");

      set({ sellers, loading: false });
    } catch (error) {
      console.error("Error: " + error);
      set({ loading: false });
    }
  },

  createSeller: async (seller: Seller) => {
    try {
      set({ loading: true });

      const response = await axiosInstance.post("/api/seller/create", seller);

      if (response.status !== 201) {
        throw new Error("Failed to create seller");
      }

      toast.success("Seller created successfully!");
      set({ loading: false });
    } catch (error) {
      toast.error("Failed to create seller");
      console.error("Error: " + error);
      set({ loading: false });
    }
  },
}));
