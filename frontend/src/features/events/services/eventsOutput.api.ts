import api from "@/lib/api/client";

import type {
  EventOutput,
  CreateEventOutputRequest,
} from "../types/eventOutput";

export const eventOutputsApi = {
  create: async (
    eventId: string,
    request: CreateEventOutputRequest,
  ): Promise<EventOutput> => {
    const formData = new FormData();

    formData.append("image", request.image, "output.png");
    formData.append("video", request.video, "output.mp4");

    const { data } = await api.post<EventOutput>(
      `/events/${eventId}/outputs`,
      formData,
    );

    return data;
  },
};
