type ProductCategory =
  | "Tire"
  | "Brakes"
  | "Cleaning"
  | "Car Repair"
  | "Spare Parts"
  | "Engine Parts"
  | "Suspension"
  | "Accessories"
  | "Others";

type ProductQuality = "Very good" | "Good" | "Basic";

export interface Product {
  _id: string;
  name: {
    english: string;
    kurdish: string;
    arabic: string;
  };
  description: {
    english: string;
    kurdish: string;
    arabic: string;
  };
  companyId: string;
  sellerId: string;
  modelId: string;
  images: {
    imageLink: string;
    imageId: string;
  }[];
  price: number;
  category?: ProductCategory;
  quality: ProductQuality;
  city: string;
  createdAt?: string;
  updatedAt?: string;
  weight?: number;
  quantity?: number;

  isHidden?: boolean;
}

export interface CreateProductParams {
  formData: FormData;
  sellerId: string;
  companyId: string;
  modelId: string;
}

export interface ProductDetails {
  name: string;
  description: string;
  company: string;
  model: string;
  seller: string;
  imageLink: string;
  price: number;
  weight?: number;
  quality: string;
  city: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductStore {
  loading: boolean;
  products: Product[];
  isOffline: boolean;
  lastUpdated: number | null;

  getProducts: () => Promise<void>;
  createProduct: (params: CreateProductParams) => Promise<boolean>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  hideProduct: (id: string) => Promise<boolean>;
  getProductById: (productId: string) => Promise<ProductDetails | null>;
}
