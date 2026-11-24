import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "../services/events.api";
import { eventKeys } from "../queries/events.keys";
import { toast } from "@/components/ui/toast";
import type { EventRequest } from "../types/event";

interface UpdateEventPayload {
  id: string;
  data: EventRequest;
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

      queryClient.invalidateQueries({
        queryKey: eventKeys.background(variables.id),
      });

      toast.add({
        type: "success",
        description: "Event updated successfully!",
      });
    },

    onError: () => {
      toast.add({
        type: "error",
        description: "Failed to update event. Please try again.",
      });
    },
  });
}
