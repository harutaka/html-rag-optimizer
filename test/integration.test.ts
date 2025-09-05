import { describe, expect, it } from "vitest";
import { optimizeHtml } from "../src/optimizer";

describe("Full Integration Tests", () => {
  it("should handle complex HTML with all optimizations", () => {
    const complexHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Page</title>
        <style>
          body { font-family: Arial; }
          .header { color: blue; }
        </style>
        <script>
          console.log('This should be removed');
        </script>
      </head>
      <body>
        <div class="header" id="main-header">
          <h1>Main Title</h1>
          <!-- Navigation will be here -->
          <nav>
            <a href="/home" class="nav-link">Home</a>
            <a href="/about" class="nav-link">About</a>
          </nav>
        </div>
        <main>
          <section class="content">
            <p>   This is a paragraph with   multiple   spaces.   </p>
            <div></div>
            <p>Another paragraph.</p>
          </section>
          <aside>
            <div>   </div>
            <p>Sidebar content</p>
          </aside>
        </main>
        <!-- Footer comment -->
        <footer></footer>
      </body>
      </html>
    `;

    const result = optimizeHtml(complexHtml);

    // Should preserve basic structure
    expect(result).toContain("<html>");
    expect(result).toContain("<head>");
    expect(result).toContain("<title>Test Page</title>");
    expect(result).toContain("<body>");
    expect(result).toContain("<h1>Main Title</h1>");
    expect(result).toContain("<nav>");
    expect(result).toContain("<main>");

    // Should remove unwanted elements
    expect(result).not.toContain("<style>");
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("<meta");
    expect(result).not.toContain("<!--");
    expect(result).not.toContain("class=");
    expect(result).not.toContain("id=");

    // Should normalize text
    expect(result).toContain("This is a paragraph with multiple spaces.");
    expect(result).toContain("Another paragraph.");
  });

  it("should preserve specific elements when configured", () => {
    const html = `
      <div class="container">
        <h1>Title</h1>
        <script type="application/ld+json">{"@context": "https://schema.org"}</script>
        <p>Content</p>
        <style>.important { color: red; }</style>
      </div>
    `;

    const result = optimizeHtml(html, {
      excludeTags: ["script"],
      keepAttributes: true,
    });

    expect(result).toContain('script type="application/ld+json"');
    expect(result).toContain('class="container"');
    expect(result).not.toContain("<style>");
  });

  it("should handle real-world blog post HTML", () => {
    const blogHtml = `
      <article class="post" id="post-123">
        <header>
          <h1 class="title">Blog Post Title</h1>
          <meta name="author" content="John Doe">
          <time datetime="2023-12-01">December 1, 2023</time>
        </header>
        <div class="content">
          <p class="intro">This is the introduction paragraph.</p>
          <h2>Section 1</h2>
          <p>Content of section 1 with <a href="/link" class="internal-link">internal link</a>.</p>
          <blockquote cite="https://example.com">
            <p>This is a quote from an external source.</p>
          </blockquote>
          <h2>Section 2</h2>
          <ul class="list">
            <li>First item</li>
            <li>Second item</li>
            <li></li>
          </ul>
        </div>
        <footer class="post-footer">
          <!-- Social sharing buttons will be added here -->
          <div class="tags">
            <span class="tag">TypeScript</span>
            <span class="tag">HTML</span>
          </div>
        </footer>
      </article>
    `;

    const result = optimizeHtml(blogHtml);

    // Should remove all attributes
    expect(result).not.toContain("class=");
    expect(result).not.toContain("id=");
    expect(result).not.toContain("href=");
    expect(result).not.toContain("cite=");

    // Should preserve content structure
    expect(result).toContain("<article>");
    expect(result).toContain("<h1>Blog Post Title</h1>");
    expect(result).toContain("<h2>Section 1</h2>");
    expect(result).toContain("<blockquote>");
    expect(result).toContain("<ul>");

    // Should remove empty elements
    expect(result).not.toContain("<li></li>");

    // Should remove meta tags
    expect(result).not.toContain("<meta");

    // Should remove comments
    expect(result).not.toContain("<!--");
  });

  it("should handle e-commerce product page HTML", () => {
    const productHtml = `
      <div class="product-page">
        <script type="application/ld+json">
          {"@type": "Product", "name": "Sample Product"}
        </script>
        <div class="breadcrumb">
          <a href="/">Home</a> > <a href="/category">Category</a> > Product
        </div>
        <div class="product-main">
          <div class="product-images">
            <img src="product.jpg" alt="Product Image" class="main-image">
            <div class="thumbnails">
              <img src="thumb1.jpg" alt="Thumbnail 1">
              <img src="thumb2.jpg" alt="Thumbnail 2">
            </div>
          </div>
          <div class="product-info">
            <h1 class="product-title">Sample Product</h1>
            <div class="price">
              <span class="current-price">$99.99</span>
              <span class="original-price">$129.99</span>
            </div>
            <div class="description">
              <p>This is a sample product description.</p>
            </div>
            <div class="add-to-cart">
              <button type="button" class="btn btn-primary">Add to Cart</button>
            </div>
          </div>
        </div>
        <div class="reviews">
          <h2>Customer Reviews</h2>
          <div class="review">
            <div class="review-header">
              <span class="reviewer-name">John D.</span>
              <div class="rating">★★★★☆</div>
            </div>
            <p class="review-text">Great product, highly recommended!</p>
          </div>
        </div>
      </div>
    `;

    const result = optimizeHtml(productHtml, {
      keepTags: ["div", "h1", "h2", "p", "span", "button", "script"],
    });

    // Should keep specified tags
    expect(result).toContain("<div>");
    expect(result).toContain("<h1>");
    expect(result).toContain("<h2>");
    expect(result).toContain("<p>");
    expect(result).toContain("<span>");
    expect(result).toContain("<button>");

    // Should keep script from keepTags
    expect(result).toContain("<script>");

    // Should remove other tags
    expect(result).not.toContain("<img>");
    expect(result).not.toContain("<a>");

    // Should preserve content
    expect(result).toContain("Sample Product");
    expect(result).toContain("$99.99");
    expect(result).toContain("Customer Reviews");
  });

  it("should handle multilingual content with special characters", () => {
    const multilingualHtml = `
      <div class="content">
        <h1>多言語コンテンツテスト</h1>
        <p>This content contains <em>English</em>, 日本語, español, and العربية text.</p>
        <div class="unicode-test">
          <p>Unicode symbols: ★ ♥ ♠ ♦ ♣ ✓ ✗ © ® ™</p>
          <p>Math symbols: ∑ ∫ ∞ ≠ ≤ ≥ ±</p>
          <p>Currency: $ € £ ¥ ₹ ₿</p>
        </div>
        <blockquote lang="fr">
          <p>« Bonjour le monde ! » dit-elle avec un sourire.</p>
        </blockquote>
        <code class="code-block">
          const greeting = "Hello, 世界!";
          console.log(greeting);
        </code>
      </div>
    `;

    const result = optimizeHtml(multilingualHtml);

    // Should preserve all text content including special characters
    expect(result).toContain("多言語コンテンツテスト");
    expect(result).toContain("English");
    expect(result).toContain("日本語");
    expect(result).toContain("español");
    expect(result).toContain("العربية");
    expect(result).toContain("★ ♥ ♠ ♦ ♣");
    expect(result).toContain("∑ ∫ ∞ ≠ ≤ ≥ ±");
    expect(result).toContain("$ € £ ¥ ₹ ₿");
    expect(result).toContain("« Bonjour le monde ! »");
    expect(result).toContain('const greeting = "Hello, 世界!";');

    // Should remove attributes but preserve structure
    expect(result).not.toContain("class=");
    expect(result).not.toContain("lang=");
    expect(result).toContain("<blockquote>");
    expect(result).toContain("<code>");
  });
});
