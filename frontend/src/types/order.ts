export type OrderStatus =
  | "Delivered"
  | "Shipped"
  | "Processing"
  | "Pending"
  | "Cancelled";

export interface OrderProduct {
  productId: string;
  name: string;   // populated from Product ref, or fallback
  price: number;  // populated from Product ref, or 0
  quantity: number;
}

export interface Order {
  _id: string;
  buyer: string;    // populated from buyerId ref
  seller: string;   // populated from product/seller ref if available, else "—"
  date: string;     // formatted from createdAt
  products: OrderProduct[];
  total: number;    // from totalPrice
  status: OrderStatus;
}
