import { GcsClient, S3Client } from "./adaptee";
import { AWSS3StorageAdapter, GCSStorageAdapter } from "./adapter";

export enum StorageProviders {
  S3 = "s3",
  GCS = "gcs",
}

export interface StorageConfig {
  type: StorageProviders;
  bucketName: string;
  client?: any;
}

export const createFileStorage = (config: StorageConfig) => {
  switch (config.type) {
    case StorageProviders.S3:
      return new AWSS3StorageAdapter(new S3Client(), config.bucketName);
    case StorageProviders.GCS:
      return new GCSStorageAdapter(new GcsClient(), config.bucketName);
  }
};
