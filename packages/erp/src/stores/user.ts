import { setJWT } from "core/src/helpers/utils";
import type { User } from "@/types/user";
import { useRouter } from "vue-router";
import { getJWT } from "core/src/helpers/utils";
import axios from "axios";
import { makeAPIStore } from "core/src/factories/store.factory";

function setRefreshToken(token: string | null) {
  if (!token) {
    localStorage.removeItem("refreshToken");
    return;
  }
  localStorage.setItem("refreshToken", token);
}
function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

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
    async loginCode(code: string) {
      const response = await axios.post("/auth/login", {
        code,
      });
      if (response.data?.token) {
        setJWT(response.data.token);
        setRefreshToken(response.data.refreshToken);
        this.auth = response.data.user;
      }

      return response.data.user;
    },
    async login(props: {
      email?: string;
      password?: string;
      code?: string;
      refresh_token?: string;
    }) {
      let params = {};
      if (props.code) {
        params = { code: props.code };
      } else if (props.email && props.password) {
        params = { email: props.email, password: props.password };
      } else if (props.refresh_token) {
        params = { refresh_token: props.refresh_token };
      }
      const response = await axios.post("/auth/login", params);

      if (response.data?.token) {
        setJWT(response.data.token);
        setRefreshToken(response.data.refreshToken);
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
  async (error) => {
    const userStore = useUserStore();
    if (error.response.status == 401) {
      const refresh_token = getRefreshToken();
      if (refresh_token) {
        try {
          await userStore.login({ refresh_token });
          const response = await axios(error.config);
          return response;
        } catch (err) {
          userStore.disconnect();
        }
      } else {
        userStore.disconnect();
      }
    }
    Promise.reject(error);
  }
);

export default useUserStore;
