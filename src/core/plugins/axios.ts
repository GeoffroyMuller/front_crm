import axios from "axios";

const instance = axios.create({
  // todo: get baseURL from .env
  baseURL: "https://demoapp.fr",
});

export default instance;
