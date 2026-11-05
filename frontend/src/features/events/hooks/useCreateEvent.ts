import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventKeys } from "../queries/events.keys";
import { eventsApi } from "../services/events.api";

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.all,
      });
    },
  });
}
