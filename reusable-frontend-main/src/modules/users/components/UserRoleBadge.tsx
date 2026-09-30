import { Badge } from "@/shared/components/ui";
import type { UserRole } from "../types";

interface UserRoleBadgeProps {
  role: UserRole;
}

const variantByRole: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  admin: "danger",
  manager: "warning",
  staff: "info",
  user: "default",
  guest: "default",
};

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const normalized = String(role || "user").toLowerCase();
  const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  return <Badge variant={variantByRole[normalized] ?? "default"}>{label}</Badge>;
}
