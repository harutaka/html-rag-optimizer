import { promises as fs } from "node:fs";
import { dirname, extname, join } from "node:path";
import { optimizeHtml } from "../optimizer";
import type { OptimizeOptions } from "../types";

export async function optimizeHtmlFile(
  inputPath: string,
  outputPath: string,
  options?: OptimizeOptions,
): Promise<void> {
  try {
    const inputContent = await fs.readFile(inputPath, "utf-8");
    const optimizedContent = optimizeHtml(inputContent, options);

    // Create output directory if it doesn't exist
    const outputDir = dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });

    await fs.writeFile(outputPath, optimizedContent, "utf-8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Input file not found: ${inputPath}`);
    }
    throw error;
  }
}

export async function optimizeHtmlDir(
  inputDir: string,
  outputDir: string,
  options?: OptimizeOptions,
): Promise<void> {
  await processDirectory(inputDir, outputDir, options);
}

async function processDirectory(
  inputDir: string,
  outputDir: string,
  options?: OptimizeOptions,
  relativePath = "",
): Promise<void> {
  const currentInputDir = join(inputDir, relativePath);
  const currentOutputDir = join(outputDir, relativePath);

  await fs.mkdir(currentOutputDir, { recursive: true });

  const entries = await fs.readdir(currentInputDir, { withFileTypes: true });

  for (const entry of entries) {
    const inputPath = join(currentInputDir, entry.name);
    const outputPath = join(currentOutputDir, entry.name);
    const entryRelativePath = join(relativePath, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(inputDir, outputDir, options, entryRelativePath);
    } else if (
      entry.isFile() &&
      extname(entry.name).toLowerCase() === ".html"
    ) {
      await optimizeHtmlFile(inputPath, outputPath, options);
    }
  }
}
