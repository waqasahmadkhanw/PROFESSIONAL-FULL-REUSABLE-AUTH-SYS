import { Badge } from "@/shared/components/ui";
import type { AdminUser } from "../types";

interface UserStatusBadgeProps {
  isActivated: boolean;
}

/**
 * Displays the activation status of a user using the
 * semantic color system (success/emerald for active,
 * slate for inactive).
 */
export function UserStatusBadge({
  isActivated,
}: UserStatusBadgeProps) {
  return (
    <Badge variant={isActivated ? "success" : "default"}>
      {isActivated ? "Active" : "Inactive"}
    </Badge>
  );
}

