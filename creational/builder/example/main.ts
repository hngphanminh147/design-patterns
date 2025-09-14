import { EmailNotificationBuilder } from "./notification.builder";

(() => {
  const builder = new EmailNotificationBuilder();

  const notification1 = builder
    .setTitle("Meeting Reminder")
    .setBody("Don't forget about the meeting at 10 AM.")
    .setSender("Boss <boss@example.com>")
    .addRecipient("employee1@example.com")
    .addRecipient("employee2@example.com")
    .setTimestamp(new Date())
    .build();

  const notification2 = builder
    .setTitle("Project Update")
    .setBody("The project deadline has been extended to next Friday.")
    .setSender("PM <pm@example.com>")
    .addRecipient("employee1@example.com")
    .build();

  console.log(notification1);
  console.log(notification2);
})();
