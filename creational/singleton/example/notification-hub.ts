import { IChannel } from "./channel";

export type TNotification = {
  title: string;
  message: string;
};

export class NotificationHub {
  private static instance: NotificationHub;
  private static channels: IChannel[] = [];
  private static initPromise: Promise<NotificationHub> | null = null;

  private constructor(channels: IChannel[] = []) {
    NotificationHub.channels = channels;
  }

  public static async getInstance(
    channels: IChannel[] = []
  ): Promise<NotificationHub> {
    if (NotificationHub.instance) {
      return NotificationHub.instance;
    }

    if (!NotificationHub.initPromise) {
      this.initPromise = (async () => {
        // Simulate async initialization, e.g., loading config or connecting to a service
        await new Promise((resolve) => setTimeout(resolve, 1000));
        NotificationHub.instance = new NotificationHub(channels);
        NotificationHub.initPromise = null; // Clear the promise after initialization
        return NotificationHub.instance;
      })();
    }

    return this.initPromise!;
  }

  registerChannel(channel: IChannel): void {
    NotificationHub.channels.push(channel);
  }

  sendNotification(notification: TNotification): void {
    Promise.allSettled(
      NotificationHub.channels.map((channel) => {
        channel.send(notification);
      })
    )
      .then(() => console.log("All notifications sent successfully"))
      .catch((error) => {
        console.error("Error sending notifications:", error);
      });
  }
}
