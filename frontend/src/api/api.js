import axios from "axios";
import { API_BASE } from "../config";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000
});

export function setAuth(token) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}
export default api;
