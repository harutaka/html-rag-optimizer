import { promises as fs } from "node:fs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { optimizeHtml, optimizeHtmlFile } from "../src/index";
import { cleanupTempFiles, createTempFile } from "./helpers/file-utils";
import {
  generateComplexHtml,
  generateLargeHtml,
  generateMediumHtml,
} from "./helpers/generators";

describe("Performance Tests", () => {
  let tempFiles: string[] = [];

  afterEach(async () => {
    await cleanupTempFiles(tempFiles);
    tempFiles = [];
  });

  it("should process 1MB HTML file within 5 seconds", async () => {
    const largeHtml = generateLargeHtml(1024 * 1024); // 1MB
    const startTime = Date.now();

    const result = optimizeHtml(largeHtml);

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    expect(processingTime).toBeLessThan(5000);
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContain("x");
  });

  it("should handle concurrent file processing efficiently", async () => {
    const files = Array.from(
      { length: 10 },
      (_, i) => `/tmp/perf-test-${i}.html`,
    );
    tempFiles.push(...files);

    // Create test files
    await Promise.all(
      files.map((file) => fs.writeFile(file, generateMediumHtml())),
    );

    const startTime = Date.now();

    await Promise.all(
      files.map((file) =>
        optimizeHtmlFile(file, file.replace(".html", "-opt.html")),
      ),
    );

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    expect(processingTime).toBeLessThan(3000); // Should complete within 3 seconds

    // Verify all files were processed
    for (const file of files) {
      const outputFile = file.replace(".html", "-opt.html");
      tempFiles.push(outputFile);
      const content = await fs.readFile(outputFile, "utf-8");
      expect(content).toContain("Test Title");
      expect(content).not.toContain("class=");
    }
  });

  it("should maintain performance with complex HTML structures", async () => {
    const complexHtml = generateComplexHtml();
    const iterations = 100;

    const startTime = Date.now();

    for (let i = 0; i < iterations; i++) {
      const result = optimizeHtml(complexHtml);
      expect(result.length).toBeGreaterThan(0);
    }

    const endTime = Date.now();
    const processingTime = endTime - startTime;
    const averageTime = processingTime / iterations;

    // Should process each complex HTML in less than 10ms on average
    expect(averageTime).toBeLessThan(10);
  });

  it("should handle deeply nested HTML efficiently", async () => {
    // Create deeply nested HTML (100 levels deep)
    let nestedHtml = "<div>Content</div>";
    for (let i = 0; i < 100; i++) {
      nestedHtml = `<div class="level-${i}" id="nested-${i}">${nestedHtml}</div>`;
    }

    const startTime = Date.now();
    const result = optimizeHtml(nestedHtml);
    const endTime = Date.now();

    const processingTime = endTime - startTime;

    expect(processingTime).toBeLessThan(1000); // Should complete within 1 second
    expect(result).toContain("Content");
    expect(result).not.toContain("class=");
    expect(result).not.toContain("id=");
  });

  it("should scale linearly with input size", async () => {
    const sizes = [10000, 50000, 100000]; // 10KB, 50KB, 100KB
    const times: number[] = [];

    for (const size of sizes) {
      const html = generateLargeHtml(size);
      const startTime = Date.now();
      optimizeHtml(html);
      const endTime = Date.now();
      times.push(endTime - startTime);
    }

    // Processing time should scale reasonably with input size
    // The ratio of time for 100KB vs 10KB should be less than 20x
    const ratio = times[0] > 0 ? times[2] / times[0] : times[2];
    expect(ratio).toBeLessThan(20);
  });

  it("should handle memory efficiently with large inputs", async () => {
    const initialMemory = process.memoryUsage().heapUsed;
    const largeHtml = generateLargeHtml(5 * 1024 * 1024); // 5MB

    const result = optimizeHtml(largeHtml);

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;

    // Memory increase should be less than 3x the input size
    expect(memoryIncrease).toBeLessThan(largeHtml.length * 3);
    expect(result.length).toBeGreaterThan(0);

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  });

  it("should process multiple file types concurrently", async () => {
    const testFiles = [
      { name: "simple.html", content: "<div>Simple content</div>" },
      { name: "medium.html", content: generateMediumHtml() },
      { name: "complex.html", content: generateComplexHtml() },
      { name: "large.html", content: generateLargeHtml(100000) },
    ];

    const inputFiles: string[] = [];
    const outputFiles: string[] = [];

    // Create test files
    for (const testFile of testFiles) {
      const inputPath = await createTempFile(testFile.content);
      const outputPath = inputPath.replace(".html", "-optimized.html");
      inputFiles.push(inputPath);
      outputFiles.push(outputPath);
    }

    tempFiles.push(...inputFiles, ...outputFiles);

    const startTime = Date.now();

    // Process all files concurrently
    await Promise.all(
      inputFiles.map((inputFile, index) =>
        optimizeHtmlFile(inputFile, outputFiles[index]),
      ),
    );

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    expect(processingTime).toBeLessThan(5000); // Should complete within 5 seconds

    // Verify all files were processed correctly
    for (let i = 0; i < outputFiles.length; i++) {
      const content = await fs.readFile(outputFiles[i], "utf-8");
      expect(content.length).toBeGreaterThan(0);
      expect(content).not.toContain("class=");
    }
  });
});
