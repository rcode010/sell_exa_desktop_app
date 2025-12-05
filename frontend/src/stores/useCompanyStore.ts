import { create } from "zustand";
import axois from "../lib/axios";
import toast from "react-hot-toast";

export const useCompanyStore = create((set, get:any) => ({
  // States
  companies: [],
  companiesCount: 0,
  loading: false,

  // Actions
  getCompanies: async () => {
    set({ loading: true });

    try {
      const response = await axois.get("/api/company/");

      console.log(response.data);

      const companies = response.data.data;

      set({ companies, loading: false });
    } catch (error: unknown) {
      console.log("Error: " + error);
      set({ loading: false });
    }
  },
  createCompany: async (file: FormData) => {
  set({ loading: true });

  try {
    const response = await axois.post("/api/company/", file, {
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
  } catch (error: any) {
    console.log("Error: " + error);
    toast.error(error.message);
    set({ loading: false });
  }
},
}));
