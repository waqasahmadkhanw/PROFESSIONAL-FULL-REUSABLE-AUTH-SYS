import { useCurrentUserQuery } from "../queries/useCurrentUserQuery";
import type { AuthUser } from "../types";

/**
 * Returns the server-authoritative authenticated user.
 * HttpOnly cookies are the credential source; Redux only mirrors lightweight
 * authorization metadata for UI decisions.
 */
export const useCurrentUser = (): AuthUser | null => {
  const { data } = useCurrentUserQuery();
  return data ?? null;
};

export default useCurrentUser;
