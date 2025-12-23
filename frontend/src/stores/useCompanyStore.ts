import { create } from "zustand";
import { AxiosError } from "axios";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { CompanyStore } from "../types/company";

export const useCompanyStore = create<CompanyStore>((set, get) => ({
  // States
  companies: [],
  companiesCount: 0,
  loading: false,

  // Actions
  getCompanies: async () => {
    set({ loading: true });

    try {
      const response = await axios.get("/api/company/");
      const companies = response.data.data;

      set({ companies, loading: false });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error("Something went wrong");

      set({ loading: false });
    }
  },

  createCompany: async (file: FormData) => {
    set({ loading: true });

    try {
      const response = await axios.post("/api/company/", file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data.success) {
        throw new Error("Create company failed");
      }

      try {
        await get().getCompanies();
      } catch (refreshError) {
        console.error(
          "Failed to refresh, using server response:",
          refreshError
        );
        // Optimistically update with server response
        set((state) => ({
          companies: state.companies.map((company) =>
            company._id === response.data.data._id
              ? response.data.data
              : company
          ),
        }));
      }

      toast.success("Company created successfully!");
      set({ loading: false });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error(err.response?.data?.message || "Something went wrong");

      set({ loading: false });
      return false;
    }
  },

  updateCompany: async (file: FormData, id: string) => {
    try {
      set({ loading: true });

      if (!file.get("name")) {
        toast.error("Company name is required");
        set({ loading: false });
        return false;
      }

      const response = await axios.patch(`/api/company/${id}`, file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data.success) {
        throw new Error("Update company failed");
      }

      try {
        await get().getCompanies();
      } catch (refreshError) {
        console.error(
          "Failed to refresh, using server response:",
          refreshError
        );
        // Optimistically update with server response
        set((state) => ({
          companies: state.companies.map((company) =>
            company._id === response.data.data._id
              ? response.data.data
              : company
          ),
        }));
      }
      toast.success("Company updated successfully!");
      set({ loading: false });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error(err.response?.data?.message || "Something went wrong");

      set({ loading: false });
      return false;
    }
  },

  deleteCompany: async (id: string) => {
    try {
      set({ loading: true });

      const response = await axios.delete(`/api/company/delete-company/${id}`);

      if (!response.data.success) {
        throw new Error("Delete company failed");
      }

      try {
        await get().getCompanies();
      } catch (refreshError) {
        console.error(
          "Failed to refresh, using server response:",
          refreshError
        );
        // Optimistically update with server response
        set((state) => ({
          companies: state.companies.map((company) =>
            company._id === id ? response.data.data : company
          ),
        }));
      }

      toast.success("Company deleted successfully!");
      set({ loading: false });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error(err.response?.data?.message || "Something went wrong");

      set({ loading: false });
      return false;
    }
  },
}));
