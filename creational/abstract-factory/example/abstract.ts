// Product Interfaces
export interface INotifier {
  send(to: string, subject: string, model: any): void;
}

export interface IAuditStore {
  append(entry: { to: string; subject: string; at: Date }): void;
}

export interface ITemplateEngine {
  render(template: string, context: object): Promise<string>;
}

// Abstract Factory Interface
export interface AbstractFactory {
  createNotifier(): INotifier;
  createAuditStore(): IAuditStore;
  createTemplateEngine(): ITemplateEngine;
}
