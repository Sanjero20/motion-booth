import api from "@/lib/api/client";

import type { Event, EventListItem, EventRequest } from "../types/event";

function toFormData(request: EventRequest) {
  const formData = new FormData();

  formData.append("name", request.name);
  formData.append("template", JSON.stringify(request.template));
  formData.append("eventDate", request.eventDate);

  if (request.backgroundImageFile) {
    formData.append("backgroundImageFile", request.backgroundImageFile);
  }

  formData.append(
    "removeBackgroundImage",
    String(request.removeBackgroundImage ?? false),
  );

  return formData;
}

export const eventsApi = {
  getAll: async (): Promise<EventListItem[]> => {
    const { data } = await api.get<EventListItem[]>("/events");
    return data;
  },

  getById: async (id: string): Promise<Event> => {
    const { data } = await api.get<Event>(`/events/${id}`);
    return data;
  },

  create: async (request: EventRequest): Promise<Event> => {
    const { data } = await api.post<Event>("/events", toFormData(request), {});
    return data;
  },

  update: async (id: string, request: EventRequest): Promise<void> => {
    await api.put(`/events/${id}`, toFormData(request));
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },

  getBackground: async (id: string): Promise<Blob> => {
    const { data } = await api.get<Blob>(`/events/${id}/background`, {
      responseType: "blob",
    });

    return data;
  },
};
