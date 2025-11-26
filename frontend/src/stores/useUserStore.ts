import { create } from "zustand";
import axois from "../lib/axios";
import { User } from "lucide-react";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export const useUserStore = create((set,get:any) => ({
  user: null,
  loading: false,
  setUser: (user: User) => set({ user }),

  login: async (phone: string, password: string) => {
    set({ loading: true });

    try {
      if (!phone || !password) {
        throw new Error("Phone and password are required");
      }

      const response = await axois.post("/api/admin/login", {
        phoneNo: phone,
        password,
      });
      console.log(response.data)
      const user = response.data.data;
      console.log("User: " + user);
      toast.success("Logged in successfuly")

      set({ user, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  logout: async () => {
    set({loading: true})
    try {
      const res = await axois.post(
        "/api/admin/logout",
        {},
        {
          headers: {
            // get the token from credential manager 
            'refresh-token': get().user.tokens.refreshToken,
          },
        }
        );
      toast.success("Logged Out Successfuly")


      set({loading:false, user:null});
    } catch (error) {
       console.error(error);
      set({ loading: false });
    }
  },
}));
