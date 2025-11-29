export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  seller: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}