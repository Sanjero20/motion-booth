import { useMutation, useQueryClient } from "@tanstack/react-query";
import { templatesApi } from "../services/templates.api";
import { templateKeys } from "../queries/templates.keys";
import { toast } from "@/components/ui/toast";

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: templatesApi.create,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      toast.add({
        type: "success",
        description: "Template created successfully!",
      });
    },

    onError: () => {
      toast.add({
        type: "error",
        description: "Failed to create template. Please try again.",
      });
    },
  });
}
