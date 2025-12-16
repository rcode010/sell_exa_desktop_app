import { Key } from "react";

export interface Company {
  _id: Key | null | undefined;
  id: number;
  name: string;
  logoLink: string;
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
  updateCompany: (name: string, id: number) => Promise<string | undefined>;
  deleteCompany: (id: number) => Promise<void>;
}
