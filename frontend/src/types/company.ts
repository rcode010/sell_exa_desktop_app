export interface Company {
  id: number;
  name: string;
  type: "manufacturer" | "distributor" | "retailer";
  email: string;
  phone: string;
  location: string;
  products: number;
  revenue: number;
  status: "active" | "inactive";
}