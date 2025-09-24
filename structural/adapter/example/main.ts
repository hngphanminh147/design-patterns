import { createFileStorage, StorageConfig, StorageProviders } from "./client";

(async () => {
  const type = (process.argv[2] || "s3") as StorageProviders;
  const config: StorageConfig = {
    type,
    bucketName: "my-bucket",
    client: {},
  };
  const storage = createFileStorage(config);
  const fileName = "file.txt";

  storage.put(fileName, "Hello, World!");
  const buf = await storage.get(fileName);
  console.log("Read: ", buf.toString());
  const link = storage.url(fileName, 3600);
  console.log("URL: ", link);
})();
