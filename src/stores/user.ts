import { setJWT } from "@/core/helpers/utils";
import type { User } from "@/types/user";
import { defineStore } from "pinia";
import config from "@/const";
import { useRouter } from "vue-router";
import { getJWT } from "@/core/helpers/utils";
import axios from "@/core/plugins/axios";
import mock from "@/mock.json";

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
      this.auth = {};
      setJWT(null);
      const router = useRouter();
      router.push("/login");
    },
    async login(email: string, password: string) {
      const response = !config.IS_MOCK
        ? await axios.post("/auth/login", {
            email,
            password,
          })
        : mock.GET["/auth/login"];

      console.error(response);

      if (response.data?.token) {
        setJWT(response.data.token);
        this.auth = response.data.user;
      }

      return response.data.user;
    },
  },
  persist: true,
});

axios.interceptors.request.use(
  async (config) => {
    config.headers = {
      Authorization: `${getJWT()}`,
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  async (config) => {
    return config;
  },
  (error) => {
    const userStore = useUserStore();
    if (error.response.status == 403) {
      /** Token no more valid */
      userStore.disconnect();
    }
    Promise.reject(error);
  }
);
