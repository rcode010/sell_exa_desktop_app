import { create } from "zustand";
import { Product, ProductStore, CreateProductParams } from "../types/product";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useProductStore = create<ProductStore>((set, get) => ({
  loading: false,
  products: [],

  getProducts: async () => {
    set({ loading: true });

    try {
      const response = await axiosInstance.get("/api/product/all");

      if (response.status !== 200) {
        throw new Error("Failed to fetch products");
      }

      set({ products: response.data.data, loading: false });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error(err.response?.data?.message || "Something went wrong");

      set({ loading: false });
    }
  },

  createProduct: async (params: CreateProductParams) => {
    set({ loading: true });
    try {
      const { formData, sellerId, companyId, modelId } = params;

      // Send as query parameters as the backend expects
      const url = `/api/product/?sellerId=${sellerId}&companyId=${companyId}&modelId=${modelId}`;

      const response = await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 201) {
        throw new Error("Failed to create product");
      }

      try {
        await get().getProducts(); // Try to refresh
      } catch (refreshError) {
        console.error(
          "Failed to refresh, using server response:",
          refreshError
        );
        // Optimistically update with server response
        if (response.data.data) {
          set((state) => ({
            products: [...state.products, response.data.data],
          }));
        }
      }

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

  updateProduct: async (id: string, product: Partial<Product>) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.put(`/api/product/${id}`, product);

      if (response.status !== 200) {
        throw new Error("Failed to update product");
      }

      try {
        await get().getProducts(); // Try to refresh
      } catch (refreshError) {
        console.error(
          "Failed to refresh, using server response:",
          refreshError
        );
        // Optimistically update with server response
        set((state) => ({
          products: state.products.map((product) =>
            product._id === id ? response.data.data : product
          ),
        }));
      }

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

  deleteProduct: async (id: string) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.delete(`/api/product/${id}`);

      if (response.status !== 200) {
        throw new Error("Failed to delete product");
      }

      try {
        await get().getProducts();
      } catch (refreshError) {
        console.error(
          "Failed to refresh, using server response:",
          refreshError
        );

        // Optimistically update with server response
        set((state) => ({
          products: state.products.filter((product) => product._id !== id),
        }));
      }

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
