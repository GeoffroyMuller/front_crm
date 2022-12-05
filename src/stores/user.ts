import { setJWT, sleep } from "@/core/helpers/utils";
import type { User } from "@/types/user";
import axios from "@/core/plugins/axios";
import { defineStore } from "pinia";
import config from "@/const";

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
      const response = !config.IS_MOCK
        ? await axios.post("/auth/login", {
            email,
            password,
          })
        : {
            data: {
              user: {
                id: 1,
                idCompany: 1,
                firstname: "[MOCK]Etienne",
                lastname: "ROBERT",
                address: "7 rue du ruisseau, Noisseville",
                phone: "0781568685",
                email: "etienne@local.fr",
              },
              token:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjcwMjU3Mjc5LCJleHAiOjE2NzAzNDM2Nzl9.B9naGOll85mO6ics5FWl_ndQLzeapWcpLOU7PSuIObg",
            },
          };

      if (response.data?.token) {
        setJWT(response.data.token);
        this.auth = response.data.user;
      }

      return response.data.user;
    },
  },
  persist: true,
});
