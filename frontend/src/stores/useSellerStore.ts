import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../lib/axios";
import { Seller, SellerStore } from "../types/seller";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { PAGINATION } from "../constants/config";

export const useSellerStore = create<SellerStore>()(
  persist(
    (set, get) => ({
      sellers: [],
      loading: false,
      isOffline: false,
      lastUpdated: null,

      getAllSellers: async () => {
        try {
          const hasData = get().sellers.length > 0;
          if (!hasData) set({ loading: true });

          // Token is automatically added by interceptor inside axios.ts | no need to pass it manually!
          const response = await axiosInstance.get(
            `/api/seller/all?limit=${PAGINATION.DEFAULT_LIMIT}&page=${PAGINATION.DEFAULT_PAGE}`,
          );

          if (response.status !== 200) {
            throw new Error("Failed to fetch sellers");
          }

          set({ sellers: response.data.data, loading: false, isOffline: false, lastUpdated: Date.now() });
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;
          const hasData = get().sellers.length > 0;
          console.log("Error: " + err.message);
          if (hasData) {
            set({ loading: false, isOffline: true });
          } else {
            toast.error(err.response?.data?.message || "Something went wrong");
            set({ loading: false, isOffline: true });
          }
        }
      },

      createSeller: async (seller: Partial<Seller>) => {
        set({ loading: true });

        try {
          // Token is automatically added by interceptor
          const response = await axiosInstance.post("/api/seller", seller);

          if (response.status !== 201) {
            throw new Error("Failed to create seller");
          }

          // Try updating sellers state after creation by fetching them from backend
          try {
            await get().getAllSellers(); // Try to refresh
          } catch (refreshError) {
            console.error(
              "Failed to refresh, using server response:",
              refreshError,
            );

            // Optimistically update with server response
            set((state) => ({
              sellers: state.sellers.map((c) =>
                c._id === response.data.data._id ? response.data.data : c,
              ),
            }));
          }

          set({ loading: false });
          toast.success("Seller created successfully!");
          return true;
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;

          console.error("Error creating seller:", err.message);
          toast.error(err.response?.data?.message || "Failed to create seller");

          set({ loading: false });
          return false;
        }
      },

      deleteSeller: async (id: string) => {
        set({ loading: true });

        try {
          const response = await axiosInstance.delete(`/api/seller?sellerId=${id}`);

          // Backend returns 204 (No Content) on successful deletion
          if (response.status !== 204) {
            throw new Error("Failed to delete seller");
          }

          // Update sellers state after deletion by fetching them from backend
          try {
            await get().getAllSellers(); // Try to refresh
          } catch (refreshError) {
            console.error("Failed to refresh sellers list:", refreshError);

            // Optimistically update by removing the deleted seller
            set((state) => ({
              sellers: state.sellers.filter((seller) => seller._id !== id),
            }));
          }

          set({ loading: false });
          toast.success("Seller deleted successfully!");
          return true;
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;

          console.error("Error deleting seller:", err.message);
          toast.error(err.response?.data?.message || "Failed to delete seller");

          set({ loading: false });
          return false;
        }
      },

      hideSeller: async (id: string) => {
        set({ loading: true });

        try {
          const response = await axiosInstance.patch(`/api/seller/hide?sellerId=${id}`);

          if (response.status !== 200) {
            throw new Error("Failed to toggle seller visibility");
          }

          // Update sellers state after hiding
          try {
            await get().getAllSellers(); // Try to refresh
          } catch (refreshError) {
            console.error("Failed to refresh sellers list:", refreshError);

            // Optimistically update
            set((state) => ({
              sellers: state.sellers.map((seller) =>
                seller._id === id ? { ...seller, isHidden: !seller.isHidden } : seller
              ),
            }));
          }

          set({ loading: false });
          toast.success(response.data.message || "Seller visibility toggled successfully!");
          return true;
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;

          console.error("Error toggling seller visibility:", err.message);
          toast.error(err.response?.data?.message || "Failed to toggle seller visibility");

          set({ loading: false });
          return false;
        }
      },

      updateSeller: async (id: string, seller: Partial<Seller>) => {
        set({ loading: true });

        try {
          // Only send the fields that backend expects
          const updateData = {
            phoneNo: seller.phoneNo,
            storeName: seller.storeName,
            location: seller.location,
          };

          const response = await axiosInstance.patch(
            `/api/seller?sellerId=${id}`,
            updateData,
          );

          if (response.status !== 200) {
            throw new Error("Failed to update seller");
          }

          // Update sellers state after update
          // Try updating sellers state after creation by fetching them from backend
          try {
            await get().getAllSellers(); // Try to refresh
          } catch (refreshError) {
            console.error(
              "Failed to refresh, using server response:",
              refreshError,
            );

            // Optimistically update with server response
            set((state) => ({
              sellers: state.sellers.map((c) =>
                c._id === response.data.data._id ? response.data.data : c,
              ),
            }));
          }

          set({ loading: false });
          toast.success("Seller updated successfully!");
          return true;
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;

          console.error("Error updating seller:", err.message);
          toast.error(err.response?.data?.message || "Failed to update seller");

          set({ loading: false });
          return false;
        }
      },
    }),
    {
      name: "sellers-storage",
      partialize: (state) => ({
        sellers: state.sellers,
        isOffline: state.isOffline,
        lastUpdated: state.lastUpdated,
      }),
    },
  ),
);
