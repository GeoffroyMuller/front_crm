import axios from "axios";
import { User } from "../types";

/// @deprecated
export function getHeaders(auth: User) {
  return { "x-auth": JSON.stringify(auth) };
}

/// @deprecated
export function fetch(url: string, auth: User) {
  return axios.get(url, { headers: getHeaders(auth) });
}
