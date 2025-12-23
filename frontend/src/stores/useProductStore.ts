import { create } from "zustand";
import { Product, ProductStore } from "../types/product";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useProductStore = create<ProductStore>((set, get) => ({
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

  createProduct: async (product: Partial<Product>) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post("/api/product/", product);

      if (response.status !== 201) {
        throw new Error("Failed to create product");
      }

      await get().getProducts();

      set({ loading: false });
      toast.success("Product created successfully!");
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.error("Error creating product:", err.message);
      toast.error(err.response?.data?.message || "Failed to create product");

      set({ loading: false });
      return false;
    }
  },

  updateProduct: async (id: number, product: Partial<Product>) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.put(`/api/product/${id}`, product);

      if (response.status !== 200) {
        throw new Error("Failed to update product");
      }

      await get().getProducts();

      set({ loading: false });
      toast.success("Product updated successfully!");
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.error("Error updating product:", err.message);
      toast.error(err.response?.data?.message || "Failed to update product");

      set({ loading: false });
      return false;
    }
  },

  deleteProduct: async (id: number) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.delete(`/api/product/${id}`);

      if (response.status !== 200) {
        throw new Error("Failed to delete product");
      }

      await get().getProducts();

      set({ loading: false });
      toast.success("Product deleted successfully!");
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.error("Error deleting product:", err.message);
      toast.error(err.response?.data?.message || "Failed to delete product");

      set({ loading: false });
      return false;
    }
  },
}));
