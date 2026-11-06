import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventKeys } from "../queries/events.keys";
import { eventsApi } from "../services/events.api";
import { toast } from "@/components/ui/toast";

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsApi.create,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      toast.add({
        type: "success",
        description: "Event created successfully!",
      });
    },

    onError: () => {
      toast.add({
        type: "error",
        description: "Failed to create event. Please try again.",
      });
    },
  });
}
