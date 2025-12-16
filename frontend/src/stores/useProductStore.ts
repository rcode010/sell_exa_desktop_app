import { create } from "zustand";
import { ProductStore } from "../types/product";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useProductStore = create<ProductStore>((set) => ({
  loading: false,
  products: [],

  getProducts: async () => {
    set({ loading: true });

    try {
      const response = await axiosInstance.get("/api/product/");

      set({ products: response.data, loading: false });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error(err.response?.data?.message || "Something went wrong");

      set({ loading: false });
    }
  },
}));
