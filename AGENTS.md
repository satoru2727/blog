# AGENTS.md (repo root)

このリポジトリで動作する agentic coding assistant 向けの作業ガイドです。
スコープ: リポジトリ全体（より深い階層の `AGENTS.md` があればそちらが優先）。

## Communication

- ユーザーとのコミュニケーションは日本語で行う（ユーザーが英語を明示指定した場合は英語に従う）。
- 推測で書かず、必ずリポジトリ内の実態（`package.json` / 実ファイル）に合わせる。

## Project Summary

- Type: Astro v5 (ESM) + Tailwind CSS v4（`@tailwindcss/vite`）
- Language: TypeScript（strict）
- Package manager: `pnpm`（`pnpm-lock.yaml`）
- Module system: ESM（`package.json#type = module`）
- Node: `24.12.0`（`package.json#volta`）
- Site URL: `https://satoru.work`（`astro.config.mjs#site`）

Key paths:
- Routes: `src/pages/`
- Layouts: `src/layouts/`
- Components: `src/components/`
- Content: `src/content/` + `src/content.config.ts`
- Styles: `src/styles/global.css`
- Tests (Playwright): `tests/`

Key routes:
- RSS feed: `/rss.xml`（`src/pages/rss.xml.ts`）
- Tags: `/tags`, `/tags/[tag]`
- Categories: `/categories`, `/categories/[category]`

## Commands (Build / Lint / Test)

全て repo root で実行。

### Install

- `pnpm install`

### Dev

- `pnpm dev`
  - Astro dev server: `http://localhost:4321`

### Typecheck

- `pnpm check`（= `astro check`）

### Lint / Format (Biome)

Biome が導入済み（`biome.json`）。

- Lint（フォーマット差分では落とさない方針）: `pnpm lint`（= `biome lint .`）
- Lint + format + import整理（書き換えあり）: `pnpm lint:fix`（= `biome check . --write`）
- Format（書き換えあり）: `pnpm format`（= `biome format . --write`）

注意:
- `biome.json` は `indentStyle=tab`, `lineWidth=100`, JS/TSは `single quotes` + `semicolons`。
- `files.ignoreUnknown=true` のため、Biomeが知らない拡張子は無視される。
- `.astro` はテンプレート全体ではなく frontmatter 側中心の取り扱いになるため、lint/formatの適用範囲に注意する（下記参照）。

### Build / Preview

- Build: `pnpm build`（= `astro build`）
- Preview: `pnpm preview`（= `astro preview`）

### Tests (Playwright a11y)

このリポジトリのテストは Playwright による a11y smoke（axe）です。

- 全テスト実行（CI相当）: `pnpm test` または `pnpm test:a11y`
  - `pnpm test:a11y` は `pnpm build && playwright test` を実行

特に「単体テスト1本だけ」:
- 単一ファイル: `pnpm exec playwright test tests/a11y.spec.ts`
- テスト名フィルタ: `pnpm exec playwright test --grep "home"`
  - もしくは `pnpm test:a11y -- --grep "home"`（先に `pnpm build` が走る）
- デバッグ: `pnpm exec playwright test --debug`

Playwrightのインストール:
- ブラウザ（Chromium）: `pnpm pw:install`
- Linux OS依存（必要なら）: `pnpm pw:install-deps`

CIでは `playwright install --with-deps chromium` を使って OS依存 + Chromium をまとめて入れる。

### CI 推奨（最低限）

- `pnpm lint && pnpm check && pnpm build && pnpm test:a11y`

## GitHub / Automation

- GitHub Actions:
  - CI workflow: `.github/workflows/ci.yml`
  - Auto-merge workflow: `.github/workflows/automerge.yml`
- Auto-merge:
  - PR に label `automerge` を付けると auto-merge（squash）が有効化される
  - マージは required checks（例: `ci`, `Cloudflare Pages`）が green になるまで行われない

### Conflict prevention（再発防止）

- 長生きする PR ブランチは、`package.json` / `pnpm-lock.yaml` / `src/styles/global.css` が衝突しやすい。
  - こまめに `master` を取り込む（例: `git fetch origin master && git merge origin/master`）。
- `pnpm-lock.yaml` は手で直さない。
  - 競合解消後は `pnpm install --lockfile-only` で必ず再生成して整合性を取る。

## Repo Conventions

### General

- 既存ファイルのスタイル（インデント/クォート/改行）に合わせる。
- 無関係な整形（drive-by reformat）はしない。
- 変更は小さく局所的に。

### Imports

- ローカルは相対 import（エイリアス未設定）。
- Astro APIs は named import を使う（例: `import { getCollection } from 'astro:content';`）。
- だいたいの順序（.astro frontmatter 内）:
  1. ローカル layouts/components
  2. Astro APIs（`astro:content`, `astro/loaders` など）
  3. ローカル constants/utils
- TypeScript は type-only import を使う（例: `import type { CollectionEntry } from 'astro:content';`）。

### TypeScript

- Strict を前提にする（unsafe cast を避ける）。
- `as any` / `@ts-ignore` / `@ts-expect-error` は禁止（根本原因を直す）。

### Naming

- 定数: `UPPER_SNAKE_CASE`（例: `src/consts.ts` の `SITE_TITLE`）
- 変数/関数: `camelCase`
- Components / Layouts: `PascalCase.astro`（例: `src/layouts/Layout.astro`）
- Routes: Astro の慣習に従う（`index.astro`, `[param].astro`, `[...spread].astro`）
- Content: `src/content/blog/` 配下は kebab-case（例: `hello-world.md`）

### Astro (.astro)

- 先頭に frontmatter（`---`）を置く。
- `Astro.props` は `interface Props` で形を明示する。
- 動的ルートは `export async function getStaticPaths()` を使う。
- Content Layer は `astro:content` を利用する。

### Content Layer

- 収集設定: `src/content.config.ts`（`defineCollection` + `glob` loader`）
- schema は `z` を用いて厳密に（例: `pubDate` は `z.coerce.date()`）。
- Blog frontmatter fields:
  - required: `title`, `description`, `pubDate`
  - optional: `updatedDate`, `heroImage`, `category`, `tags`

### Formatting

- フォーマッタの基準は `biome.json`。
- `.astro` はタブインデントのファイルがあるため、触るファイルの既存インデントに合わせる。
- Biome の `.astro` 向け lint は誤検知が出やすい（frontmatter 変数がテンプレートで使われる等）。
  - このため `biome.json` は `.astro` 向けに `noUnused*` 系などを弱めている。
- `.astro` テンプレート全体の整形を Biome に期待しない（必要なら別途方針を相談する）。

### Error handling

- 例外を握りつぶさない（空の `catch {}` は禁止）。
- 設定/コンテンツの不整合は `pnpm check`（astro check）で早期に落とす。

### Comments

- 既存ファイルのコメントスタイルに合わせる。
- 新規ファイル作成時は、短いヘッダー（事実のみ）を付ける。

### Tailwind / Styling

- Tailwind は `src/styles/global.css` の `@import "tailwindcss";` で導入。
- `.astro` 内で Tailwind utility を直接使う。
- スタイルの一括置換や無関係なclass整理はしない。

## pre-commit

- Husky + lint-staged を使用。
- hook: `.husky/pre-commit`（`pnpm lint-staged`）
- lint-staged 設定は `package.json#lint-staged` にある。
  - 一般ファイル: `biome check --write`
  - `.astro`: `biome format --write` + `biome lint`

## Editor / Tooling Rules

- Cursor rules: `.cursorrules` / `.cursor/rules/` は未検出。
- Copilot rules: `.github/copilot-instructions.md` は未検出。
- VS Code 推奨拡張: `.vscode/extensions.json`（Astro 拡張）。

## Notes for this repository

- OpenCode は `opencode.json` を project config として読む。
- `opencode.json` で MCP 設定を利用可能（例: `mcp.astro_docs`）。
