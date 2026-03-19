/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { Order, OrderStatus, OrderStore } from "../types/order";
import { AxiosError } from "axios";

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      totalPages: 1,
      currentPage: 1,
      loading: false,
      isOffline: false,
      lastUpdated: null,

      getOrders: async (page = 1, limit = 10) => {
        // Only show the spinner on the very first load — if we already have data,
        // skip the spinner and silently update in the background (stale-while-revalidate)
        const hasData = get().orders.length > 0;
        if (!hasData) set({ loading: true });

        try {
          const res = await axios.get(`/api/order/admin/all?page=${page}&limit=${limit}`);

          // Backend now populates buyerId and products.productId (with nested sellerId)
          const raw: any[] = res.data?.data ?? res.data ?? [];
          const totalPages = res.data?.totalPages ?? 1;

          const orders: Order[] = raw.map((o: any) => ({
            _id: o._id,

            // buyerId is now a populated Buyer object: { firstName, lastName, phoneNo }
            buyer: (() => {
              const b = o.buyerId;
              if (!b) return "Unknown Buyer";
              if (typeof b === "object") {
                if (b.firstName) return `${b.firstName} ${b.lastName}`.trim();
                return b.phoneNo ?? `Buyer #${String(b._id ?? "").slice(-6)}`;
              }
              return `Buyer #${String(b).slice(-6)}`;
            })(),

            // Seller comes from the first product's populated sellerId.storeName
            seller: (() => {
              const firstProduct = o.products?.[0]?.productId;
              if (firstProduct && typeof firstProduct === "object") {
                const s = firstProduct.sellerId;
                if (s && typeof s === "object") return s.storeName ?? `Seller #${String(s._id ?? "").slice(-6)}`;
                if (typeof s === "string") return `Seller #${s.slice(-6)}`;
              }
              return "—";
            })(),

            // createdAt comes from { timestamps: true }
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "",

            // products.productId is now populated: { name, price, sellerId }
            products: (o.products ?? []).map((p: any) => {
              const prod = typeof p.productId === "object" ? p.productId : null;
              return {
                productId: String(prod?._id ?? p.productId ?? ""),
                name:
                  prod?.name?.english ??
                  prod?.name?.kurdish ??
                  prod?.name ??
                  `Product #${String(prod?._id ?? p.productId ?? "").slice(-4)}`,
                price: prod?.price ?? 0,
                quantity: p.quantity ?? 1,
              };
            }),

            // Schema field is `totalPrice`
            total: o.totalPrice ?? 0,

            // Backend enum: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
            status: o.status ?? "Pending",
          }));

          set({
            orders,
            totalPages,
            currentPage: page,
            loading: false,
            isOffline: false,
            lastUpdated: Date.now(),
          });
        } catch (e) {
          const error = e as AxiosError<{ message?: string }>;
          console.error("Get orders error:", error);
          const hasData = get().orders.length > 0;
          if (hasData) {
            // Silently show cached data with offline banner instead of error toast
            set({ loading: false, isOffline: true });
          } else {
            set({ loading: false, isOffline: true });
            const message = error.response?.data?.message || "Failed to load orders";
            toast.error(message);
          }
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
    }),
    {
      name: "orders-storage",
      partialize: (state) => ({
        orders: state.orders,
        lastUpdated: state.lastUpdated,
      }),
    },
  ),
);
