import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
}));
