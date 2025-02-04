import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001", { query: { userId: "userId" } });

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for new message notifications
    socket.on("newMessageNotification", ({ senderId, message }) => {
      const newNotification = { senderId, message };
      setNotifications((prev) => [...prev, newNotification]);

      // Optional: Show a browser notification
      if (Notification.permission === "granted") {
        new Notification(`New message from ${senderId}`, { body: message });
      }
    });

    return () => {
      socket.off("newMessageNotification");
    };
  }, []);

  return (
    <div className="notification-container">
      {notifications.length > 0 && (
        <ul>
          {notifications.map((notif, index) => (
            <li key={index}>
              New message from {notif.senderId}: {notif.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
