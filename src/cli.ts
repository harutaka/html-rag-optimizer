import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { optimizeHtmlDir, optimizeHtmlFile } from "./index";
import type { OptimizeOptions } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CliOptions {
  output?: string;
  inputDir?: string;
  outputDir?: string;
  keepAttributes?: boolean;
  excludeTags?: string;
  preserveWhitespace?: boolean;
  config?: string;
}

export async function runCli(args: string[] = process.argv): Promise<void> {
  const program = new Command();

  // Read package.json for version
  const packageJson = JSON.parse(
    await fs.readFile(resolve(__dirname, "../package.json"), "utf-8"),
  );

  program
    .name("html-rag-optimizer")
    .description(
      "HTML optimization tool for RAG (Retrieval-Augmented Generation) systems",
    )
    .version(packageJson.version)
    .argument("[input]", "Input HTML file")
    .option("-o, --output <path>", "Output file or directory")
    .option("--input-dir <path>", "Input directory")
    .option("--output-dir <path>", "Output directory")
    .option("--keep-attributes", "Keep tag attributes")
    .option(
      "--exclude-tags <tags>",
      "Exclude tags from removal (comma-separated)",
    )
    .option("--preserve-whitespace", "Preserve whitespace")
    .option("--config <path>", "Configuration file path")
    .action(async (input: string, options: CliOptions) => {
      try {
        await handleCliAction(input, options);
      } catch (error) {
        console.error("Error:", (error as Error).message);
        process.exit(1);
      }
    });

  await program.parseAsync(args);
}

async function handleCliAction(
  input: string,
  options: CliOptions,
): Promise<void> {
  // Build optimization options
  const optimizeOptions: OptimizeOptions = {
    keepAttributes: options.keepAttributes || false,
    excludeTags: options.excludeTags
      ? options.excludeTags.split(",").map((tag) => tag.trim())
      : [],
    preserveWhitespace: options.preserveWhitespace || false,
  };

  // Load config file if specified
  if (options.config) {
    const configContent = await fs.readFile(options.config, "utf-8");
    const config = JSON.parse(configContent);
    Object.assign(optimizeOptions, config);
  }

  // Handle directory processing
  if (options.inputDir && options.outputDir) {
    await optimizeHtmlDir(options.inputDir, options.outputDir, optimizeOptions);
    console.log(
      `Directory optimization completed: ${options.inputDir} -> ${options.outputDir}`,
    );
    return;
  }

  // Handle single file processing
  if (!input) {
    throw new Error("Input file or --input-dir is required");
  }

  if (!options.output) {
    throw new Error("Output file (-o) is required for single file processing");
  }

  await optimizeHtmlFile(input, options.output, optimizeOptions);
  console.log(`Optimization completed: ${input} -> ${options.output}`);
}

// Export for testing
export { handleCliAction };
