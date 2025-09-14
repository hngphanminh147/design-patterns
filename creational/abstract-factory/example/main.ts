import { EnterpriseFactory } from "./concretes/enterprise.factory";
import { LeanFactory } from "./concretes/lean.factory";

const selectFactory = (factory: string) => {
  switch (factory) {
    case "lean":
      return new LeanFactory();
    case "enterprise":
      return new EnterpriseFactory();
    default:
      throw new Error("Unknown factory");
  }
};

(async () => {
  const factoryType = process.argv[2] || "lean";
  const factory = selectFactory(factoryType);

  const notifier = factory.createNotifier();
  const auditStore = factory.createAuditStore();
  const templateEngine = factory.createTemplateEngine();

  notifier.send("admin@example.com", "New Notification", {
    message: "This is a notification message.",
  });
  auditStore.append({
    to: "admin@example.com",
    subject: "User logged in.",
    at: new Date(),
  });
  const rendered = await templateEngine.render("Hello, {{name}}!", {
    name: "Hehe",
  });
  console.log(rendered);
})();

// npm run dev creational/abstract-factory/example/main.ts [factoryName]
// npm run dev creational/abstract-factory/example/main.ts enterprise
// npm run dev creational/abstract-factory/example/main.ts lean
