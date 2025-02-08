import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  message: string;
  time: string;
  type: "info" | "warning" | "success";
  isRead: boolean;
}

interface NotificationsProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

const defaultNotifications: Notification[] = [
  {
    id: "1",
    message: "New shift request from John Doe",
    time: "2 mins ago",
    type: "info",
    isRead: false,
  },
  {
    id: "2",
    message: "Urgent: Staff shortage in evening shift",
    time: "10 mins ago",
    type: "warning",
    isRead: false,
  },
  {
    id: "3",
    message: "Monthly schedule published",
    time: "1 hour ago",
    type: "success",
    isRead: true,
  },
];

export default function Notifications({
  notifications = defaultNotifications,
  onMarkAsRead = () => {},
  onDismiss = () => {},
}: NotificationsProps) {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="w-[380px] bg-white rounded-lg shadow-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {notifications.filter((n) => !n.isRead).length} unread
        </span>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${getTypeStyles(
                notification.type,
              )} relative ${!notification.isRead ? "font-medium" : "opacity-75"}`}
            >
              <p className="text-sm pr-12">{notification.message}</p>
              <span className="text-xs mt-1 block opacity-70">
                {notification.time}
              </span>
              <div className="absolute right-2 top-2 flex items-center gap-1">
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-blue-200"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-blue-200"
                  onClick={() => onDismiss(notification.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
