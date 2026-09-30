import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { AUTH_QUERY_KEYS } from "../constants/auth.query-keys";

export const useSessionQuery = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.SESSION,
    queryFn: authService.getSession,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};