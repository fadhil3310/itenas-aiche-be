import { extname, join } from "node:path";
import sharp from "sharp";

const storageLocation = `${process.env.STORAGE_LOCATION}`;

export async function storeRawBytes(
  bytes: Uint8Array<ArrayBufferLike>,
  fileName: string,
  category: string,
) {
  const fileExtension = extname(fileName);
  const newFileName = crypto.randomUUID().replace(/-/g, "") + fileExtension;
  const path = join(storageLocation, category, newFileName);

  await Bun.write(path, bytes);
  return join(category, newFileName);
}

export async function storeFile(file: File, category: string): Promise<string> {
  return storeRawBytes(await file.bytes(), file.name, category);
}

export async function storeImage(
  file: File,
  category: string,
): Promise<string> {
  const image = sharp(await file.bytes());

  const imageRawBytes = await image.metadata().then(async (metadata) => {
    if (metadata.width > 1280 || metadata.height > 720) {
      return await image.resize({ width: 1280 }).toFormat("avif").toBuffer();
    } else {
      1;
      return await image.toFormat("avif").toBuffer();
    }
  });

  const newFileName = file.name.replace(/\.[^/.]+$/, ".avif");
  return storeRawBytes(imageRawBytes, newFileName, category);
}

export function deleteFile(path: string) {
  const fullPath = join(storageLocation, path);
  const file = Bun.file(fullPath);

  file.delete();
}