export interface Event {
  id: string;
  name: string;
  eventDate: string;
  createdAt: string;
}

export interface CreateEventRequest {
  name: string;
  eventDate: string;
}

export interface UpdateEventRequest {
  name: string;
  eventDate: string;
}
