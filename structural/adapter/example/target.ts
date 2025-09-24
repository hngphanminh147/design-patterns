export interface IFileStoragePort {
  put(
    filePath: string,
    content: string | Buffer,
    contentType?: string
  ): Promise<void>;
  get(filePath: string): Promise<Buffer>;
  url(filePath: string, expiresInSec?: number): string;
}

export type FileStorageErrorCode =
  | "NotFound"
  | "Unauthorized"
  | "Unavailable"
  | "InvalidArgument"
  | "Unknown";

export class FileStorageError extends Error {
  constructor(
    message: string,
    public readonly code: FileStorageErrorCode,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "FileStorageError";
  }
}
