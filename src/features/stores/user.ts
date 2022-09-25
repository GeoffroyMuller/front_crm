import { setJWT, sleep } from "@/core/helpers/utils";
import type { User } from "@/types/user";
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
      await sleep(1500);

      //mock
      const response: { user: User; token: string } = {
        user: {
          id: 1,
          email: email,
          firstname: "Etienne",
          lastname: "ROBERT",
        },
        token: "qdsjnqsjdlkqsiqnLJBJKBKQJSHD",
      };
      setJWT(response.token);

      this.auth = response.user;

      return response;
    },
  },
  persist: true,
});
