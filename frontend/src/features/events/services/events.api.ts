import api from "@/lib/api/client";

import type {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
} from "../types/event";

export const eventsApi = {
  getAll: async (): Promise<Event[]> => {
    const { data } = await api.get<Event[]>("/events");
    return data;
  },

  getById: async (id: string): Promise<Event> => {
    const { data } = await api.get<Event>(`/events/${id}`);
    return data;
  },

  create: async (request: CreateEventRequest): Promise<Event> => {
    const { data } = await api.post<Event>("/events", request);
    return data;
  },

  update: async (id: string, request: UpdateEventRequest): Promise<void> => {
    await api.put(`/events/${id}`, request);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};
