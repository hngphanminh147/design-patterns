import {
  AbstractFactory,
  IAuditStore,
  INotifier,
  ITemplateEngine,
} from "../abstract";

class SlackNotifier implements INotifier {
  send(to: string, subject: string, model: any): void {
    console.log(`Slack Notifier: ${subject} - ${JSON.stringify(model)}`);
  }
}

class S3AuditStore implements IAuditStore {
  append(entry: { to: string; subject: string; at: Date }): void {
    console.log(`S3 Audit Log: ${JSON.stringify(entry)}`);
  }
}

class EjsTemplate implements ITemplateEngine {
  async render(template: string, context: object): Promise<string> {
    return `EJS Rendered Template with context: ${JSON.stringify(context)}`;
  }
}

export class EnterpriseFactory implements AbstractFactory {
  createNotifier(): INotifier {
    return new SlackNotifier();
  }

  createAuditStore(): IAuditStore {
    return new S3AuditStore();
  }

  createTemplateEngine(): ITemplateEngine {
    return new EjsTemplate();
  }
}
