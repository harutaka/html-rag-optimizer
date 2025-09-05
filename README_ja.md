# HTML RAG Optimizer

RAG（Retrieval-Augmented Generation）システム向けに特別に設計された強力なHTML最適化ツール。このライブラリは、セマンティック構造を保持しながら、不要なHTML要素、属性、フォーマットを削除し、検索に最適化されたクリーンなコンテンツを作成します。

## 機能

- **🚀 高速処理**: 大きなHTMLファイル（1MB以上）を数秒で最適化
- **🎯 RAG特化**: 情報検索システム向けに特別設計
- **⚙️ 高度な設定**: 最適化動作をカスタマイズする豊富なオプション
- **📝 TypeScriptサポート**: 詳細な型定義による完全なTypeScriptサポート
- **🛠️ CLI & API**: コマンドラインインターフェースとプログラマティックAPIの両方
- **🔄 バッチ処理**: 単一ファイルとディレクトリ全体の処理をサポート
- **📊 パフォーマンス最適化**: 効率的なメモリ使用量と並行処理

## インストール

```bash
npm install @harutakax/html-rag-optimizer
```

## クイックスタート

### プログラマティックAPI

```typescript
import { optimizeHtml } from '@harutakax/html-rag-optimizer';

const html = `
<div class="container">
  <h1 id="title">ようこそ</h1>
  <p>これは<strong>サンプル</strong>の段落です。</p>
  <script>console.log('削除してください');</script>
  <style>.container { margin: 0; }</style>
</div>
`;

// 基本的な最適化
const optimized = optimizeHtml(html);
console.log(optimized);
// 出力: <div><h1>ようこそ</h1><p>これは<strong>サンプル</strong>の段落です。</p></div>
```

### CLI使用方法

```bash
# 単一ファイルの最適化
npx @harutakax/html-rag-optimizer input.html -o output.html

# ディレクトリ全体の最適化
@harutakax/html-rag-optimizer --input-dir ./docs --output-dir ./optimized

# カスタムオプション付き
@harutakax/html-rag-optimizer input.html -o output.html --keep-attributes --exclude-tags script,style
```

## 設定オプション

| オプション | 型 | デフォルト | 説明 |
|--------|------|---------|-------------|
| `keepAttributes` | `boolean` | `false` | HTML属性を保持 |
| `removeEmpty` | `boolean` | `true` | 空要素を削除 |
| `preserveWhitespace` | `boolean` | `false` | 空白文字の書式を保持 |
| `excludeTags` | `string[]` | `[]` | 削除から除外するタグ |
| `keepTags` | `string[]` | `[]` | 指定したタグのみを保持（その他を削除） |
| `removeComments` | `boolean` | `true` | HTMLコメントを削除 |
| `minifyText` | `boolean` | `true` | テキストコンテンツを正規化・圧縮 |

## 高度な使用方法

### カスタム設定

```typescript
import { optimizeHtml } from '@harutakax/html-rag-optimizer';

const options = {
  keepAttributes: false,
  removeEmpty: true,
  preserveWhitespace: false,
  excludeTags: ['code', 'pre'], // コードブロックは削除しない
  keepTags: ['h1', 'h2', 'h3', 'p', 'div', 'article'], // これらのタグのみを保持
  removeComments: true,
  minifyText: true
};

const optimized = optimizeHtml(html, options);
```

### ファイル処理

```typescript
import { optimizeHtmlFile, optimizeHtmlDir } from '@harutakax/html-rag-optimizer';

// 単一ファイルの処理
await optimizeHtmlFile('input.html', 'output.html', options);

// ディレクトリ全体の処理
await optimizeHtmlDir('./docs', './optimized', options);
```

### カスタムロジックでのバッチ処理

```typescript
import { optimizeHtml } from '@harutakax/html-rag-optimizer';
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

## CLIリファレンス

### 基本コマンド

```bash
# ヘルプ
@harutakax/html-rag-optimizer --help

# バージョン
@harutakax/html-rag-optimizer --version

# 単一ファイル
@harutakax/html-rag-optimizer input.html -o output.html

# ディレクトリ処理
@harutakax/html-rag-optimizer --input-dir ./src --output-dir ./dist
```

### CLIオプション

```bash
-o, --output <path>           出力ファイルまたはディレクトリ
--input-dir <path>           入力ディレクトリ
--output-dir <path>          出力ディレクトリ
--keep-attributes            HTML属性を保持
--exclude-tags <tags>        除外するタグ（カンマ区切り）
--keep-tags <tags>           指定したタグのみを保持（カンマ区切り）
--preserve-whitespace        空白文字を保持
--config <path>              設定ファイルパス
-h, --help                   ヘルプを表示
-v, --version                バージョンを表示
```

### 設定ファイル

`html-rag-optimizer.json`ファイルを作成：

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

使用方法: `@harutakax/html-rag-optimizer --config html-rag-optimizer.json input.html -o output.html`

## 最適化される内容

### デフォルトで削除されるもの
- `<script>`タグとその内容
- `<style>`タグとその内容  
- `<meta>`タグ
- HTMLコメント（`<!-- -->`）
- 全てのHTML属性（class、id、styleなど）
- 空要素（`<div></div>`、`<p>   </p>`）
- 余分な空白文字とフォーマット

### 保持されるもの
- セマンティックHTML構造
- テキストコンテンツ
- 必須タグ（見出し、段落、リストなど）
- HTMLエンティティ（`&amp;`、`&lt;`など）

### 最適化前
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>サンプルページ</title>
  <style>body { font-family: Arial; }</style>
</head>
<body>
  <div class="container" id="main">
    <h1 class="title">   私たちのサイトへようこそ   </h1>
    <!-- ナビゲーションがここに入ります -->
    <p class="intro">これは   サンプル   段落です。</p>
    <div></div>
    <script>console.log('hello');</script>
  </div>
</body>
</html>
```

### 最適化後
```html
<html><head><title>サンプルページ</title></head><body><div><h1>私たちのサイトへようこそ</h1><p>これはサンプル段落です。</p></div></body></html>
```

## パフォーマンス

- **大容量ファイル**: 1MB以上のHTMLファイルを5秒以内で処理
- **メモリ効率**: メモリ使用量は入力ファイルサイズの3倍以下
- **並行処理**: 複数ファイルの並列処理をサポート
- **スケーラブル**: パフォーマンスは入力サイズに比例してスケール

## 使用例

### RAGシステム
ベクターデータベースと検索システム用にHTMLコンテンツを準備：

```typescript
// インデックス化前にコンテンツを最適化
const webContent = await fetchWebPage(url);
const optimizedForRAG = optimizeHtml(webContent, {
  keepTags: ['h1', 'h2', 'h3', 'p', 'article', 'section'],
  removeComments: true,
  minifyText: true
});
// ベクターデータベースでoptimizedForRAGをインデックス化
```

### ドキュメント処理
LLMに供給する前にドキュメントをクリーンアップ：

```typescript
const docs = await fs.readFile('documentation.html', 'utf-8');
const cleanDocs = optimizeHtml(docs, {
  excludeTags: ['code', 'pre'], // コード例を保持
  keepTags: ['h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'code', 'pre']
});
```

### Webスクレイピングのクリーンアップ
解析用にスクレイピングしたコンテンツをクリーンアップ：

```typescript
const scrapedHTML = await scrapeWebsite(url);
const cleanContent = optimizeHtml(scrapedHTML, {
  keepTags: ['p', 'h1', 'h2', 'h3', 'article'],
  removeComments: true,
  minifyText: true
});
```

## 要件

- Node.js 18以上
- TypeScript 5.0以上（開発時）

## 開発

```bash
# リポジトリのクローン
git clone https://github.com/your-org/html-rag-optimizer.git
cd html-rag-optimizer

# 依存関係のインストール
pnpm install

# テスト実行
pnpm test

# ビルド
pnpm build

# サンプル実行
pnpm tsx examples/basic-usage.ts
```
