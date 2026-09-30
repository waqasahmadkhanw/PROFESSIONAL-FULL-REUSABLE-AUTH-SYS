import { useQuery } from "@tanstack/react-query";
import { getRolesApi } from "@/modules/roles/api";
import { AUTH_QUERY_KEYS } from "../constants/auth.query-keys";

export const useRolesQuery = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.ROLES,
    queryFn: () => getRolesApi({ page: 1, limit: 100 }),
    staleTime: 1000 * 60 * 10,
  });
};