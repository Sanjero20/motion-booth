import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../services/auth.api";
import { authKeys } from "../queries/auth.keys";
import { toast } from "@/components/ui/toast";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.currentUser(), user);

      toast.add({
        type: "success",
        title: "Login successful",
        description: "Welcome back!",
      });
    },

    onError: (error) => {
      toast.add({
        type: "error",
        title: "Login failed",
        description: error.message || "Invalid email or password",
      });
    },
  });
}
