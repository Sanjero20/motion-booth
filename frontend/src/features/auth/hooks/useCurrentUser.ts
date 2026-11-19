import { useQuery } from "@tanstack/react-query";
import { authKeys } from "../queries/auth.keys";
import { authApi } from "../services/auth.api";

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: authApi.getCurrentUser,
    retry: false,
  });
}
