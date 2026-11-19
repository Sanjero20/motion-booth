import axios from "axios";
import { csrfApi } from "./csrf";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();

  const requireCsrf = ["post", "put", "patch", "delete"].includes(method ?? "");

  if (requireCsrf) {
    const token = await csrfApi.getToken();
    config.headers.set("X-CSRF-TOKEN", token);
  }

  return config;
});

export default api;
