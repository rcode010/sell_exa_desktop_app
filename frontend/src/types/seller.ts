import { Product } from "./product";

export interface Seller {
  name: string;
  phone: string;
  location?: { locationName: string; longitude: string; latitude: string };
  products: Product[];
}

export interface SellerStore {
  // State
  sellers: Seller[];
  loading: boolean;

  // Actions
  getAllSellers: () => Promise<void>;
  createSeller: (seller: Seller) => Promise<void>;
}

// TODO: Show seller products inside edit seller modal / seller page details modal
