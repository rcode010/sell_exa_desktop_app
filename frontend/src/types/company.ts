export interface CompanyModel {
  _id: string;
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

  // Actions
  getModels: (companyId: string) => Promise<boolean>;
  createModel: (companyId: string, modelName: string) => Promise<boolean>;
  updateModel: (
    companyId: string,
    modelId: string,
    newName: string,
  ) => Promise<boolean>;
  deleteModel: (companyId: string, modelId: string) => Promise<boolean>;
}
