import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { NewSeller, Seller, SellerStore } from "../types/seller";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useSellerStore = create<SellerStore>((set, get) => ({
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

      set({ sellers: response.data.data, loading: false });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error(err.response?.data?.message || "Something went wrong");

      set({ loading: false });
    }
  },

  createSeller: async (seller: NewSeller) => {
    set({ loading: true });

    try {
      // Token is automatically added by interceptor
      const response = await axiosInstance.post("/api/seller/create", seller);

      if (response.status !== 201) {
        throw new Error("Failed to create seller");
      }

      // Update sellers state after creation
      await get().getAllSellers();

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

      if (response.status !== 200) {
        throw new Error("Failed to delete seller");
      }

      // Update sellers state after deletion
      await get().getAllSellers();

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

  updateSeller: async (id: string, seller: Seller) => {
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
        updateData
      );

      if (response.status !== 200) {
        throw new Error("Failed to update seller");
      }

      // Update sellers state after update
      await get().getAllSellers();

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
}));
