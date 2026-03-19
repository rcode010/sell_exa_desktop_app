export interface CompanyModel {
  _id: string;
  name: string;
}

export interface Company {
  isHidden: boolean;
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
  totalPages: number;
  currentPage: number;
  loading: boolean;
  isOffline: boolean;
  lastUpdated: number | null;

  // Actions
  getCompanies: (page?: number, limit?: number, search?: string) => Promise<void>;
  hideCompany: (id: string) => Promise<boolean>;
  createCompany: (file: FormData) => Promise<boolean>;
  updateCompany: (file: FormData, id: string) => Promise<boolean>;
  deleteCompany: (id: string) => Promise<boolean>;
}

export interface ModelStore {
  // State
  models: CompanyModel[];
  modelsCount: number;
  loading: boolean;
  isOffline: boolean;
  lastUpdated: number | null;

  // Actions
  getModels: (companyId: string) => Promise<boolean>;
  createModel: (companyId: string, modelName: string) => Promise<boolean>;
  hideModel: (companyId: string, modelId: string) => Promise<boolean>;

  updateModel: (
    companyId: string,
    modelId: string,
    newName: string,
  ) => Promise<boolean>;
  deleteModel: (companyId: string, modelId: string) => Promise<boolean>;
}
