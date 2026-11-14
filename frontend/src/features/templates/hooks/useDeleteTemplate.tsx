import { useMutation, useQueryClient } from "@tanstack/react-query";
import { templatesApi } from "../services/templates.api";
import { templateKeys } from "../queries/templates.keys";
import { toast } from "@/components/ui/toast";

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: templatesApi.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });

      toast.add({
        type: "success",
        description: "Template deleted successfully!",
      });
    },

    onError: () => {
      toast.add({
        type: "error",
        description: "Failed to delete template. Please try again.",
      });
    },
  });
}
