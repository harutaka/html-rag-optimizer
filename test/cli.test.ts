import { exec } from "node:child_process";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const execAsync = promisify(exec);
const testDir = "/tmp/html-rag-optimizer-cli-test";

describe("CLI Interface", () => {
  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it("should process single file via CLI", async () => {
    const tempInput = join(testDir, "cli-input.html");
    const tempOutput = join(testDir, "cli-output.html");

    await fs.writeFile(tempInput, '<div class="test">CLI Test</div>');

    const { stdout, stderr } = await execAsync(
      `node bin/cli.js ${tempInput} -o ${tempOutput}`,
    );

    expect(stderr).toBe("");
    expect(stdout).toContain("Optimization completed");

    const result = await fs.readFile(tempOutput, "utf-8");
    expect(result).toBe("<div>CLI Test</div>");
  });

  it("should handle CLI options correctly", async () => {
    const tempInput = join(testDir, "cli-options-input.html");
    const tempOutput = join(testDir, "cli-options-output.html");

    await fs.writeFile(
      tempInput,
      '<div class="keep">Content</div><script>remove</script>',
    );

    await execAsync(
      `node bin/cli.js ${tempInput} -o ${tempOutput} --keep-attributes --exclude-tags script`,
    );

    const result = await fs.readFile(tempOutput, "utf-8");
    expect(result).toBe(
      '<div class="keep">Content</div><script>remove</script>',
    );
  });

  it("should show help when --help flag is used", async () => {
    const { stdout } = await execAsync("node bin/cli.js --help");
    expect(stdout).toContain("Usage:");
    expect(stdout).toContain("Options:");
  });

  it("should show version when --version flag is used", async () => {
    const { stdout } = await execAsync("node bin/cli.js --version");
    expect(stdout).toMatch(/\d+\.\d+\.\d+/);
  });

  it("should handle directory processing via CLI", async () => {
    const tempInputDir = join(testDir, "cli-input-dir");
    const tempOutputDir = join(testDir, "cli-output-dir");

    await fs.mkdir(tempInputDir, { recursive: true });
    await fs.writeFile(
      join(tempInputDir, "test.html"),
      '<div class="test">Dir Test</div>',
    );

    await execAsync(
      `node bin/cli.js --input-dir ${tempInputDir} --output-dir ${tempOutputDir}`,
    );

    const result = await fs.readFile(join(tempOutputDir, "test.html"), "utf-8");
    expect(result).toBe("<div>Dir Test</div>");
  });

  it("should handle --keep-tags option", async () => {
    const tempInput = join(testDir, "keep-tags-input.html");
    const tempOutput = join(testDir, "keep-tags-output.html");

    await fs.writeFile(
      tempInput,
      "<div>Content</div><p>Keep</p><span>Remove</span>",
    );

    await execAsync(
      `node bin/cli.js ${tempInput} -o ${tempOutput} --keep-tags div,p`,
    );

    const result = await fs.readFile(tempOutput, "utf-8");
    expect(result).toBe("<div>Content</div><p>Keep</p>");
  });

  it("should handle --preserve-whitespace option", async () => {
    const tempInput = join(testDir, "whitespace-input.html");
    const tempOutput = join(testDir, "whitespace-output.html");

    await fs.writeFile(tempInput, "<div>   Multiple   spaces   </div>");

    await execAsync(
      `node bin/cli.js ${tempInput} -o ${tempOutput} --preserve-whitespace`,
    );

    const result = await fs.readFile(tempOutput, "utf-8");
    expect(result).toBe("<div>   Multiple   spaces   </div>");
  });

  it("should handle error for non-existent input file", async () => {
    const tempOutput = join(testDir, "output.html");
    const nonExistentInput = join(testDir, "non-existent.html");

    await expect(
      execAsync(`node bin/cli.js ${nonExistentInput} -o ${tempOutput}`),
    ).rejects.toThrow();
  });
});
