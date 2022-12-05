import axios from "axios";
import { getJWT } from "../helpers/utils";

const instance = axios.create({
  // todo: get baseURL from .env
  baseURL: "http://localhost:3002",
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
