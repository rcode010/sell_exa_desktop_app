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

type ProductQuality = "New" | "Used" | "Refurbished";

export interface Product {
  id: number;
  name: string;
  description?: string;
  companyId: number;
  sellerId: string;
  model: string;
  images: string[];
  price: number;
  category: ProductCategory;
  quality: ProductQuality;
}

export interface ProductStore {
  loading: boolean;
  products: Product[];

  getProducts: () => Promise<void>;
}
