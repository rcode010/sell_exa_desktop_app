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
      toast.error(err.response?.data?.message || "Something went wrong");

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

      console.log(response.data);

      if (response.data.success) {
        await get().getCompanies();
        toast.success("Company created successfully!");
      }

      set({ loading: false });
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;

      console.log("Error: " + err.message);
      toast.error(err.response?.data?.message || "Something went wrong");

      set({ loading: false });
    }
  },
}));
