import { Key } from "react";

export interface Company {
  _id: Key | null | undefined;
  id: number;
  name: string;
  models: { name: string }[];
  products: number;
}

export interface CompanyStore {
  // State
  companies: Company[];
  companiesCount: number;
  loading: boolean;

  // Actions
  getCompanies: () => Promise<void>;
  createCompany: (file: FormData) => Promise<void>;
}
