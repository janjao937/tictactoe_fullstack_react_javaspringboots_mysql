import { create } from "zustand";
import api from "../utils/axios";

interface TokenStore {
  token: string | null;
  loading: boolean;
  error: string | null;
  initToken: () => Promise<void>;
}

export const useTokenStore = create<TokenStore>((set) => ({
  token: null,
  loading: false,
  error: null,

  initToken: async () => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      set({ token: localToken });
      return;
    }

    set({ loading: true, error: null });
    try {
      const res = await api.get("/token");
      const newToken = res.data;

      // console.log("New Token:", newToken);
      set({ token: newToken, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));