export interface Location {
  locationName: string;
  latitude: string;
  longitude: string;
}

export interface Seller {
  _id: string;
  storeName: string;
  phoneNo: string;
  location: Location;
  city: string;
  products: string[];
  isHidden?: boolean;
}

export interface SellerStore {
  // State
  sellers: Seller[];
  loading: boolean;

  // Actions
  getAllSellers: () => Promise<void>;
  createSeller: (seller: Partial<Seller>) => Promise<boolean>;
  deleteSeller: (id: string) => Promise<boolean>;
  hideSeller: (id: string) => Promise<boolean>;
  updateSeller: (id: string, seller: Partial<Seller>) => Promise<boolean>;
}

// TODO: Show seller products inside edit seller modal / seller page details modal
