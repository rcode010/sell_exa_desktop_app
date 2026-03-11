import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Product,
  ProductStore,
  CreateProductParams,
  ProductDetails,
} from "../types/product";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      loading: false,
      products: [],
      isOffline: false,
      lastUpdated: null,

      getProducts: async () => {
        const hasData = get().products.length > 0;
        if (!hasData) set({ loading: true });

        try {
          const response = await axiosInstance.get("/api/product/all");

          if (response.status !== 200) {
            throw new Error("Failed to fetch products");
          }

          set({ products: response.data.data, loading: false, isOffline: false, lastUpdated: Date.now() });
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;
          const hasData = get().products.length > 0;
          console.log("Error: " + err.message);
          if (hasData) {
            set({ loading: false, isOffline: true });
          } else {
            toast.error(err.response?.data?.message || "Something went wrong");
            set({ loading: false, isOffline: true });
          }
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
              refreshError,
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
          const response = await axiosInstance.patch(
            `/api/product/?productId=${id}`,
            product,
          );

          if (response.status !== 200) {
            throw new Error("Failed to update product");
          }

          try {
            await get().getProducts(); // Try to refresh
          } catch (refreshError) {
            console.error(
              "Failed to refresh, using server response:",
              refreshError,
            );
            // Optimistically update with server response
            set((state) => ({
              products: state.products.map((product) =>
                product._id === id ? response.data.data : product,
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
              refreshError,
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

      hideProduct: async (id: string) => {
        set({ loading: true });
        try {
          const response = await axiosInstance.patch(`/api/product/hide?productId=${id}`);

          if (response.status !== 200) {
            throw new Error("Failed to toggle product visibility");
          }

          try {
            await get().getProducts();
          } catch (refreshError) {
            console.error(
              "Failed to refresh, using server response:",
              refreshError,
            );

            // Optimistically update
            set((state) => ({
              products: state.products.map((product) =>
                product._id === id
                  ? { ...product, isHidden: !product.isHidden }
                  : product
              ),
            }));
          }

          set({ loading: false });
          toast.success(response.data.message || "Product visibility toggled successfully!");
          return true;
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;

          console.error("Error toggling product visibility:", err.message);
          toast.error(err.response?.data?.message || "Failed to toggle product visibility");

          set({ loading: false });
          return false;
        }
      },

      getProductById: async (productId: string): Promise<ProductDetails | null> => {
        try {
          console.log(`[ProductStore] Fetching product: ${productId}`);

          const response = await axiosInstance.get(
            `/api/product?productId=${productId}`,
          );

          console.log(`[ProductStore] Response status: ${response.status}`);
          console.log(`[ProductStore] Response data:`, response.data);

          if (response.status !== 200) {
            throw new Error("Failed to fetch product");
          }

          const data = response.data.data;

          if (!data) {
            console.error(
              `[ProductStore] No data returned for product ${productId}`,
            );
            return null;
          }

          console.log(`[ProductStore] Transforming product data:`, data);

          // Transform the response to match ProductDetails interface
          // Handle multilingual name and description
          const productDetails: ProductDetails = {
            name:
              typeof data.name === "string"
                ? data.name
                : data.name?.english || "Unknown",
            description:
              typeof data.description === "string"
                ? data.description
                : data.description?.english || "No description",
            company: data.company || "Unknown",
            model: data.model || "Unknown",
            seller: data.seller || "Unknown",
            imageLink:
              data.imageLink ||
              (Array.isArray(data.images) && data.images[0]?.imageLink) ||
              "",
            price: data.price || 0,
            weight: data.weight,
            quality: data.quality,
            city: data.city,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };

          console.log(`[ProductStore] Transformed product:`, productDetails);
          return productDetails;
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;

          console.error(`[ProductStore] Error fetching product ${productId}:`, {
            message: err.message,
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data,
            fullError: err,
          });
          return null;
        }
      },
    }),
    {
      name: "products-storage",
      partialize: (state) => ({
        products: state.products,
        isOffline: state.isOffline,
        lastUpdated: state.lastUpdated,
      }),
    },
  ),
);
