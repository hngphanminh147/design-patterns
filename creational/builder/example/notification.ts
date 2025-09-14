export class Notification {
  constructor(
    public title: string = "",
    public body: string = "",
    public recipientList: string[] = [],
    public sender: string = "",
    public timestamp: Date = new Date()
  ) {}
}
