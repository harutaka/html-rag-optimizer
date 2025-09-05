import type { OptimizeOptions } from "./types";

const DEFAULT_OPTIONS: Required<OptimizeOptions> = {
  keepAttributes: false,
  removeEmpty: true,
  preserveWhitespace: false,
  excludeTags: [],
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

  // Use regex approach for optimization
  return optimizeWithRegex(html, opts);
}

function optimizeWithRegex(
  html: string,
  opts: Required<OptimizeOptions>,
): string {
  let result = html;

  // Remove DOCTYPE declaration
  result = result.replace(/<!DOCTYPE[^>]*>/gi, "");

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

  // Remove attributes (but preserve for excluded tags)
  if (!opts.keepAttributes && opts.excludeTags.length > 0) {
    // Create a pattern that excludes the excluded tags
    const excludePattern = opts.excludeTags.join("|");
    const regex = new RegExp(
      `<((?!(?:${excludePattern})\\b)\\w+)\\s[^>]*>`,
      "gi",
    );
    result = result.replace(regex, "<$1>");
  } else if (!opts.keepAttributes) {
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
