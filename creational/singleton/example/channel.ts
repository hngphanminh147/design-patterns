import { TNotification } from "./notification-hub";

export interface IChannel {
  send(message: TNotification): void;
}

export class EmailChannel implements IChannel {
  send(message: TNotification): void {
    console.log(
      `[EmailChannel]: {title: ${message.title}, message: ${message.message}}`
    );
  }
}

export class SMSChannel implements IChannel {
  send(message: TNotification): void {
    console.log(
      `[SMSChannel]: {title: ${message.title}, message: ${message.message}}`
    );
  }
}
