# Astro Blog プロジェクト - GitHub Copilot 指示書

## プロジェクト概要

ヒーローイメージ自動生成機能付きのモダンブログプロジェクトです。Astro、TypeScript、TailwindCSS、DaisyUIを使用し、Satori + Sharpによる動的画像生成機能を実装しています。

## 技術スタック

### フレームワーク・ライブラリ
- **Astro 5.8.0**: 静的サイトジェネレーター
- **TypeScript**: 型安全な開発環境
- **TailwindCSS 4.1.7**: ユーティリティファーストCSS
- **DaisyUI 5.0.37**: TailwindCSSコンポーネントライブラリ

### 画像生成
- **Satori 0.13.1**: SVG生成ライブラリ
- **Sharp 0.34.2**: 画像処理ライブラリ

### ランタイム
- **Bun**: JavaScriptランタイム・パッケージマネージャ

## プロジェクト構造

```
/
├── .github/
│   └── copilot-instructions.md    # このファイル
├── .astro/                        # Astro生成ファイル
├── assets/
│   └── fonts/                     # 日本語フォント（BIZ UDGothic）
├── public/
│   ├── favicon.svg
│   └── images/hero/               # 生成されたヒーロー画像
├── scripts/
│   └── prebuild-hero-images.ts   # ビルド前画像生成スクリプト
├── src/
│   ├── components/
│   │   ├── BlogCard.astro         # メインブログカードコンポーネント
│   │   └── BlogCardFlex.astro     # フレックス版ブログカード
│   ├── content/
│   │   ├── config.ts              # コンテンツスキーマ定義
│   │   └── blog/                  # Markdownブログ記事
│   ├── pages/
│   │   ├── index.astro            # ホームページ
│   │   ├── blog.astro             # ブログ一覧
│   │   ├── card-demo.astro        # カードコンポーネントデモ
│   │   ├── api/generate-hero/     # 画像生成API
│   │   └── blog/[slug].astro      # 動的ブログ記事ページ
│   ├── styles/
│   │   └── global.css             # グローバルスタイル
│   └── utils/
│       ├── generateHeroImage.ts   # ヒーロー画像生成ユーティリティ
│       └── processHeroImage.ts    # 画像処理ユーティリティ
├── astro.config.mjs               # Astro設定
├── package.json                   # 依存関係・スクリプト
└── tsconfig.json                  # TypeScript設定
```

## コアコンポーネント

### BlogCard.astro
DaisyUIを使った柔軟なブログカードコンポーネント

**Props:**
- `title` (string, required): 記事タイトル
- `description` (string): 記事説明
- `category` (string, required): カテゴリ
- `tags` (string[]): タグ配列
- `pubDate` (Date, required): 公開日
- `heroImage` (string): ヒーロー画像URL
- `slug` (string, required): 記事スラッグ
- `isNew` (boolean): 新着フラグ（7日以内は自動true）
- `size` ('sm' | 'md' | 'lg'): カードサイズ（デフォルト: 'md'）
- `orientation` ('vertical' | 'horizontal'): レイアウト向き（デフォルト: 'vertical'）

**特徴:**
- レスポンシブデザイン
- ホバーアニメーション（画像拡大、シャドウ変化）
- 自動新着判定（7日以内）
- フォールバック画像表示
- DaisyUIテーマ対応

### ヒーロー画像生成システム

#### generateHeroImage.ts
Satoriを使用してSVGを生成し、SharpでPNGに変換

**機能:**
- カテゴリ別の色設定（tech, blog, tutorial, default）
- 日本語フォント対応（BIZ UDGothic）
- タイトル長に応じたフォントサイズ調整
- グラデーション背景
- カテゴリバッジとアクセントカラー

#### processHeroImage.ts
既存画像の確認とフォールバック処理

**処理順序:**
1. 既存のheroImageプロパティチェック
2. 事前生成済み画像の存在確認
3. フォールバック（警告出力）

#### prebuild-hero-images.ts
ビルド前のバッチ画像生成スクリプト

**実行コマンド:**
```bash
bun run prebuild:images
```

## コンテンツ管理

### content/config.ts
Astro Content Collectionsのスキーマ定義

```typescript
{
  title: string;        // 必須
  category: string;     // 必須
  tags: string[];       // 必須
  pubDate: Date;        // 必須
  updatedDate?: Date;   // オプション
  heroImage?: string;   // オプション
  description?: string; // オプション
}
```

### ブログ記事
`src/content/blog/` ディレクトリにMarkdownファイルで管理
- フロントマターでメタデータ定義
- Markdownコンテンツで記事本文

## スタイリング

### DaisyUIテーマ
プロジェクト全体でDaisyUIのテーマシステムを活用
- `card`, `card-body`, `card-title`, `card-actions`
- `badge`, `badge-secondary`, `badge-outline`
- `bg-base-100`, `text-base-content`

### カスタムスタイル
- CSS line-clamp による複数行テキスト省略
- ホバーエフェクト（transform, transition）
- グラデーション背景

## 開発コマンド

```bash
# 開発サーバー起動
bun dev

# ヒーロー画像事前生成
bun run prebuild:images

# プロダクションビルド（画像生成含む）
bun build

# プレビュー
bun preview
```

## API エンドポイント

### POST /api/generate-hero
動的ヒーロー画像生成API

**リクエスト:**
```json
{
  "title": "記事タイトル",
  "category": "tech"
}
```

**レスポンス:**
```json
{
  "imagePath": "/images/hero/hero-article-title.png"
}
```

## コーディングガイドライン

### TypeScript
- 厳密型チェック有効
- インターフェース定義でProps型安全性確保
- Astro.propsでの分割代入推奨

### コンポーネント設計
- プロップスのデフォルト値設定
- 条件付きレンダリングでのフォールバック
- アクセシビリティ考慮（alt属性、semantic HTML）

### スタイリング
- TailwindCSSユーティリティクラス優先
- DaisyUIコンポーネント活用
- カスタムCSSは最小限に抑制

### パフォーマンス
- 静的サイト生成によるビルド時最適化
- 画像の事前生成によるランタイム処理削減
- レスポンシブ画像対応

## トラブルシューティング

### 画像が表示されない場合
1. `bun run prebuild:images` 実行
2. `public/images/hero/` ディレクトリ確認
3. フォントファイルの存在確認（`assets/fonts/`）

### ビルドエラー
1. 依存関係の再インストール: `bun install`
2. TypeScript型チェック: `bun astro check`
3. キャッシュクリア: `.astro` ディレクトリ削除

### DaisyUIスタイル適用されない
1. `src/styles/global.css` のインポート確認
2. TailwindCSS設定確認
3. HTMLの`data-theme`属性設定

## デプロイメント

### 静的サイトビルド
```bash
bun build
```
- ビルド前に自動でヒーロー画像生成
- `dist/` ディレクトリに静的ファイル出力
- Vercel、Netlify等の静的ホスティング対応

### 環境変数
現在、環境変数は使用していませんが、将来的にはAPI キーや外部サービス設定に使用予定

## 今後の拡張予定

- [ ] 記事検索機能
- [ ] カテゴリ・タグフィルタリング
- [ ] RSS フィード生成
- [ ] コメントシステム
- [ ] ソーシャルシェア機能
- [ ] PWA対応
- [ ] 多言語対応

## 参考リンク

- [Astro Documentation](https://docs.astro.build/)
- [DaisyUI Components](https://daisyui.com/components/)
- [TailwindCSS Utilities](https://tailwindcss.com/docs)
- [Satori Documentation](https://github.com/vercel/satori)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)

---

このドキュメントは、GitHub CopilotがAstro Blogプロジェクトでより効果的にコード支援を提供するためのコンテキスト情報です。開発時は、このプロジェクト構造とコーディングガイドラインに従ってください。
