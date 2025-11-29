export interface Order {
  orderId: number;
  buyer: string;
  seller: string;
  date: string;
  products: { productId: number; quantity: number }[];
  total: number;
  status: "delivered" | "shipped" | "processing" | "pending" | "cancelled";
}
