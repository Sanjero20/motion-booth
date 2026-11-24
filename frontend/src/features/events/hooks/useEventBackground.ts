import { useQuery } from "@tanstack/react-query";

import { eventsApi } from "../services/events.api";
import { eventKeys } from "../queries/events.keys";

export function useEventBackground(id: string, enabled = true) {
  return useQuery({
    queryKey: eventKeys.background(id),
    queryFn: () => eventsApi.getBackground(id),
    enabled: Boolean(id) && enabled,
    staleTime: Infinity,
    retry: false,
  });
}
