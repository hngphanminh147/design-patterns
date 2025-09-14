import { Prototype } from "./prototype";

export class JobSpec implements Prototype<JobSpec> {
  name: string = "default-job";
  retries: number = 3;
  backoffSec: number = 10;
  resources: { cpu: string; mem: string } = { cpu: "500m", mem: "128Mi" };
  labels: Map<string, string> = new Map();
  steps: Array<{ name: string; image: string; args: string[] }> = [];

  constructor(init?: Partial<JobSpec>) {
    Object.assign(this, init);
    if (init?.resources) this.resources = { ...init.resources };
    if (init?.labels) this.labels = new Map(init.labels);
    if (init?.steps) this.steps = init.steps.map((step) => ({ ...step }));
  }

  clone(): JobSpec {
    return new JobSpec({
      name: this.name,
      retries: this.retries,
      backoffSec: this.backoffSec,
      // Deep clone where it matters: arrays of objects, Map, optional nested objects.
      resources: { ...this.resources },
      labels: new Map(this.labels),
      steps: this.steps.map((step) => ({ ...step })),
    });
  }
}
