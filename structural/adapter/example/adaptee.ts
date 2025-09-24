type S3Object = {
  Bucket: string;
  Key: string;
  Body: Buffer | string;
  ContentType?: string;
};

type GcsObject = {
  bucketName: string;
  filePath: string;
  content: Buffer | string;
  contentType?: string;
};

// Adaptees

export class S3Client {
  async putObject(params: {
    Bucket: string;
    Key: string;
    Body: Buffer | string;
    ContentType?: string;
  }): Promise<void> {
    return await new Promise((resolve) => {
      console.log("[S3] Uploading to S3...: ", params);
      setTimeout(resolve, 100);
    });
  }

  async getObject(params: { Bucket: string; Key: string }): Promise<S3Object> {
    return await new Promise((resolve) => {
      console.log("[S3] Fetching object from S3...: ", params);
      setTimeout(
        () =>
          resolve({
            Bucket: params.Bucket,
            Key: params.Key,
            Body: Buffer.from(JSON.stringify(params)),
          }),
        100
      );
    });
  }

  getSignedUrl(
    operation: string,
    params: { Bucket: string; Key: string; Expires?: number }
  ): string {
    console.log("[S3] Generating signed URL...: ", operation, params);
    return "random-s3-signed-url";
  }
}

export class GcsClient {
  async upload(params: {
    bucketName: string;
    filePath: string;
    content: Buffer | string;
    contentType?: string;
  }): Promise<void> {
    console.log("[GCS] Uploading to GCS...: ", params);
    return await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }

  async download(params: {
    bucketName: string;
    filePath: string;
  }): Promise<GcsObject> {
    return await new Promise((resolve) => {
      console.log("[GCS] Fetching object from GCS...: ", params);
      setTimeout(
        () =>
          resolve({
            bucketName: params.bucketName,
            filePath: params.filePath,
            content: Buffer.from(JSON.stringify(params)),
          }),
        100
      );
    });
  }

  getSignedUrl(params: {
    bucketName: string;
    filePath: string;
    expiresInSec?: number;
  }): string {
    console.log("[GCS] Generating signed URL...: ", params);
    return "random-gcs-signed-url";
  }
}
