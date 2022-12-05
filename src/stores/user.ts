import { setJWT, sleep } from "@/core/helpers/utils";
import type { User } from "@/types/user";
import axios from "@/core/plugins/axios";
import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    auth: {} as User,
  }),
  getters: {
    getAuth: (state) => state.auth,
  },
  actions: {
    async disconnect() {
      setJWT(null);
    },
    async login(email: string, password: string) {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      if (response.data?.token) {
        setJWT(response.data.token);
        this.auth = response.data.user;
      }

      return response;
    },
  },
  persist: true,
});
