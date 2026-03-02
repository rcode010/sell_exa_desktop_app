/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { Order, OrderStatus } from "../types/order";

interface OrderStore {
  orders: Order[];
  loading: boolean;

  // Fetch all orders (admin)
  getOrders: () => Promise<void>;

  // Change the status of an order (admin) — PATCH /api/order
  changeOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;

  // Delete an order (admin) — DELETE /api/order
  deleteOrder: (orderId: string) => Promise<boolean>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  loading: false,

  getOrders: async () => {
    // Only show the spinner on the very first load — if we already have data,
    // skip the spinner and silently update in the background (stale-while-revalidate)
    const hasData = get().orders.length > 0;
    if (!hasData) set({ loading: true });

    try {
      const res = await axios.get("/api/order/some");

      // Normalise the API response — handle both { data: [] } and [] shapes
      const raw: any[] = res.data?.data ?? res.data ?? [];

      const orders: Order[] = raw.map((o: any) => ({
        _id: o._id,

        // buyerId is populated from the Buyer model
        buyer:
          o.buyerId?.name ??
          o.buyerId?.userName ??
          o.buyerId?.phoneNo ??
          o.buyerId ??
          "Unknown Buyer",

        // No seller field in the schema — populate from product ref if available
        seller:
          o.sellerId?.name ??
          o.sellerId?.shopName ??
          o.seller?.name ??
          o.seller ??
          "—",

        // createdAt comes from { timestamps: true }
        date: o.createdAt
          ? new Date(o.createdAt).toLocaleDateString()
          : "",

        // products: productId (ObjectId ref) + quantity
        // name/price exist only if the backend populates the Product ref
        products: (o.products ?? []).map((p: any) => ({
          productId: p.productId?._id ?? p.productId ?? "",
          name:
            p.productId?.name ??
            p.productId?.productName ??
            p.name ??
            `Product #${String(p.productId ?? "").slice(-4)}`,
          price: p.productId?.price ?? p.price ?? 0,
          quantity: p.quantity ?? 1,
        })),

        // Schema field is `totalPrice`
        total: o.totalPrice ?? 0,

        // Backend enum: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
        status: o.status ?? "Pending",
      }));

      set({ orders, loading: false });
    } catch (error: any) {
      console.error("Get orders error:", error);
      set({ loading: false });

      const message =
        error.response?.data?.message || "Failed to load orders";
      toast.error(message);
    }
  },

  changeOrderStatus: async (orderId: string, status: OrderStatus) => {
    try {
      await axios.patch(
        "/api/order",
        { status },
        {
          params: { orderId },
        },
      );

      // Optimistically update the local list so the UI reflects the change immediately
      set((state) => ({
        orders: state.orders.map((o) =>
          o._id === orderId ? { ...o, status } : o,
        ),
      }));

      toast.success("Order status updated");
      return true;
    } catch (error: any) {
      console.error("Change order status error:", error);

      const message =
        error.response?.data?.message || "Failed to update order status";
      toast.error(message);
      return false;
    }
  },

  deleteOrder: async (orderId: string) => {
    try {
      await axios.delete("/api/order", {
        headers: { "order-id": orderId },
      });

      // Remove from local list
      set((state) => ({
        orders: state.orders.filter((o) => o._id !== orderId),
      }));

      toast.success("Order deleted");
      return true;
    } catch (error: any) {
      console.error("Delete order error:", error);

      const message =
        error.response?.data?.message || "Failed to delete order";
      toast.error(message);
      return false;
    }
  },
}));
