import { useQuery } from "@tanstack/react-query";
import { templateKeys } from "../queries/templates.keys";
import { templatesApi } from "../services/templates.api";

export function useTemplates() {
  return useQuery({
    queryKey: templateKeys.lists(),
    queryFn: templatesApi.getAll,
  });
}
