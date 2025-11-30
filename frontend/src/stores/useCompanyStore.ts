import { create } from "zustand";
import axois from "../lib/axios";

export const useCompanyStore = create(
    (set) => ({
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
    }),
);
