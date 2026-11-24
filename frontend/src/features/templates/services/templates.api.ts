import api from "@/lib/api/client";

import type { SaveTemplateRequest, Template } from "../types/template";

function toFormData(request: SaveTemplateRequest): FormData {
  const formData = new FormData();

  formData.append("name", request.name);
  formData.append("layout", JSON.stringify(request.layout));
  formData.append("slots", JSON.stringify(request.slots));

  if (request.backgroundImageFile) {
    formData.append("backgroundImageFile", request.backgroundImageFile);
  }

  formData.append(
    "removeBackgroundImage",
    String(request.removeBackgroundImage ?? false),
  );

  return formData;
}

export const templatesApi = {
  getAll: async (): Promise<Template[]> => {
    const { data } = await api.get<Template[]>("/templates");
    return data;
  },

  getById: async (id: string): Promise<Template> => {
    const { data } = await api.get<Template>(`/templates/${id}`);
    return data;
  },

  create: async (request: SaveTemplateRequest): Promise<Template> => {
    const { data } = await api.post("/templates", toFormData(request));
    return data;
  },

  update: async (id: string, request: SaveTemplateRequest): Promise<void> => {
    const { data } = await api.put(`/templates/${id}`, toFormData(request));
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/templates/${id}`);
  },

  getBackground: async (id: string): Promise<Blob> => {
    const { data } = await api.get<Blob>(`/templates/${id}/background`, {
      responseType: "blob",
    });

    return data;
  },
};
