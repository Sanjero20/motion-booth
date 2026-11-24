import { useQuery } from "@tanstack/react-query";
import { templatesApi } from "../services/templates.api";
import { templateKeys } from "../queries/templates.keys";

export function useTemplateBackground(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: templateKeys.background(id),
    queryFn: () => templatesApi.getBackground(id),
    enabled: !!id && enabled,
    staleTime: Infinity,
    retry: false,
  });
}
