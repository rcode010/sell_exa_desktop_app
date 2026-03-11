import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AxiosError } from "axios";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { CompanyStore } from "../types/company";

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set, get) => ({
      // States
      companies: [],
      hiddenCompanies: [],
      companiesCount: 0,
      loading: false,
      isOffline: false,
      lastUpdated: null,

      // Actions
      getCompanies: async () => {
        const hasData = get().companies.length > 0;
        if (!hasData) set({ loading: true });

        try {
          const response = await axios.get("/api/company/");
          const companies = response.data.data;

          set({ companies, loading: false, isOffline: false, lastUpdated: Date.now() });
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;
          const hasData = get().companies.length > 0;
          console.log("Error: " + err.message);
          if (hasData) {
            set({ loading: false, isOffline: true });
          } else {
            toast.error("Something went wrong");
            set({ loading: false, isOffline: true });
          }
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
            console.error("Failed to refresh, using server response:", refreshError);
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
            console.error("Failed to refresh, using server response:", refreshError);
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
            console.error("Failed to refresh, using server response:", refreshError);
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

      hideCompany: async (id: string) => {
        try {
          set({ loading: true });

          const response = await axios.patch(`/api/company/${id}/toggle`);

          if (!response.data.success) {
            throw new Error("Toggle company visibility failed");
          }

          try {
            await get().getCompanies();
          } catch (refreshError) {
            console.error("Failed to refresh, using server response:", refreshError);
            set((state) => ({
              companies: state.companies.map((company) =>
                company._id === id ? response.data.data : company
              ),
            }));
          }

          toast.success("Company visibility updated!");
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
    }),
    {
      name: "companies-storage",
      partialize: (state) => ({
        companies: state.companies,
        companiesCount: state.companiesCount,
        isOffline: state.isOffline,
        lastUpdated: state.lastUpdated,
      }),
    },
  ),
);