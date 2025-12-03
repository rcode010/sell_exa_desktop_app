import { Product } from "./product";

export interface Seller {
  name: string;
  phone: string;
  location?: { locationName: string; longitude: string; latitude: string };
  products: Product[];
}
