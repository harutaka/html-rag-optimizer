export function generateLargeHtml(size: number): string {
  const content = "x".repeat(Math.floor(size / 100));
  return `<div class="large">${content}</div>`.repeat(100);
}

export function generateMediumHtml(): string {
  return `
    <div class="container">
      <h1>Test Title</h1>
      <p>Test content with multiple words and spaces.</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </div>
  `;
}

export function generateComplexHtml(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Complex Test Page</title>
      <style>
        body { font-family: Arial, sans-serif; }
        .header { background: #333; color: white; }
        .content { margin: 20px; }
      </style>
      <script>
        function initPage() {
          console.log('Page initialized');
        }
      </script>
    </head>
    <body onload="initPage()">
      <header class="header">
        <nav class="navigation">
          <ul class="nav-list">
            <li><a href="/home" class="nav-link">Home</a></li>
            <li><a href="/about" class="nav-link">About</a></li>
            <li><a href="/contact" class="nav-link">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main class="content">
        <article class="post">
          <h1 class="post-title">Article Title</h1>
          <div class="post-meta">
            <time datetime="2023-12-01">December 1, 2023</time>
            <span class="author">By John Doe</span>
          </div>
          <div class="post-content">
            <p>This is the first paragraph with some <strong>bold text</strong> and <em>italic text</em>.</p>
            <blockquote cite="https://example.com">
              <p>This is a blockquote from an external source.</p>
            </blockquote>
            <h2>Subsection</h2>
            <p>Another paragraph with <a href="https://example.com" target="_blank">external link</a>.</p>
            <ul class="feature-list">
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
            </ul>
          </div>
        </article>
      </main>
      <aside class="sidebar">
        <div class="widget">
          <h3>Related Articles</h3>
          <ul>
            <li><a href="/article1">Related Article 1</a></li>
            <li><a href="/article2">Related Article 2</a></li>
          </ul>
        </div>
      </aside>
      <footer class="footer">
        <p>&copy; 2023 Test Site. All rights reserved.</p>
      </footer>
    </body>
    </html>
  `;
}
