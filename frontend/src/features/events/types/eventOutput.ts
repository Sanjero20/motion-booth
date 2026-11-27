export interface EventOutput {
  id: string;
  eventId: string;
  imageUrl: string;
  videoUrl: string;
  createdAt: string;
}

export interface CreateEventOutputRequest {
  image: Blob;
  video: Blob;
}
