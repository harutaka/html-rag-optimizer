import { promises as fs } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { optimizeHtmlDir, optimizeHtmlFile } from "../src/utils/file-handler";

const testDir = "/tmp/html-rag-optimizer-test";

describe("File Handler", () => {
  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe("optimizeHtmlFile", () => {
    it("should process single file correctly", async () => {
      const inputPath = join(testDir, "input.html");
      const outputPath = join(testDir, "output.html");
      const inputContent = '<div class="test">Content</div>';
      const expectedContent = "<div>Content</div>";

      await fs.writeFile(inputPath, inputContent);
      await optimizeHtmlFile(inputPath, outputPath);
      const result = await fs.readFile(outputPath, "utf-8");

      expect(result).toBe(expectedContent);
    });

    it("should throw error for non-existent input file", async () => {
      const inputPath = join(testDir, "non-existent.html");
      const outputPath = join(testDir, "output.html");

      await expect(optimizeHtmlFile(inputPath, outputPath)).rejects.toThrow(
        "Input file not found",
      );
    });

    it("should create output directory if it does not exist", async () => {
      const inputPath = join(testDir, "input.html");
      const outputPath = join(testDir, "nested", "dir", "output.html");

      await fs.writeFile(inputPath, "<div>Content</div>");
      await optimizeHtmlFile(inputPath, outputPath);

      const result = await fs.readFile(outputPath, "utf-8");
      expect(result).toBe("<div>Content</div>");
    });
  });

  describe("optimizeHtmlDir", () => {
    it("should process all HTML files in directory", async () => {
      const inputDir = join(testDir, "input");
      const outputDir = join(testDir, "output");

      await fs.mkdir(inputDir, { recursive: true });
      await fs.writeFile(
        join(inputDir, "file1.html"),
        '<div class="test">Content1</div>',
      );
      await fs.writeFile(
        join(inputDir, "file2.html"),
        '<p id="test">Content2</p>',
      );
      await fs.writeFile(
        join(inputDir, "not-html.txt"),
        "This should be ignored",
      );

      await optimizeHtmlDir(inputDir, outputDir);

      const result1 = await fs.readFile(join(outputDir, "file1.html"), "utf-8");
      const result2 = await fs.readFile(join(outputDir, "file2.html"), "utf-8");

      expect(result1).toBe("<div>Content1</div>");
      expect(result2).toBe("<p>Content2</p>");

      // Check that non-HTML file was not processed
      const files = await fs.readdir(outputDir);
      expect(files).not.toContain("not-html.txt");
    });

    it("should preserve directory structure", async () => {
      const inputDir = join(testDir, "input");
      const outputDir = join(testDir, "output");

      await fs.mkdir(join(inputDir, "subdir"), { recursive: true });
      await fs.writeFile(
        join(inputDir, "subdir", "nested.html"),
        '<div class="nested">Nested</div>',
      );

      await optimizeHtmlDir(inputDir, outputDir);

      const result = await fs.readFile(
        join(outputDir, "subdir", "nested.html"),
        "utf-8",
      );
      expect(result).toBe("<div>Nested</div>");
    });
  });
});
