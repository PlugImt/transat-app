import useNotifications from "@/hooks/account/useNotifications";
import { Bell, BellRing } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

export function NotificationBell({ service }: { service: string }) {
  const { addNotification, getNotificationEnabled } = useNotifications();

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    getNotificationEnabled(service) || false,
  );

  const handleBellClick = () => {
    addNotification(service).then((r) => {
      setNotificationsEnabled(r);
    });
  };

  return (
    <TouchableOpacity onPress={handleBellClick}>
      {
        // @ts-ignore
        notificationsEnabled ? (
          <BellRing size={24} color="#ec7f32" />
        ) : (
          <Bell size={24} color="#a0aec0" />
        )
      }
    </TouchableOpacity>
  );
}

export default NotificationBell;
