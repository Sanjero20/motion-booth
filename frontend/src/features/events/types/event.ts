import type { EventTemplate } from "@/features/templates/types/template";

export interface EventListItem {
  id: string;
  name: string;
  eventDate: string;
  createdAt: string;
}

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
