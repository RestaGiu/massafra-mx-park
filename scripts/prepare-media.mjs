import { readFile, mkdir, copyFile, constants, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const root = process.cwd();
const { assets } = JSON.parse(
  await readFile(path.join(root, "content/image-generation.json"), "utf8"),
);
await mkdir(path.join(root, "output/imagegen"), { recursive: true });
await mkdir(path.join(root, "public/media"), { recursive: true });
for (const asset of assets) {
  const original = path.join(root, asset.original);
  try {
    await stat(original);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await copyFile(asset.source, original, constants.COPYFILE_EXCL);
  }
  const target = path.join(root, "public", asset.output);
  await sharp(original).webp({ quality: 86, effort: 6 }).toFile(target);
  const info = await sharp(target).metadata();
  console.log(
    `${asset.key}: ${info.width}x${info.height}, ${Math.round((await stat(target)).size / 1024)} KB`,
  );
}
// The Open Graph renderer consumes JPEG/PNG rather than WebP.
await sharp(path.join(root, "output/imagegen/hero-ai.png"))
  .jpeg({ quality: 90 })
  .toFile(path.join(root, "public/media/hero-social.jpg"));
