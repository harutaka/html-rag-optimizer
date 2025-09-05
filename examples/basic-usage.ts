import { optimizeHtml } from "../src/index";

// Basic HTML optimization example
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 1200px; margin: 0 auto; }
  </style>
  <script>
    console.log('Page loaded');
  </script>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>Welcome to Our Website</h1>
      <nav class="navigation">
        <ul class="nav-list">
          <li><a href="/home" class="nav-link">Home</a></li>
          <li><a href="/about" class="nav-link">About</a></li>
        </ul>
      </nav>
    </header>
    <main class="main-content">
      <article class="post">
        <h2>Article Title</h2>
        <p>   This is a paragraph with   multiple   spaces.   </p>
        <div class="empty-div"></div>
        <p>Another paragraph with <strong>bold text</strong>.</p>
      </article>
    </main>
    <!-- Footer will be added later -->
    <footer class="footer">
      <p>&copy; 2023 Sample Website</p>
    </footer>
  </div>
</body>
</html>
`;

console.log("=== Basic HTML Optimization ===");
console.log("Original HTML length:", html.length);

// Basic optimization with default settings
const optimized = optimizeHtml(html);
console.log("Optimized HTML length:", optimized.length);
console.log(
  "Reduction:",
  `${(((html.length - optimized.length) / html.length) * 100).toFixed(1)}%`,
);
console.log("Optimized HTML:");
console.log(optimized);

console.log("\n=== Comparison ===");
console.log("Original contains <style>:", html.includes("<style>"));
console.log("Optimized contains <style>:", optimized.includes("<style>"));
console.log("Original contains <script>:", html.includes("<script>"));
console.log("Optimized contains <script>:", optimized.includes("<script>"));
console.log("Original contains class attributes:", html.includes('class="'));
console.log(
  "Optimized contains class attributes:",
  optimized.includes('class="'),
);
console.log("Original contains HTML comments:", html.includes("<!--"));
console.log("Optimized contains HTML comments:", optimized.includes("<!--"));
