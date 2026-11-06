import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "../services/events.api";
import { eventKeys } from "../queries/events.keys";
import { toast } from "@/components/ui/toast";

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsApi.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.all,
      });

      toast.add({
        type: "success",
        description: "Event deleted successfully!",
      });
    },

    onError: () => {
      toast.add({
        type: "error",
        description: "Failed to delete event. Please try again.",
      });
    },
  });
}
