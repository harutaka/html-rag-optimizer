# HTML RAG Optimizer

A powerful HTML optimization tool designed specifically for RAG (Retrieval-Augmented Generation) systems. This library removes unnecessary HTML elements, attributes, and formatting to create clean, search-optimized content while preserving semantic structure.

## Features

- **🚀 Fast Processing**: Optimizes large HTML files (1MB+) in seconds
- **🎯 RAG-Focused**: Designed specifically for information retrieval systems
- **⚙️ Highly Configurable**: Extensive options for customizing optimization behavior
- **📝 TypeScript Support**: Full TypeScript support with detailed type definitions
- **🛠️ CLI & API**: Both command-line interface and programmatic API
- **🔄 Batch Processing**: Supports single files and entire directories
- **📊 Performance Optimized**: Efficient memory usage and concurrent processing

## Installation

```bash
npm install html-rag-optimizer
```

## Quick Start

### Programmatic API

```typescript
import { optimizeHtml } from 'html-rag-optimizer';

const html = `
<div class="container">
  <h1 id="title">Welcome</h1>
  <p>This is a <strong>sample</strong> paragraph.</p>
  <script>console.log('remove me');</script>
  <style>.container { margin: 0; }</style>
</div>
`;

// Basic optimization
const optimized = optimizeHtml(html);
console.log(optimized);
// Output: <div><h1>Welcome</h1><p>This is a <strong>sample</strong> paragraph.</p></div>
```

### CLI Usage

```bash
# Optimize a single file
npx html-rag-optimizer input.html -o output.html

# Optimize an entire directory
html-rag-optimizer --input-dir ./docs --output-dir ./optimized

# With custom options
html-rag-optimizer input.html -o output.html --keep-attributes --exclude-tags script,style
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `keepAttributes` | `boolean` | `false` | Preserve HTML attributes |
| `removeEmpty` | `boolean` | `true` | Remove empty elements |
| `preserveWhitespace` | `boolean` | `false` | Preserve whitespace formatting |
| `excludeTags` | `string[]` | `[]` | Tags to exclude from removal |
| `keepTags` | `string[]` | `[]` | Only keep specified tags (removes others) |
| `removeComments` | `boolean` | `true` | Remove HTML comments |
| `minifyText` | `boolean` | `true` | Normalize and minify text content |

## Advanced Usage

### Custom Configuration

```typescript
import { optimizeHtml } from 'html-rag-optimizer';

const options = {
  keepAttributes: false,
  removeEmpty: true,
  preserveWhitespace: false,
  excludeTags: ['code', 'pre'], // Don't remove code blocks
  keepTags: ['h1', 'h2', 'h3', 'p', 'div', 'article'], // Only keep these tags
  removeComments: true,
  minifyText: true
};

const optimized = optimizeHtml(html, options);
```

### File Processing

```typescript
import { optimizeHtmlFile, optimizeHtmlDir } from 'html-rag-optimizer';

// Process single file
await optimizeHtmlFile('input.html', 'output.html', options);

// Process entire directory
await optimizeHtmlDir('./docs', './optimized', options);
```

### Batch Processing with Custom Logic

```typescript
import { optimizeHtml } from 'html-rag-optimizer';
import { promises as fs } from 'fs';

async function processBatch(files: string[]) {
  const results = await Promise.all(
    files.map(async (file) => {
      const html = await fs.readFile(file, 'utf-8');
      return optimizeHtml(html, {
        keepTags: ['h1', 'h2', 'h3', 'p', 'article'],
        removeComments: true
      });
    })
  );
  return results;
}
```

## CLI Reference

### Basic Commands

```bash
# Help
html-rag-optimizer --help

# Version
html-rag-optimizer --version

# Single file
html-rag-optimizer input.html -o output.html

# Directory processing
html-rag-optimizer --input-dir ./src --output-dir ./dist
```

### CLI Options

```bash
-o, --output <path>           Output file or directory
--input-dir <path>           Input directory
--output-dir <path>          Output directory
--keep-attributes            Keep HTML attributes
--exclude-tags <tags>        Exclude tags (comma-separated)
--keep-tags <tags>           Keep only specified tags (comma-separated)
--preserve-whitespace        Preserve whitespace
--config <path>              Configuration file path
-h, --help                   Show help
-v, --version                Show version
```

### Configuration File

Create a `html-rag-optimizer.json` file:

```json
{
  "keepAttributes": false,
  "removeEmpty": true,
  "excludeTags": ["code", "pre"],
  "keepTags": ["h1", "h2", "h3", "p", "div", "article"],
  "removeComments": true,
  "minifyText": true
}
```

Use with: `html-rag-optimizer --config html-rag-optimizer.json input.html -o output.html`

## What Gets Optimized

### Removed by Default
- `<script>` tags and content
- `<style>` tags and content  
- `<meta>` tags
- HTML comments (`<!-- -->`)
- All HTML attributes (class, id, style, etc.)
- Empty elements (`<div></div>`, `<p>   </p>`)
- Excess whitespace and formatting

### Preserved
- Semantic HTML structure
- Text content
- Essential tags (headings, paragraphs, lists, etc.)
- HTML entities (`&amp;`, `&lt;`, etc.)

### Before Optimization
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sample Page</title>
  <style>body { font-family: Arial; }</style>
</head>
<body>
  <div class="container" id="main">
    <h1 class="title">   Welcome to Our Site   </h1>
    <!-- Navigation goes here -->
    <p class="intro">This is a   sample   paragraph.</p>
    <div></div>
    <script>console.log('hello');</script>
  </div>
</body>
</html>
```

### After Optimization
```html
<html><head><title>Sample Page</title></head><body><div><h1>Welcome to Our Site</h1><p>This is a sample paragraph.</p></div></body></html>
```

## Performance

- **Large Files**: Processes 1MB+ HTML files in under 5 seconds
- **Memory Efficient**: Memory usage stays under 3x input file size
- **Concurrent Processing**: Supports parallel processing of multiple files
- **Scalable**: Performance scales linearly with input size

## Use Cases

### RAG Systems
Perfect for preparing HTML content for vector databases and search systems:

```typescript
// Optimize content before indexing
const webContent = await fetchWebPage(url);
const optimizedForRAG = optimizeHtml(webContent, {
  keepTags: ['h1', 'h2', 'h3', 'p', 'article', 'section'],
  removeComments: true,
  minifyText: true
});
// Index optimizedForRAG in your vector database
```

### Documentation Processing
Clean up documentation before feeding to LLMs:

```typescript
const docs = await fs.readFile('documentation.html', 'utf-8');
const cleanDocs = optimizeHtml(docs, {
  excludeTags: ['code', 'pre'], // Keep code examples
  keepTags: ['h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'code', 'pre']
});
```

### Web Scraping Cleanup
Clean scraped content for analysis:

```typescript
const scrapedHTML = await scrapeWebsite(url);
const cleanContent = optimizeHtml(scrapedHTML, {
  keepTags: ['p', 'h1', 'h2', 'h3', 'article'],
  removeComments: true,
  minifyText: true
});
```

## Requirements

- Node.js 18 or higher
- TypeScript 5.0+ (for development)

## Development

```bash
# Clone the repository
git clone https://github.com/your-org/html-rag-optimizer.git
cd html-rag-optimizer

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Run examples
pnpm tsx examples/basic-usage.ts
```
