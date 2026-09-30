"use client";

import { useAuthSynchronization } from "@/modules/auth/hooks/useAuthSynchronization";

/**
 * App composition boundary for authentication synchronization.
 * Keeping this adapter under app/ prevents shared providers from depending on
 * feature modules while still allowing the auth feature to own its behavior.
 */
export default function AuthSynchronization() {
  useAuthSynchronization();
  return null;
}
