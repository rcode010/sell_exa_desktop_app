/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { Order, OrderStatus } from "../types/order";
import { AxiosError } from "axios";

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
      const res = await axios.get("/api/order/admin/all");

      // Normalise the API response — handle both { data: [] } and [] shapes
      const raw: any[] = res.data?.data ?? res.data ?? [];

      // Collect all unique product IDs so we can fetch their details
      // (the backend doesn't populate productId — it's just a raw ObjectId string)
      const productIdSet = new Set<string>();
      for (const o of raw) {
        for (const p of o.products ?? []) {
          const id = typeof p.productId === "object" ? p.productId?._id : p.productId;
          if (id) productIdSet.add(String(id));
        }
      }

      // Fetch each product in parallel to get name, price, seller, etc.
      // Backend endpoint: GET /api/product?productId=xxx
      const productIds = [...productIdSet];
      const productMap: Record<string, any> = {};
      const fetchResults = await Promise.allSettled(
        productIds.map((id) => axios.get("/api/product", { params: { productId: id } })),
      );
      for (let i = 0; i < fetchResults.length; i++) {
        const result = fetchResults[i];
        if (result.status === "fulfilled") {
          const prod = result.value.data?.data ?? result.value.data;
          if (prod) productMap[productIds[i]] = prod;
        }
      }

      const orders: Order[] = raw.map((o: any) => ({
        _id: o._id,

        // buyerId is populated from the Buyer model IF the backend populates it.
        // If the backend sends a plain ObjectId string, show a shortened ID as fallback.
        buyer: (() => {
          const b = o.buyerId;
          if (!b) return "Unknown Buyer";
          if (typeof b === "object") {
            return b.name ?? b.userName ?? b.email ?? b.phoneNo ?? `Buyer #${String(b._id ?? "").slice(-6)}`;
          }
          // Raw ObjectId string — show a short reference
          return `Buyer #${String(b).slice(-6)}`;
        })(),

        // The order schema has no sellerId — it lives on the Product doc.
        // Use the seller name from the first fetched product (backend returns seller as storeName string).
        seller: (() => {
          const direct = o.sellerId ?? o.seller;
          if (direct) {
            if (typeof direct === "object") {
              return direct.name ?? direct.shopName ?? direct.storeName ?? `Seller #${String(direct._id ?? "").slice(-6)}`;
            }
            // Could be a raw ObjectId or an actual name — check length
            if (String(direct).length === 24) return `Seller #${String(direct).slice(-6)}`;
            return String(direct);
          }
          // Try the seller from the first product we fetched
          const firstProdId = typeof o.products?.[0]?.productId === "object"
            ? o.products[0].productId._id
            : o.products?.[0]?.productId;
          const firstProd = firstProdId ? productMap[String(firstProdId)] : null;
          if (firstProd?.seller) return firstProd.seller;
          return "—";
        })(),

        // createdAt comes from { timestamps: true }
        date: o.createdAt
          ? new Date(o.createdAt).toLocaleDateString()
          : "",

        // products: use fetched product data for name/price
        products: (o.products ?? []).map((p: any) => {
          const rawId = typeof p.productId === "object" ? p.productId?._id : p.productId;
          const fetched = rawId ? productMap[String(rawId)] : null;
          return {
            productId: String(rawId ?? ""),
            name:
              fetched?.name?.english ??
              fetched?.name?.kurdish ??
              p.productId?.name?.english ??
              p.productId?.name ??
              p.name ??
              `Product #${String(rawId ?? "").slice(-4)}`,
            price: fetched?.price ?? p.productId?.price ?? p.price ?? 0,
            quantity: p.quantity ?? fetched?.quantity ?? 1,
          };
        }),

        // Schema field is `totalPrice`
        total: o.totalPrice ?? 0,

        // Backend enum: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
        status: o.status ?? "Pending",
      }));


      set({ orders, loading: false });
    } catch (e) {
      const error = e as AxiosError<{ message?: string }>;
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

      // Optimistically update the local list
      set((state) => ({
        orders: state.orders.map((o) =>
          o._id === orderId ? { ...o, status } : o,
        ),
      }));

      toast.success("Order status updated");
      return true;
    } catch (e) {
      const error = e as AxiosError<{ message?: string }>;
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
    } catch (e) {
      const error = e as AxiosError<{ message?: string }>;
      console.error("Delete order error:", error);

      const message =
        error.response?.data?.message || "Failed to delete order";
      toast.error(message);
      return false;
    }
  },
}));
