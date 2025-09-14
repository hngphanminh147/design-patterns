import { Notification } from "./notification";

export interface INotificationBuilder {
  setTitle(title: string): this;
  setBody(body: string): this;
  setSender(sender: string): this;
  addRecipient(email: string): this;
  setTimestamp(timestamp: Date): this;
  build(): Notification;
}

export class EmailNotificationBuilder implements INotificationBuilder {
  private notification: Notification;

  constructor() {
    this.notification = new Notification();
  }

  build(): Notification {
    const result = this.notification;
    this.notification = new Notification(); // Reset for next build
    return result;
  }

  setTitle(title: string) {
    this.notification.title = "[EMAIL] " + title;
    return this;
  }
  setBody(body: string) {
    this.notification.body = body;
    return this;
  }

  addRecipient(email: string) {
    this.notification.recipientList.push(email);
    return this;
  }

  setSender(email: string) {
    this.notification.sender = email;
    return this;
  }

  setTimestamp(timestamp: Date) {
    this.notification.timestamp = timestamp;
    return this;
  }
}
