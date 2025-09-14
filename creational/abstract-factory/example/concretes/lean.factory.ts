import {
  AbstractFactory,
  IAuditStore,
  INotifier,
  ITemplateEngine,
} from "../abstract";

class ConsoleNotifier implements INotifier {
  send(to: string, subject: string, model: any): void {
    console.log(`Console Notifier: ${subject} - ${JSON.stringify(model)}`);
  }
}

class FileAuditStore implements IAuditStore {
  append(entry: { to: string; subject: string; at: Date }): void {
    console.log(`File Audit Log: ${JSON.stringify(entry)}`);
  }
}

class HandlebarsTemplate implements ITemplateEngine {
  async render(template: string, context: object): Promise<string> {
    return `Handlebars Rendered Template with context: ${JSON.stringify(
      context
    )}`;
  }
}

// Concrete Factory for Lean Products
export class LeanFactory implements AbstractFactory {
  createNotifier(): INotifier {
    return new ConsoleNotifier();
  }

  createAuditStore(): IAuditStore {
    return new FileAuditStore();
  }

  createTemplateEngine(): ITemplateEngine {
    return new HandlebarsTemplate();
  }
}
