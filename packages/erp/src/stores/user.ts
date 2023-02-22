import { setJWT } from "core/src/helpers/utils";
import type { User } from "@/types/user";
import { defineStore } from "pinia";
import config from "@/const";
import { useRouter } from "vue-router";
import { getJWT } from "core/src/helpers/utils";
import axios from "axios";
import mock from "@/mock.json";
import { makeAPIStore } from "core/src/factories/store.factory";

const useUserStore = makeAPIStore<User>({
  id: "users",
  state: {
    auth: {} as User,
  },
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

      if (response.data?.token) {
        setJWT(response.data.token);
        this.auth = response.data.user;
      }

      return response.data.user;
    },
  },
  persist: true,
  filters: {
    populate: ["role"],
  },
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
    if (error.response.status == 401) {
      /** Token no more valid */
      userStore.disconnect();
    }
    Promise.reject(error);
  }
);

export default useUserStore;
