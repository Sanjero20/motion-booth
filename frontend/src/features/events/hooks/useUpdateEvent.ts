import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "../services/events.api";
import type { UpdateEventRequest } from "../types/event";
import { eventKeys } from "../queries/events.keys";
import { toast } from "@/components/ui/toast";

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
