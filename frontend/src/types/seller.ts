import { Location } from "./location";

export interface Seller {
  _id: string;
  storeName: string;
  phoneNo: string;
  location: Location;
  products: string[];
}

export interface NewSeller {
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
  createSeller: (seller: NewSeller) => Promise<boolean>;
  deleteSeller: (id: string) => Promise<boolean>;
  updateSeller: (id: string, seller: Seller) => Promise<boolean>;
}

// TODO: Show seller products inside edit seller modal / seller page details modal
