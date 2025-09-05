import { type HTMLElement, parse } from "node-html-parser";
import type { OptimizeOptions } from "./types";

const DEFAULT_OPTIONS: Required<OptimizeOptions> = {
  keepAttributes: false,
  removeEmpty: true,
  preserveWhitespace: false,
  excludeTags: [],
  keepTags: [],
  removeComments: true,
  minifyText: true,
};

export function optimizeHtml(
  html: string,
  options: OptimizeOptions = {},
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (!html.trim()) {
    return "";
  }

  // Use regex approach for simple cases without keepTags
  if (opts.keepTags.length === 0) {
    return optimizeWithRegex(html, opts);
  }

  // Use HTML parser for complex keepTags logic
  return optimizeWithParser(html, opts);
}

function optimizeWithRegex(
  html: string,
  opts: Required<OptimizeOptions>,
): string {
  let result = html;

  // Remove script tags (unless excluded)
  if (!opts.excludeTags.includes("script")) {
    result = result.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      "",
    );
  }

  // Remove style tags (unless excluded)
  if (!opts.excludeTags.includes("style")) {
    result = result.replace(
      /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
      "",
    );
  }

  // Remove meta tags (unless excluded)
  if (!opts.excludeTags.includes("meta")) {
    result = result.replace(/<meta\b[^>]*>/gi, "");
  }

  // Remove HTML comments
  if (opts.removeComments) {
    result = result.replace(/<!--[\s\S]*?-->/g, "");
  }

  // Remove attributes
  if (!opts.keepAttributes) {
    result = result.replace(/<(\w+)\s[^>]*>/g, "<$1>");
  }

  // Normalize whitespace
  if (opts.minifyText && !opts.preserveWhitespace) {
    result = result.replace(/>\s+</g, "><");
    result = result.replace(/\s+/g, " ");
    result = result.replace(/>(\s+)/g, ">");
    result = result.replace(/(\s+)</g, "<");
  }

  // Remove empty elements (recursive removal)
  if (opts.removeEmpty) {
    let prevResult = "";
    while (prevResult !== result) {
      prevResult = result;
      result = result.replace(/<(\w+)>\s*<\/\1>/g, "");
      result = result.replace(/<(\w+)><\/\1>/g, "");
    }
  }

  // Normalize self-closing tags
  result = result.replace(/<(\w+)\s*\/>/g, "<$1>");

  return result.trim();
}

function optimizeWithParser(
  html: string,
  opts: Required<OptimizeOptions>,
): string {
  const root = parse(html);

  processElementWithParser(root, opts);

  // Additional post-processing
  let result = root.innerHTML;

  // Recursive removal of empty elements
  if (opts.removeEmpty) {
    let prevResult = "";
    while (prevResult !== result) {
      prevResult = result;
      result = result.replace(/<(\w+)>\s*<\/\1>/g, "");
      result = result.replace(/<(\w+)><\/\1>/g, "");
    }
  }

  // Normalize self-closing tags
  result = result.replace(/<(\w+)\s*\/>/g, "<$1>");

  return result.trim();
}

function processElementWithParser(
  element: HTMLElement,
  opts: Required<OptimizeOptions>,
): void {
  const childNodes = Array.from(element.childNodes);

  for (const node of childNodes) {
    if (node.nodeType === 1) {
      // Element node
      const tagName = (node as HTMLElement).tagName?.toLowerCase();

      // Remove tags not in keepTags (if keepTags is provided)
      if (opts.keepTags.length > 0 && !opts.keepTags.includes(tagName)) {
        node.remove();
        continue;
      }

      // Remove script, style, meta tags (unless excluded)
      if (
        ["script", "style", "meta"].includes(tagName) &&
        !opts.excludeTags.includes(tagName)
      ) {
        node.remove();
        continue;
      }

      const element = node as HTMLElement;

      // Remove attributes
      if (!opts.keepAttributes) {
        const attrs = Object.keys(element.attributes);
        for (const attr of attrs) {
          element.removeAttribute(attr);
        }
      }

      // Process children recursively
      processElementWithParser(element, opts);

      // Remove empty elements (after processing children)
      if (opts.removeEmpty && !element.innerHTML.trim()) {
        element.remove();
      }
    } else if (node.nodeType === 8) {
      // Comment node
      if (opts.removeComments) {
        node.remove();
      }
    } else if (node.nodeType === 3) {
      // Text node
      if (opts.minifyText && !opts.preserveWhitespace) {
        const text = node.text;
        const normalizedText = text.replace(/\s+/g, " ").trim();
        if (normalizedText) {
          // TypeScript doesn't know about rawText property, so we use type assertion
          (node as HTMLElement & { rawText: string }).rawText = normalizedText;
        } else if (opts.removeEmpty) {
          node.remove();
        }
      }
    }
  }
}
