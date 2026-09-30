import { API_ENDPOINTS } from "@/shared/api/endpoints";

/**
 * User Management Endpoints
 *
 * Re-exports the shared endpoint map for the users module so
 * components/APIs stay decoupled from the shared constants layer.
 */
export const USER_ENDPOINTS = API_ENDPOINTS.USERS;

export default USER_ENDPOINTS;
