import { GcsClient, S3Client } from "./adaptee";
import { IFileStoragePort } from "./target";

export class AWSS3StorageAdapter implements IFileStoragePort {
  constructor(private s3Client: S3Client, private bucketName: string) {}
  async put(
    filePath: string,
    content: string | Buffer,
    contentType?: string
  ): Promise<void> {
    return await this.s3Client.putObject({
      Bucket: this.bucketName,
      Key: filePath,
      Body: content,
      ContentType: contentType,
    });
  }
  async get(filePath: string): Promise<Buffer> {
    const data = await this.s3Client.getObject({
      Bucket: this.bucketName,
      Key: filePath,
    });
    return Buffer.isBuffer(data.Body) ? data.Body : Buffer.from(data.Body);
  }
  url(filePath: string, expiresInSec?: number): string {
    return this.s3Client.getSignedUrl("getObject", {
      Bucket: this.bucketName,
      Key: filePath,
      Expires: expiresInSec,
    });
  }
}

export class GCSStorageAdapter implements IFileStoragePort {
  constructor(private gcsClient: GcsClient, private bucketName: string) {}
  async put(
    filePath: string,
    content: string | Buffer,
    contentType?: string
  ): Promise<void> {
    return await this.gcsClient.upload({
      bucketName: this.bucketName,
      filePath: filePath,
      content: content,
      contentType: contentType,
    });
  }
  async get(filePath: string): Promise<Buffer> {
    const data = await this.gcsClient.download({
      bucketName: this.bucketName,
      filePath: filePath,
    });
    return Buffer.isBuffer(data.content)
      ? data.content
      : Buffer.from(data.content);
  }
  url(filePath: string, expiresInSec?: number): string {
    return this.gcsClient.getSignedUrl({
      bucketName: this.bucketName,
      filePath: filePath,
      expiresInSec: expiresInSec,
    });
  }
}
