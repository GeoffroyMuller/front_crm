import config from "@/const";
import axios from "axios";
import { getJWT } from "../helpers/utils";

const instance = axios.create({
  // todo: get baseURL from .env
  baseURL: config.API_URL,
});

instance.interceptors.request.use(
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

export default instance;
