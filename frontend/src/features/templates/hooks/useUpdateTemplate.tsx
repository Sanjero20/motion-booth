import { useMutation, useQueryClient } from "@tanstack/react-query";
import { templateKeys } from "../queries/templates.keys";
import { templatesApi } from "../services/templates.api";
import type { UpdateTemplateRequest } from "../types/template";
import { toast } from "@/components/ui/toast";

interface UpdateTemplatePayload {
  id: string;
  data: UpdateTemplateRequest;
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateTemplatePayload) =>
      templatesApi.update(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });

      queryClient.invalidateQueries({
        queryKey: templateKeys.detail(variables.id),
      });

      toast.add({
        type: "success",
        description: "Template updated successfully!",
      });
    },

    onError: () => {
      toast.add({
        type: "error",
        description: "Failed to update template. Please try again.",
      });
    },
  });
}
