import config from "@/const";
import axios from "axios";

const instance = axios.create({
  // todo: get baseURL from .env
  baseURL: config.API_URL,
});

export default instance;
