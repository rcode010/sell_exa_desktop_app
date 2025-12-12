import { Key } from "react";

export interface Product {
  id: number;
  name: string;
  description?: string;
  companyId: Key;
  sellerId: Key;
  model: string;
  images: string[];
  price: number;
  category:
    | "Tire"
    | "Cleaning"
    | "Car Repair"
    | "Spare Parts"
    | "Accessories"
    | "Others";
  quality: ["New", "Used", "Refurbished"];
}

export interface ProductStore {
  loading: boolean;
  products: Product[];

  getProducts: () => Promise<void>;
}
