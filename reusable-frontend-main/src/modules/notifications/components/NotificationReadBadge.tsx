import { Badge } from "@/shared/components/ui";

interface NotificationReadBadgeProps {
  isRead: boolean;
}

export function NotificationReadBadge({ isRead }: NotificationReadBadgeProps) {
  return isRead ? (
    <Badge variant="default">Read</Badge>
  ) : (
    <Badge variant="info">Unread</Badge>
  );
}
