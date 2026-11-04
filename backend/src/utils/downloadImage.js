import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const imageExtensions = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const getImagesDirectory = () => {
  const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(currentDirectory, "../../../public/images/bikes");
};

export const downloadImage = async (imageUrl, name = "bike") => {
  let parsedUrl;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    throw new Error("Enter a valid image URL.");
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new Error("Image URL must use http or https.");
  }

  const response = await fetch(parsedUrl, { redirect: "error" });
  if (!response.ok) throw new Error(`Image download failed with status ${response.status}.`);

  const contentType = response.headers.get("content-type")?.split(";")[0].toLowerCase();
  const extension = imageExtensions[contentType];
  if (!extension) throw new Error("The URL must point to a JPG, PNG, WEBP, or GIF image.");

  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > MAX_IMAGE_BYTES) throw new Error("Image must be smaller than 10 MB.");

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > MAX_IMAGE_BYTES) throw new Error("Image must be smaller than 10 MB.");

  const safeName = String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "bike";
  const filename = `${safeName}-${crypto.randomBytes(5).toString("hex")}${extension}`;
  const directory = getImagesDirectory();
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, filename), buffer);

  return `/images/bikes/${filename}`;
};
