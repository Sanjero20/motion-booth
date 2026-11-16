import type { EventTemplate } from "@/features/templates/types/template";

export interface Event {
  id: string;
  name: string;
  template: EventTemplate;
  eventDate: string;
  createdAt: string;
}

export interface CreateEventRequest {
  name: string;
  template: EventTemplate;
  eventDate: string;
}

export interface UpdateEventRequest {
  name: string;
  template: EventTemplate;
  eventDate: string;
}
