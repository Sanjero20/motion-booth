import api from "@/lib/api/client";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";
import { csrfApi } from "@/lib/api/csrf";

export const authApi = {
  register: async (request: RegisterRequest): Promise<void> => {
    await api.post("/auth/register", request);
  },

  login: async (request: LoginRequest): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>("/auth/login", request);
      return data;
    } finally {
      csrfApi.clearToken();
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } finally {
      csrfApi.clearToken();
    }
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const { data } = await api.get("/auth/me");

    return data;
  },
};
