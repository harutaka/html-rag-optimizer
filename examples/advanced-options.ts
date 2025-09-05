import { optimizeHtml } from "../src/index";

const sampleHtml = `
<article class="blog-post" id="post-123">
  <header class="post-header">
    <h1 class="post-title">How to Optimize HTML for RAG Systems</h1>
    <meta name="author" content="John Doe">
    <time datetime="2023-12-01" class="post-date">December 1, 2023</time>
  </header>
  <div class="post-content">
    <p class="intro">   This article explains various   HTML optimization   techniques.   </p>
    <script type="application/ld+json">
      {"@context": "https://schema.org", "@type": "Article"}
    </script>
    <h2>Key Benefits</h2>
    <ul class="benefits-list">
      <li>Reduced file size</li>
      <li>Improved parsing speed</li>
      <li>Better search accuracy</li>
      <li></li>
    </ul>
    <blockquote cite="https://example.com">
      <p>HTML optimization is crucial for RAG systems.</p>
    </blockquote>
    <div class="code-example">
      <pre><code class="language-html">
        &lt;div class="example"&gt;Sample code&lt;/div&gt;
      </code></pre>
    </div>
  </div>
  <!-- Social sharing buttons -->
  <footer class="post-footer">
    <div class="tags">
      <span class="tag">HTML</span>
      <span class="tag">RAG</span>
    </div>
  </footer>
</article>
`;

console.log("=== Advanced HTML Optimization Examples ===\n");

// Example 1: Default optimization
console.log("1. Default Optimization:");
const defaultResult = optimizeHtml(sampleHtml);
console.log("Result:", defaultResult);
console.log(
  "Length reduction:",
  `${(
    ((sampleHtml.length - defaultResult.length) / sampleHtml.length) * 100
  ).toFixed(1)}%\n`,
);

// Example 2: Keep attributes
console.log("2. Keep Attributes:");
const keepAttributesResult = optimizeHtml(sampleHtml, {
  keepAttributes: true,
});
console.log("Result:", keepAttributesResult);
console.log(
  "Contains class attributes:",
  keepAttributesResult.includes('class="'),
);
console.log();

// Example 3: Exclude specific tags
console.log("3. Exclude Script Tags:");
const excludeScriptResult = optimizeHtml(sampleHtml, {
  excludeTags: ["script"],
});
console.log("Result:", excludeScriptResult);
console.log("Contains script tag:", excludeScriptResult.includes("<script"));
console.log();

// Example 4: Exclude multiple tags
console.log("4. Exclude Multiple Tags:");
const excludeMultipleResult = optimizeHtml(sampleHtml, {
  excludeTags: ["script", "pre", "code"],
});
console.log("Result:", excludeMultipleResult);
console.log("Contains script:", excludeMultipleResult.includes("<script"));
console.log("Contains pre:", excludeMultipleResult.includes("<pre>"));
console.log();

// Example 5: Preserve whitespace
console.log("5. Preserve Whitespace:");
const preserveWhitespaceResult = optimizeHtml(sampleHtml, {
  preserveWhitespace: true,
});
console.log(
  "Whitespace preserved in intro:",
  preserveWhitespaceResult.includes(
    "   This article explains various   HTML optimization   techniques.   ",
  ),
);
console.log();

// Example 6: Complex configuration
console.log("6. Complex Configuration:");
const complexResult = optimizeHtml(sampleHtml, {
  keepAttributes: true,
  excludeTags: ["script", "pre", "code"],
  removeComments: true,
  minifyText: true,
});
console.log("Result:", complexResult);
console.log("Contains script:", complexResult.includes("<script"));
console.log("Contains pre:", complexResult.includes("<pre>"));
console.log("Contains attributes:", complexResult.includes('class="'));
console.log();

// Example 7: Performance comparison
console.log("7. Performance Comparison:");
const iterations = 1000;
const startTime = Date.now();

for (let i = 0; i < iterations; i++) {
  optimizeHtml(sampleHtml);
}

const endTime = Date.now();
const averageTime = (endTime - startTime) / iterations;
console.log(`Processed ${iterations} documents in ${endTime - startTime}ms`);
console.log(
  `Average processing time: ${averageTime.toFixed(2)}ms per document`,
);
