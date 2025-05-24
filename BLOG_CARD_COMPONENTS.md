# ブログカードコンポーネント

DaisyUIを使用したブログ記事カードのAstroコンポーネントです。

## コンポーネント

### BlogCard.astro
サイズと向きを調整可能な柔軟なブログカードコンポーネントです。

## 使用方法

### 基本的な使用

```astro
---
import BlogCard from '../components/BlogCard.astro';
---

<BlogCard
  title="記事のタイトル"
  description="記事の説明文"
  category="tech"
  tags={["typescript", "web-development"]}
  pubDate={new Date()}
  heroImage="/images/hero-image.jpg"
  slug="article-slug"
/>
```

### サイズ調整

```astro
<!-- 小さいサイズ -->
<BlogCard
  title="記事のタイトル"
  description="記事の説明文"
  category="tech"
  tags={["typescript", "web-development"]}
  pubDate={new Date()}
  heroImage="/images/hero-image.jpg"
  slug="article-slug"
  size="sm"
/>
```

### 水平レイアウト

```astro
<BlogCard
  title="記事のタイトル"
  description="記事の説明文"
  category="tech"
  tags={["typescript", "web-development"]}
  pubDate={new Date()}
  heroImage="/images/hero-image.jpg"
  slug="article-slug"
  orientation="horizontal"
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| title | string | ✓ | - | 記事のタイトル |
| description | string | | - | 記事の説明文 |
| category | string | ✓ | - | 記事のカテゴリ |
| tags | string[] | | [] | 記事のタグ |
| pubDate | Date | ✓ | - | 公開日 |
| heroImage | string | | - | ヒーロー画像のURL |
| slug | string | ✓ | - | 記事のスラッグ |
| isNew | boolean | | false | 新着フラグ（7日以内の記事は自動でtrueになります） |
| size | 'sm' \| 'md' \| 'lg' | | 'md' | カードのサイズ |
| orientation | 'vertical' \| 'horizontal' | | 'vertical' | カードの向き |

## 特徴

- **DaisyUI対応**: DaisyUIのカードコンポーネントベース
- **レスポンシブ**: モバイルファーストのデザイン
- **アニメーション**: ホバー時の画像拡大やシャドウ変化
- **柔軟なレイアウト**: 垂直・水平レイアウトとサイズ調整
- **自動新着判定**: 7日以内の記事に自動でNEWバッジを表示
- **フォールバック**: 画像がない場合のプレースホルダー表示

## スタイリング

DaisyUIのテーマシステムに対応しており、以下のDaisyUIクラスを使用しています：

- `card`, `card-body`, `card-title`, `card-actions`
- `badge`, `badge-secondary`, `badge-outline`
- `bg-base-100`, `text-base-content`

## カスタマイズ

DaisyUIのテーマを変更することで、カードの見た目を簡単にカスタマイズできます。

```html
<!-- ダークテーマの例 -->
<html data-theme="dark">
```

## デモページ

`/card-demo` ページで各種バリエーションを確認できます。
