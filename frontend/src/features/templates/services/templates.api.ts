import api from "@/lib/api/client";

import type {
  CreateTemplateRequest,
  Template,
  UpdateTemplateRequest,
} from "../types/template";

export const templatesApi = {
  getAll: async (): Promise<Template[]> => {
    const { data } = await api.get<Template[]>("/templates");
    return data;
  },

  getById: async (id: string): Promise<Template> => {
    const { data } = await api.get<Template>(`/templates/${id}`);
    return data;
  },

  create: async (request: CreateTemplateRequest): Promise<Template> => {
    const { data } = await api.post("/templates", request);
    return data;
  },

  update: async (id: string, request: UpdateTemplateRequest): Promise<void> => {
    const { data } = await api.put(`/templates/${id}`, request);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/templates/${id}`);
  },
};
