import { JobSpec } from "./job-spec";
import { PrototypeRegistry } from "./prototype";

(() => {
  const base = new JobSpec({
    name: "etl.base",
    steps: [
      { name: "extract", image: "etl:latest", args: ["--source=s3"] },
      { name: "load", image: "loader:latest", args: ["--to=postgres"] },
    ],
  });
  base.labels.set("team", "data");

  const reg = new PrototypeRegistry<JobSpec>();
  reg.register("etl.base", base);

  const usEast = reg.create("etl.base", (j) => {
    j.name = "etl.us-east";
    j.labels.set("region", "us-east-1");
    j.resources = { cpu: "1000m", mem: "1Gi" };
  });

  const heavy = reg.create("etl.base", (j) => {
    j.name = "etl.heavy";
    j.resources = { cpu: "2000m", mem: "4Gi" };
    j.steps.push({
      name: "transform",
      image: "spark:3.5",
      args: ["--mode=heavy"],
    });
  });

  console.log("Base Job Spec:", base);
  console.log("US East Job Spec:", usEast);
  console.log("Heavy Job Spec:", heavy);
})();
