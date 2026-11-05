import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "../services/events.api";
import type { UpdateEventRequest } from "../types/event";
import { eventKeys } from "../queries/events.keys";

interface UpdateEventPayload {
  id: string;
  data: UpdateEventRequest;
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateEventPayload) =>
      eventsApi.update(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });

      queryClient.invalidateQueries({
        queryKey: eventKeys.detail(variables.id),
      });
    },
  });
}
