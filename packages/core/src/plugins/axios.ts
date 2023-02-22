import axios, { type AxiosDefaults } from "axios";

export function setupAxios(config: AxiosDefaults) {
  for (const key of Object.keys(config)) {
    // @ts-ignore
    axios.defaults[key] = config[key];
  }
  return axios;
}
