# HTML RAG Optimizer - テスト設計書

## 1. テスト戦略

### 1.1 TDD開発アプローチ
このプロジェクトでは **t-wada式TDD** に基づく開発を行います：

1. **Red**: 失敗するテストを書く
2. **Green**: テストを通す最小限のコードを書く  
3. **Refactor**: コードを改善する

### 1.2 テストピラミッド構成
- **Unit Tests (80%)**: 各機能の単体テスト
- **Integration Tests (15%)**: モジュール間の統合テスト
- **E2E Tests (5%)**: CLI経由の実際使用シナリオ

### 1.3 品質目標
- コードカバレッジ: 90%以上
- 全テスト実行時間: 30秒以内
- CI/CD環境での安定した実行

## 2. テスト分類とテストケース

### 2.1 Core Optimizer Tests (`src/optimizer.ts`)

#### 2.1.1 基本HTML最適化テスト

**テスト対象**: `optimizeHtml(html: string, options?: OptimizeOptions): string`

##### Red Phase テストケース

```typescript
describe('optimizeHtml - Basic Functionality', () => {
  it('should remove script tags completely', () => {
    const input = '<div>Content</div><script>alert("test")</script>';
    const expected = '<div>Content</div>';
    expect(optimizeHtml(input)).toBe(expected);
  });

  it('should remove style tags completely', () => {
    const input = '<div>Content</div><style>body{color:red}</style>';
    const expected = '<div>Content</div>';
    expect(optimizeHtml(input)).toBe(expected);
  });

  it('should remove meta tags completely', () => {
    const input = '<meta charset="utf-8"><div>Content</div>';
    const expected = '<div>Content</div>';
    expect(optimizeHtml(input)).toBe(expected);
  });

  it('should remove all attributes by default', () => {
    const input = '<div class="test" id="main">Content</div>';
    const expected = '<div>Content</div>';
    expect(optimizeHtml(input)).toBe(expected);
  });

  it('should remove empty elements', () => {
    const input = '<div>Content</div><div></div><p>   </p>';
    const expected = '<div>Content</div>';
    expect(optimizeHtml(input)).toBe(expected);
  });

  it('should remove HTML comments', () => {
    const input = '<div>Content</div><!-- This is a comment -->';
    const expected = '<div>Content</div>';
    expect(optimizeHtml(input)).toBe(expected);
  });

  it('should normalize whitespace', () => {
    const input = '<div>   Multiple   spaces   </div>';
    const expected = '<div>Multiple spaces</div>';
    expect(optimizeHtml(input)).toBe(expected);
  });
});
```

#### 2.1.2 オプション機能テスト

```typescript
describe('optimizeHtml - Options', () => {
  it('should keep attributes when keepAttributes is true', () => {
    const input = '<div class="test" id="main">Content</div>';
    const expected = '<div class="test" id="main">Content</div>';
    expect(optimizeHtml(input, { keepAttributes: true })).toBe(expected);
  });

  it('should preserve empty elements when removeEmpty is false', () => {
    const input = '<div>Content</div><div></div>';
    const expected = '<div>Content</div><div></div>';
    expect(optimizeHtml(input, { removeEmpty: false })).toBe(expected);
  });

  it('should preserve whitespace when preserveWhitespace is true', () => {
    const input = '<div>   Multiple   spaces   </div>';
    const expected = '<div>   Multiple   spaces   </div>';
    expect(optimizeHtml(input, { preserveWhitespace: true })).toBe(expected);
  });

  it('should exclude specified tags from removal', () => {
    const input = '<div>Content</div><script>code</script><style>css</style>';
    const expected = '<div>Content</div><script>code</script>';
    expect(optimizeHtml(input, { excludeTags: ['script'] })).toBe(expected);
  });

  it('should keep only specified tags when keepTags is provided', () => {
    const input = '<div>Content</div><p>Paragraph</p><span>Span</span>';
    const expected = '<div>Content</div><p>Paragraph</p>';
    expect(optimizeHtml(input, { keepTags: ['div', 'p'] })).toBe(expected);
  });

  it('should preserve comments when removeComments is false', () => {
    const input = '<div>Content</div><!-- Comment -->';
    const expected = '<div>Content</div><!-- Comment -->';
    expect(optimizeHtml(input, { removeComments: false })).toBe(expected);
  });

  it('should not minify text when minifyText is false', () => {
    const input = '<div>\n  Line breaks\n  and spaces\n</div>';
    const expected = '<div>\n  Line breaks\n  and spaces\n</div>';
    expect(optimizeHtml(input, { minifyText: false })).toBe(expected);
  });
});
```

#### 2.1.3 エッジケースとエラーハンドリング

```typescript
describe('optimizeHtml - Edge Cases', () => {
  it('should handle empty string input', () => {
    expect(optimizeHtml('')).toBe('');
  });

  it('should handle whitespace-only input', () => {
    expect(optimizeHtml('   \n\t   ')).toBe('');
  });

  it('should handle malformed HTML', () => {
    const input = '<div><p>Unclosed tags<span>content</div>';
    // Should not throw error and return valid HTML
    expect(() => optimizeHtml(input)).not.toThrow();
  });

  it('should handle deeply nested empty elements', () => {
    const input = '<div><p><span></span></p></div><div>Content</div>';
    const expected = '<div>Content</div>';
    expect(optimizeHtml(input)).toBe(expected);
  });

  it('should handle special characters and entities', () => {
    const input = '<div>&lt;&gt;&amp;&quot;&#39;</div>';
    const expected = '<div>&lt;&gt;&amp;&quot;&#39;</div>';
    expect(optimizeHtml(input)).toBe(expected);
  });

  it('should handle very large HTML input', () => {
    const largeContent = 'x'.repeat(100000);
    const input = `<div>${largeContent}</div>`;
    const result = optimizeHtml(input);
    expect(result).toContain(largeContent);
  });
});
```

### 2.2 File Handler Tests (`src/utils/file-handler.ts`)

```typescript
describe('optimizeHtmlFile', () => {
  it('should process single file correctly', async () => {
    const tempInput = '/tmp/test-input.html';
    const tempOutput = '/tmp/test-output.html';
    const inputContent = '<div class="test">Content</div>';
    const expectedContent = '<div>Content</div>';
    
    await fs.writeFile(tempInput, inputContent);
    await optimizeHtmlFile(tempInput, tempOutput);
    const result = await fs.readFile(tempOutput, 'utf-8');
    
    expect(result).toBe(expectedContent);
  });

  it('should throw error for non-existent input file', async () => {
    await expect(optimizeHtmlFile('/non/existent.html', '/tmp/output.html'))
      .rejects.toThrow('Input file not found');
  });

  it('should create output directory if it does not exist', async () => {
    const tempInput = '/tmp/test-input.html';
    const tempOutput = '/tmp/new-dir/test-output.html';
    
    await fs.writeFile(tempInput, '<div>Content</div>');
    await optimizeHtmlFile(tempInput, tempOutput);
    
    expect(await fs.access('/tmp/new-dir')).not.toThrow();
  });
});

describe('optimizeHtmlDir', () => {
  it('should process all HTML files in directory', async () => {
    const tempInputDir = '/tmp/test-input-dir';
    const tempOutputDir = '/tmp/test-output-dir';
    
    await fs.mkdir(tempInputDir, { recursive: true });
    await fs.writeFile(`${tempInputDir}/file1.html`, '<div class="test">Content1</div>');
    await fs.writeFile(`${tempInputDir}/file2.html`, '<p id="test">Content2</p>');
    
    await optimizeHtmlDir(tempInputDir, tempOutputDir);
    
    const result1 = await fs.readFile(`${tempOutputDir}/file1.html`, 'utf-8');
    const result2 = await fs.readFile(`${tempOutputDir}/file2.html`, 'utf-8');
    
    expect(result1).toBe('<div>Content1</div>');
    expect(result2).toBe('<p>Content2</p>');
  });

  it('should preserve directory structure', async () => {
    const tempInputDir = '/tmp/test-nested-input';
    const tempOutputDir = '/tmp/test-nested-output';
    
    await fs.mkdir(`${tempInputDir}/subdir`, { recursive: true });
    await fs.writeFile(`${tempInputDir}/subdir/nested.html`, '<div>Nested</div>');
    
    await optimizeHtmlDir(tempInputDir, tempOutputDir);
    
    const result = await fs.readFile(`${tempOutputDir}/subdir/nested.html`, 'utf-8');
    expect(result).toBe('<div>Nested</div>');
  });
});
```

### 2.3 CLI Tests (`src/cli.ts`)

```typescript
describe('CLI Interface', () => {
  it('should process single file via CLI', async () => {
    const tempInput = '/tmp/cli-input.html';
    const tempOutput = '/tmp/cli-output.html';
    
    await fs.writeFile(tempInput, '<div class="test">CLI Test</div>');
    
    const { stdout, stderr } = await exec(`node bin/cli.js ${tempInput} -o ${tempOutput}`);
    
    expect(stderr).toBe('');
    expect(stdout).toContain('Optimization completed');
    
    const result = await fs.readFile(tempOutput, 'utf-8');
    expect(result).toBe('<div>CLI Test</div>');
  });

  it('should handle CLI options correctly', async () => {
    const tempInput = '/tmp/cli-options-input.html';
    const tempOutput = '/tmp/cli-options-output.html';
    
    await fs.writeFile(tempInput, '<div class="keep">Content</div><script>remove</script>');
    
    await exec(`node bin/cli.js ${tempInput} -o ${tempOutput} --keep-attributes --exclude-tags script`);
    
    const result = await fs.readFile(tempOutput, 'utf-8');
    expect(result).toBe('<div class="keep">Content</div><script>remove</script>');
  });

  it('should show help when --help flag is used', async () => {
    const { stdout } = await exec('node bin/cli.js --help');
    expect(stdout).toContain('Usage:');
    expect(stdout).toContain('Options:');
  });

  it('should show version when --version flag is used', async () => {
    const { stdout } = await exec('node bin/cli.js --version');
    expect(stdout).toMatch(/\d+\.\d+\.\d+/);
  });

  it('should handle directory processing via CLI', async () => {
    const tempInputDir = '/tmp/cli-input-dir';
    const tempOutputDir = '/tmp/cli-output-dir';
    
    await fs.mkdir(tempInputDir, { recursive: true });
    await fs.writeFile(`${tempInputDir}/test.html`, '<div class="test">Dir Test</div>');
    
    await exec(`node bin/cli.js --input-dir ${tempInputDir} --output-dir ${tempOutputDir}`);
    
    const result = await fs.readFile(`${tempOutputDir}/test.html`, 'utf-8');
    expect(result).toBe('<div>Dir Test</div>');
  });
});
```

### 2.4 Integration Tests

```typescript
describe('Full Integration Tests', () => {
  it('should handle complex HTML with all optimizations', async () => {
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

    const expected = `<html><body><div><h1>Main Title</h1><nav><a>Home</a><a>About</a></nav></div><main><section><p>This is a paragraph with multiple spaces.</p><p>Another paragraph.</p></section><aside><p>Sidebar content</p></aside></main></body></html>`;

    const result = optimizeHtml(complexHtml);
    expect(result).toBe(expected);
  });

  it('should preserve specific elements when configured', async () => {
    const html = `
      <div class="container">
        <h1>Title</h1>
        <script type="application/ld+json">{"@context": "https://schema.org"}</script>
        <p>Content</p>
        <style>.important { color: red; }</style>
      </div>
    `;

    const result = optimizeHtml(html, {
      excludeTags: ['script'],
      keepAttributes: true,
      keepTags: ['div', 'h1', 'p', 'script']
    });

    expect(result).toContain('script type="application/ld+json"');
    expect(result).toContain('class="container"');
    expect(result).not.toContain('<style>');
  });
});
```

## 3. パフォーマンステスト

```typescript
describe('Performance Tests', () => {
  it('should process 1MB HTML file within 5 seconds', async () => {
    const largeHtml = generateLargeHtml(1024 * 1024); // 1MB
    const startTime = Date.now();
    
    const result = optimizeHtml(largeHtml);
    
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    expect(processingTime).toBeLessThan(5000);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle concurrent file processing efficiently', async () => {
    const files = Array.from({ length: 10 }, (_, i) => `/tmp/test-${i}.html`);
    
    // Create test files
    await Promise.all(files.map(file => 
      fs.writeFile(file, generateMediumHtml())
    ));

    const startTime = Date.now();
    
    await Promise.all(files.map(file => 
      optimizeHtmlFile(file, file.replace('.html', '-opt.html'))
    ));
    
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    expect(processingTime).toBeLessThan(3000); // Should complete within 3 seconds
  });
});
```

## 4. テスト環境とセットアップ

### 4.1 テスト設定ファイル (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        'test/**',
        'examples/**'
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  }
});
```

### 4.2 テストヘルパー関数

```typescript
// test/helpers/generators.ts
export function generateLargeHtml(size: number): string {
  const content = 'x'.repeat(Math.floor(size / 100));
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

// test/helpers/file-utils.ts
export async function createTempFile(content: string): Promise<string> {
  const tempPath = `/tmp/test-${Date.now()}-${Math.random()}.html`;
  await fs.writeFile(tempPath, content);
  return tempPath;
}

export async function cleanupTempFiles(paths: string[]): Promise<void> {
  await Promise.all(paths.map(path => 
    fs.unlink(path).catch(() => {}) // Ignore errors
  ));
}
```

## 5. TDD開発フロー

### Phase 1: Red (失敗するテストを書く)
1. 要件を明確化
2. テストケースを実装
3. テスト実行 → 失敗確認

### Phase 2: Green (最小限のコードでテストを通す)
1. テストを通す最小限の実装
2. テスト実行 → 成功確認
3. 他のテストが壊れていないことを確認

### Phase 3: Refactor (コードを改善)
1. コードの重複除去
2. 可読性の向上
3. パフォーマンスの最適化
4. テスト実行 → 全テスト成功確認

## 6. CI/CD統合

### 6.1 テスト実行コマンド
```bash
# 全テスト実行
pnpm test

# カバレッジ付きテスト実行  
pnpm test:coverage

# ウォッチモードでテスト実行
pnpm test:watch

# 特定ファイルのテスト実行
pnpm test optimizer.test.ts
```

### 6.2 品質チェック統合
```bash
# リンティング + テスト + ビルド
pnpm ci

# TypeScript型チェック
pnpm type-check

# コード品質チェック
pnpm lint
```

このテスト設計書に基づいて、TDD方式で段階的に開発を進めていきます。