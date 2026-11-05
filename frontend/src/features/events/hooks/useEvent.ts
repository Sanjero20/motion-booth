import { useQuery } from "@tanstack/react-query";
import { eventKeys } from "../queries/events.keys";
import { eventsApi } from "../services/events.api";

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.getById(id),
    enabled: Boolean(id),
  });
}
