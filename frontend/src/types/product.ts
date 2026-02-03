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
  dimensions?: {
    width: number;
    height: number;
    length: number;
  };
}

export interface CreateProductParams {
  formData: FormData;
  sellerId: string;
  companyId: string;
  modelId: string;
}

export interface ProductStore {
  loading: boolean;
  products: Product[];

  getProducts: () => Promise<void>;
  createProduct: (params: CreateProductParams) => Promise<boolean>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
}
