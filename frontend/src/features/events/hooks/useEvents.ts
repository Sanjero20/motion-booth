import { useQuery } from "@tanstack/react-query";

import { eventKeys } from "../queries/events.keys";
import { eventsApi } from "../services/events.api";

export function useEvents() {
  return useQuery({
    queryKey: eventKeys.lists(),
    queryFn: eventsApi.getAll,
  });
}
