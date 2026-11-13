import { useQuery } from "@tanstack/react-query";
import { templateKeys } from "../queries/templates.keys";
import { templatesApi } from "../services/templates.api";

export function useTemplate(id: string) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => templatesApi.getById(id),
    enabled: Boolean(id),
  });
}
