import { EmailChannel, SMSChannel } from "./channel";
import { NotificationHub } from "./notification-hub";

(async () => {
  const hub = await NotificationHub.getInstance();
  hub.registerChannel(new EmailChannel());
  hub.registerChannel(new SMSChannel());

  hub.sendNotification({
    title: "Test Notification",
    message: "This is a test notification message.",
  });
})();

// npm run dev creational/singleton/example/main.ts
