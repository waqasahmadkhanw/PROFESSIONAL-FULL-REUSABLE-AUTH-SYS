import { useAppSelector } from "@/shared/store";
import { selectIsAuthenticated } from "../store";

/**
 * Authentication state is restored from the backend session cookie and
 * mirrored in Redux. JWTs are never read from browser storage.
 */
export const useIsAuthenticated = (): boolean =>
  useAppSelector(selectIsAuthenticated);

export default useIsAuthenticated;
