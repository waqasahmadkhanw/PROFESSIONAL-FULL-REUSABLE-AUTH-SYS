import axios from "axios";
import { env } from "@/shared/config/env";
import { API_ENDPOINTS } from "./endpoints";

let csrfToken: string | null = null;
let csrfRequest: Promise<string> | null = null;

/** Fetches the double-submit CSRF token once per browser session. */
export async function getCsrfToken(forceRefresh = false): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("CSRF token is only available in the browser");
  }

  if (!forceRefresh && csrfToken) return csrfToken;
  if (csrfRequest) return forceRefresh ? csrfRequest.then(() => getCsrfToken(false)) : csrfRequest;

  csrfRequest = axios
    .get<{ data?: { csrfToken?: string } }>(
      `${env.API_URL}${API_ENDPOINTS.SECURITY.CSRF}`,
      { withCredentials: true, headers: { Accept: "application/json" } },
    )
    .then((response) => {
      const token = response.data?.data?.csrfToken;
      if (!token) throw new Error("CSRF token was not returned by the API");
      csrfToken = token;
      return token;
    })
    .finally(() => {
      csrfRequest = null;
    });

  return csrfRequest;
}

export function clearCsrfToken(): void {
  csrfToken = null;
}
