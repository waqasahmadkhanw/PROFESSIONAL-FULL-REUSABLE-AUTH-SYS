import { Badge } from "@/shared/components/ui";
import type { NotificationType } from "../types";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

/** Maps each notification type to a semantic badge variant/color. */
const TYPE_META: Record<string, { label: string; variant: BadgeVariant }> = {
  system: { label: "System", variant: "info" },
  announcement: { label: "Announcement", variant: "default" },
  payment: { label: "Payment", variant: "success" },
  message: { label: "Message", variant: "default" },
};

interface NotificationTypeBadgeProps {
  type: NotificationType;
}

export function NotificationTypeBadge({ type }: NotificationTypeBadgeProps) {
  const meta = TYPE_META[type] ?? { label: type, variant: "default" as BadgeVariant };
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
