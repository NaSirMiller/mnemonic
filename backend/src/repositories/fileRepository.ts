import { File } from "@google-cloud/storage";

import { bucket } from "../firebaseAdmin";

class FileRepository {
  getFileRef(filePath: string): File {
    return bucket.file(filePath);
  }
  async uploadFile(
    fileRef: File,
    content: Buffer | string | Uint8Array
  ): Promise<void> {
    await fileRef.save(content);
  }
  async getFileContent(fileRef: File): Promise<Buffer> {
    const [fileContent]: [Buffer] = await fileRef.download();
    return fileContent;
  }
  async deleteFile(filePath: string): Promise<void> {
    await this.getFileRef(filePath).delete();
  }
  async hasFile(filePath: string) {
    const [exists] = await bucket.file(filePath).exists();
    return exists;
  }
}

export const fileRepo = new FileRepository();
