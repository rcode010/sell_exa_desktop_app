import { create } from "zustand";

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
}));
