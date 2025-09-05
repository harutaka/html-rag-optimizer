# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development Commands
- `pnpm test` - Run all tests with Vitest
- `pnpm test:watch` - Run tests in watch mode for development
- `pnpm test:coverage` - Run tests with coverage report (90% threshold)
- `pnpm build` - Build the project with tsdown (dual ESM/CommonJS output)
- `pnpm dev` - Build in watch mode for development
- `pnpm type-check` - TypeScript type checking without emit
- `pnpm lint` - Check code with Biome linter
- `pnpm lint:fix` - Auto-fix linting issues with Biome
- `pnpm ci` - Complete CI pipeline (lint, type-check, test, build)

### Specific Test Commands
- `pnpm test optimizer.test.ts --run` - Run optimizer unit tests
- `pnpm test cli.test.ts --run` - Run CLI integration tests
- `pnpm test integration.test.ts performance.test.ts --run` - Run integration and performance tests

### CLI Usage Examples
- `npx @harutakax/html-rag-optimizer input.html -o output.html` - Basic file optimization
- `@harutakax/html-rag-optimizer --input-dir ./docs --output-dir ./optimized` - Directory processing

## High-Level Architecture

### Core Architecture
This is an HTML optimization tool specifically designed for RAG (Retrieval-Augmented Generation) systems. The architecture uses a dual optimization approach:

1. **Regex-based optimization** (`optimizeWithRegex`) - Fast path for simple cases without `keepTags`
2. **Parser-based optimization** (`optimizeWithParser`) - Complex path using node-html-parser for advanced tag filtering

### Key Components

#### `/src/optimizer.ts` - Core Engine
The main optimization logic with two distinct pathways:
- Simple regex approach for performance when no complex tag filtering is needed
- HTML parser approach when `keepTags` option requires selective element preservation
- Handles iterative empty element removal to catch nested empty tags

#### `/src/types.ts` - Configuration Interface
Defines `OptimizeOptions` interface with these key options:
- `keepTags[]` - Whitelist specific tags (others removed)
- `excludeTags[]` - Blacklist specific tags (others preserved)
- `keepAttributes` - Preserve HTML attributes
- `removeEmpty` - Remove empty elements
- `minifyText` - Normalize whitespace

#### `/src/cli.ts` - Command Line Interface
Commander.js-based CLI with support for:
- Single file and directory processing
- Configuration file loading (JSON format)
- All optimization options as CLI flags

#### `/src/utils/file-handler.ts` - File Operations
Handles file system operations:
- `optimizeHtmlFile()` - Single file processing
- `optimizeHtmlDir()` - Recursive directory processing with concurrency

### Test Architecture
Follows TDD methodology with comprehensive test coverage:
- **Unit tests** (80%): `/test/optimizer.test.ts`, `/test/file-handler.test.ts`
- **Integration tests** (15%): `/test/integration.test.ts`, `/test/cli.test.ts`
- **Performance tests** (5%): `/test/performance.test.ts`
- **Test helpers**: `/test/helpers/` with reusable utilities

### Build System
- **tsdown** for dual ESM/CommonJS builds with sourcemaps
- **Biome** for linting and formatting (replaces ESLint/Prettier)
- **Vitest** for testing with 90% coverage thresholds
- Dual package exports supporting both import/require patterns

### Critical Implementation Notes
- The optimizer handles a complex interaction between `keepTags` and `excludeTags` options
- Script/style/meta tags have special handling - they're removed by default but can be preserved via `keepTags`
- Empty element removal is iterative to handle nested scenarios
- Performance is optimized with regex pre-filtering before parser usage
- CLI uses actual command execution tests rather than mocked tests

### Development Workflow
This project was built using strict TDD methodology. When making changes:
1. Write failing tests first (Red phase)
2. Implement minimal code to pass (Green phase)  
3. Refactor while maintaining tests (Refactor phase)
4. Always run the full CI pipeline before commits