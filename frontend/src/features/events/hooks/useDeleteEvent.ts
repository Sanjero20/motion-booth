import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "../services/events.api";
import { eventKeys } from "../queries/events.keys";

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.all,
      });
    },
  });
}
