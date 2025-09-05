import { describe, expect, it } from "vitest";
import { optimizeHtml } from "../src/optimizer";

describe("optimizeHtml - Basic Functionality", () => {
  it("should remove script tags completely", () => {
    const input = '<div>Content</div><script>alert("test")</script>';
    const expected = "<div>Content</div>";
    expect(optimizeHtml(input)).toBe(expected);
  });

  it("should remove style tags completely", () => {
    const input = "<div>Content</div><style>body{color:red}</style>";
    const expected = "<div>Content</div>";
    expect(optimizeHtml(input)).toBe(expected);
  });

  it("should remove meta tags completely", () => {
    const input = '<meta charset="utf-8"><div>Content</div>';
    const expected = "<div>Content</div>";
    expect(optimizeHtml(input)).toBe(expected);
  });

  it("should remove all attributes by default", () => {
    const input = '<div class="test" id="main">Content</div>';
    const expected = "<div>Content</div>";
    expect(optimizeHtml(input)).toBe(expected);
  });

  it("should remove empty elements", () => {
    const input = "<div>Content</div><div></div><p>   </p>";
    const expected = "<div>Content</div>";
    expect(optimizeHtml(input)).toBe(expected);
  });

  it("should remove HTML comments", () => {
    const input = "<div>Content</div><!-- This is a comment -->";
    const expected = "<div>Content</div>";
    expect(optimizeHtml(input)).toBe(expected);
  });

  it("should normalize whitespace", () => {
    const input = "<div>   Multiple   spaces   </div>";
    const expected = "<div>Multiple spaces</div>";
    expect(optimizeHtml(input)).toBe(expected);
  });
});

describe("optimizeHtml - Options", () => {
  it("should keep attributes when keepAttributes is true", () => {
    const input = '<div class="test" id="main">Content</div>';
    const expected = '<div class="test" id="main">Content</div>';
    expect(optimizeHtml(input, { keepAttributes: true })).toBe(expected);
  });

  it("should preserve empty elements when removeEmpty is false", () => {
    const input = "<div>Content</div><div></div>";
    const expected = "<div>Content</div><div></div>";
    expect(optimizeHtml(input, { removeEmpty: false })).toBe(expected);
  });

  it("should preserve whitespace when preserveWhitespace is true", () => {
    const input = "<div>   Multiple   spaces   </div>";
    const expected = "<div>   Multiple   spaces   </div>";
    expect(optimizeHtml(input, { preserveWhitespace: true })).toBe(expected);
  });

  it("should exclude specified tags from removal", () => {
    const input = "<div>Content</div><script>code</script><style>css</style>";
    const expected = "<div>Content</div><script>code</script>";
    expect(optimizeHtml(input, { excludeTags: ["script"] })).toBe(expected);
  });

  it("should preserve comments when removeComments is false", () => {
    const input = "<div>Content</div><!-- Comment -->";
    const expected = "<div>Content</div><!-- Comment -->";
    expect(optimizeHtml(input, { removeComments: false })).toBe(expected);
  });

  it("should not minify text when minifyText is false", () => {
    const input = "<div>\n  Line breaks\n  and spaces\n</div>";
    const expected = "<div>\n  Line breaks\n  and spaces\n</div>";
    expect(optimizeHtml(input, { minifyText: false })).toBe(expected);
  });
});

describe("optimizeHtml - Edge Cases", () => {
  it("should handle empty string input", () => {
    expect(optimizeHtml("")).toBe("");
  });

  it("should handle whitespace-only input", () => {
    expect(optimizeHtml("   \n\t   ")).toBe("");
  });

  it("should handle malformed HTML", () => {
    const input = "<div><p>Unclosed tags<span>content</div>";
    expect(() => optimizeHtml(input)).not.toThrow();
  });

  it("should handle deeply nested empty elements", () => {
    const input = "<div><p><span></span></p></div><div>Content</div>";
    const expected = "<div>Content</div>";
    expect(optimizeHtml(input)).toBe(expected);
  });

  it("should handle special characters and entities", () => {
    const input = "<div>&lt;&gt;&amp;&quot;&#39;</div>";
    const expected = "<div>&lt;&gt;&amp;&quot;&#39;</div>";
    expect(optimizeHtml(input)).toBe(expected);
  });

  it("should handle very large HTML input", () => {
    const largeContent = "x".repeat(10000);
    const input = `<div>${largeContent}</div>`;
    const result = optimizeHtml(input);
    expect(result).toContain(largeContent);
  });

  it("should handle mixed content types", () => {
    const input = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test</title>
          <style>body { color: red; }</style>
        </head>
        <body>
          <div id="main">
            <h1>Title</h1>
            <!-- Comment -->
            <p>Content</p>
            <script>console.log('test');</script>
          </div>
        </body>
      </html>
    `;
    const result = optimizeHtml(input);
    expect(result).toContain("<h1>Title</h1>");
    expect(result).toContain("<p>Content</p>");
    expect(result).not.toContain("<style>");
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("<!-- Comment -->");
    expect(result).not.toContain('id="main"');
  });

  it("should handle self-closing tags", () => {
    const input = '<div>Content</div><br/><img src="test.jpg"/>';
    const result = optimizeHtml(input);
    expect(result).toContain("<div>Content</div>");
    expect(result).toContain("<br>");
    expect(result).toContain("<img>");
  });

  it("should handle nested tags with same names", () => {
    const input = "<div><div><div>Nested content</div></div></div>";
    const result = optimizeHtml(input);
    expect(result).toBe("<div><div><div>Nested content</div></div></div>");
  });
});
