import { Key } from "react";

type ProductCategory =
  | "Tire"
  |  "Brakes"
  | "Cleaning"
  | "Car Repair"
  | "Spare Parts"
  | "Engine Parts"
  | "Suspension"
  | "Accessories"
  | "Others";

export interface Product {
  id: number;
  name: string;
  description?: string;
  companyId: Key;
  sellerId: Key;
  model: string;
  images: string[];
  price: number;
  category: ProductCategory;
  quality: ["New", "Used", "Refurbished"];
}

export interface ProductStore {
  loading: boolean;
  products: Product[];

  getProducts: () => Promise<void>;
}
