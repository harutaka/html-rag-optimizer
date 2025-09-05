import { promises as fs } from "node:fs";

export async function createTempFile(content: string): Promise<string> {
  const tempPath = `/tmp/test-${Date.now()}-${Math.random()}.html`;
  await fs.writeFile(tempPath, content);
  return tempPath;
}

export async function cleanupTempFiles(paths: string[]): Promise<void> {
  await Promise.all(
    paths.map(
      (path) => fs.unlink(path).catch(() => {}), // Ignore errors
    ),
  );
}
