# HTML RAG Optimizer - 要件定義書

## プロジェクト概要

### プロジェクト名
`html-rag-optimizer`

### 目的
RAG（Retrieval-Augmented Generation）システムで使用するHTMLドキュメントを最適化し、情報検索の精度向上を図るツール。HTMLから不要なタグや属性を除去し、検索に適した形式に変換する。

## 機能要件

### 1. 核となる最適化機能

**ベースロジック**: `ref/compress_html.py`の`simplify_html`関数のロジックを TypeScript で再実装

#### 1.1 不要タグの削除
- `<style>`, `<script>`, `<meta>`タグの完全除去
- SEOやレイアウト用のタグで情報検索に不要なものの除去

#### 1.2 属性の管理
- 全タグから属性を削除（デフォルト動作）
- オプションで属性保持を選択可能
- 特定タグ（例：`<a>`）の特定属性（例：`href`）の選択的除去

#### 1.3 空要素の削除
- テキスト内容を持たない要素の除去
- 空白文字のみの要素の削除
- 再帰的な空要素削除処理

#### 1.4 コメントとメタデータの除去
- HTMLコメントの完全削除
- 検索に不要なメタデータの除去

#### 1.5 テキスト正規化
- 余分な改行、タブ、スペースの除去
- 連続する空白文字の正規化
- 冗長な入れ子タグの簡素化

### 2. 使用インターフェース

#### 2.1 プログラマティック API
```typescript
import { optimizeHtml, OptimizeOptions } from 'html-rag-optimizer';

// 基本使用
const optimized = optimizeHtml(htmlString);

// オプション指定
const optimized = optimizeHtml(htmlString, {
  keepAttributes: false,
  removeEmpty: true,
  preserveWhitespace: false,
  excludeTags: ['code', 'pre'],
  keepTags: ['h1', 'h2', 'h3', 'p', 'div']
});
```

#### 2.2 CLI インターフェース
```bash
# 単一ファイル処理
npx html-rag-optimizer input.html -o output.html

# ディレクトリ一括処理
html-rag-optimizer --input-dir ./docs --output-dir ./optimized

# オプション指定
html-rag-optimizer input.html -o output.html --keep-attributes --exclude-tags script,style
```

### 3. 設定オプション

| オプション名 | 型 | デフォルト | 説明 |
|-------------|-----|-----------|-----|
| `keepAttributes` | boolean | false | タグの属性を保持するか |
| `removeEmpty` | boolean | true | 空要素を削除するか |
| `preserveWhitespace` | boolean | false | 空白文字を保持するか |
| `excludeTags` | string[] | [] | 削除から除外するタグリスト |
| `keepTags` | string[] | [] | 保持する特定タグリスト（指定時は他を削除） |
| `removeComments` | boolean | true | HTMLコメントを削除するか |
| `minifyText` | boolean | true | テキストを最小化するか |

## 技術仕様

### 1. 開発環境・ツール

#### 1.1 基本技術スタック
- **言語**: TypeScript 5.0+
- **ランタイム**: Node.js 18+
- **パッケージマネージャー**: pnpm
- **ビルドツール**: tsdown
- **テストフレームワーク**: vitest

#### 1.2 主要依存関係
- **HTMLパーサー**: node-html-parser
- **CLI フレームワーク**: commander.js
- **ファイル操作**: Node.js標準ライブラリ（fs, path）

#### 1.3 開発依存関係
- **型チェック**: TypeScript
- **リンター・フォーマッター**: Biome
- **型定義**: @types/node

### 2. プロジェクト構成

```
html-rag-optimizer/
├── src/
│   ├── index.ts              # メインAPI・エクスポート
│   ├── optimizer.ts          # HTML最適化ロジック
│   ├── cli.ts               # CLI実装
│   ├── types.ts             # TypeScript型定義
│   └── utils/
│       ├── parser.ts        # HTMLパース処理
│       └── file-handler.ts  # ファイル操作処理
├── bin/
│   └── cli.js               # CLI実行ファイル
├── test/
│   ├── optimizer.test.ts    # 最適化機能テスト
│   ├── cli.test.ts          # CLIテスト
│   └── fixtures/            # テスト用HTMLファイル
├── examples/
│   ├── basic-usage.ts       # 基本使用例
│   └── advanced-options.ts  # 高度なオプション例
├── dist/                    # ビルド出力
├── package.json
├── tsconfig.json
├── tsdown.config.ts
├── vitest.config.ts
└── README.md
```

### 3. ビルド・配布仕様

#### 3.1 出力形式
- **ESM**: ES Modules対応
- **CommonJS**: CommonJS対応
- **型定義**: `.d.ts`ファイル生成
- **CLI**: 実行可能バイナリ

#### 3.2 配布設定
```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    }
  },
  "bin": {
    "html-rag-optimizer": "./bin/cli.js"
  }
}
```

## 非機能要件

### 1. パフォーマンス要件
- 1MB以上の大きなHTMLファイルでも5秒以内で処理完了
- メモリ使用量は処理するファイルサイズの3倍以下
- 並行処理による複数ファイルの効率的な処理

### 2. 互換性要件
- Node.js 18以上での動作保証
- Windows, macOS, Linux での動作確認
- pnpm, npm, yarn での利用可能

### 3. 品質要件
- コードカバレッジ90%以上
- TypeScript strict モード対応
- Biome による コード品質保持

### 4. 使用性要件
- 直感的なAPI設計
- 明確なエラーメッセージ
- 詳細なドキュメントとサンプルコード
- デフォルト設定で多くのケースに対応

## API設計

### 1. メイン関数

```typescript
export interface OptimizeOptions {
  keepAttributes?: boolean;
  removeEmpty?: boolean;
  preserveWhitespace?: boolean;
  excludeTags?: string[];
  keepTags?: string[];
  removeComments?: boolean;
  minifyText?: boolean;
}

export function optimizeHtml(
  html: string, 
  options?: OptimizeOptions
): string;

export function optimizeHtmlFile(
  inputPath: string, 
  outputPath: string, 
  options?: OptimizeOptions
): Promise<void>;

export function optimizeHtmlDir(
  inputDir: string, 
  outputDir: string, 
  options?: OptimizeOptions
): Promise<void>;
```

### 2. CLI コマンド

```bash
html-rag-optimizer [input] [options]

Options:
  -o, --output <path>           出力ファイルまたはディレクトリ
  --input-dir <path>           入力ディレクトリ
  --output-dir <path>          出力ディレクトリ
  --keep-attributes            属性を保持
  --exclude-tags <tags>        除外するタグ（カンマ区切り）
  --keep-tags <tags>           保持するタグ（カンマ区切り）
  --preserve-whitespace        空白文字を保持
  --config <path>              設定ファイルパス
  -h, --help                   ヘルプを表示
  -v, --version                バージョンを表示
```

## 実装フェーズ

### Phase 1: 基盤構築
- プロジェクト初期化
- 基本的なHTML最適化機能
- 単体テスト

### Phase 2: CLI実装
- コマンドライン インターフェース
- ファイル・ディレクトリ処理
- 設定ファイル対応

### Phase 3: 高度な機能
- 詳細なオプション対応
- パフォーマンス最適化
- エラーハンドリング強化

### Phase 4: 配布準備
- ドキュメント整備
- サンプルコード作成
- npm パッケージ公開準備