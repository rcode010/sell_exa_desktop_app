import { Location } from "./location";

export interface Seller {
  storeName: string;
  phoneNo: string;
  location: Location;
  products: string[];
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
