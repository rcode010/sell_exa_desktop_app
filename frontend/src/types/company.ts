interface CompanyModel {
  name: string;
}

export interface Company {
  _id: string;
  name: string;
  logoLink: string | null;
  models?: CompanyModel[];
  products: number;
}

export interface CompanyStore {
  // State
  companies: Company[];
  companiesCount: number;
  loading: boolean;

  // Actions
  getCompanies: () => Promise<void>;
  createCompany: (file: FormData) => Promise<boolean>;
  updateCompany: (file: FormData, id: string) => Promise<boolean>;
  deleteCompany: (id: string) => Promise<boolean>;
}
