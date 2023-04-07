import axios from "axios";
import { User } from "../types";

export function getHeaders(auth: User) {
  return { "x-auth": JSON.stringify(auth) };
}


export function fetch(url: string, auth: User) {
  return axios.get(url, { headers: getHeaders(auth) });
}
