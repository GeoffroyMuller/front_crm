import axios from "axios";

const instance = axios.create({
  // todo: get baseURL from .env
  baseURL: "http://localhost:3002",
});

export default instance;
