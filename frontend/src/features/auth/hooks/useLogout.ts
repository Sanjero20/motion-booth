import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../services/auth.api";
import { authKeys } from "../queries/auth.keys";
import { toast } from "@/components/ui/toast";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: authKeys.all,
      });

      toast.add({
        type: "success",
        title: "Logged out successfully",
        description: "You have been signed out.",
      });
    },

    onError: (error) => {
      toast.add({
        type: "error",
        title: "Logout failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
}
