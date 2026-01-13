# Blog Project Roadmap

- [x] 1. 共通レイアウトコンポーネントの実装 (Header / Footer)
    - [x] Header.astro の作成
    - [x] Footer.astro の作成
    - [x] Layout.astro への組み込み
- [x] 2. SEO & OGP (メタデータ) の設定
    - [x] BaseHead.astro の作成
    - [x] 各ページでのメタデータ動的制御
- [x] 3. タグ機能の実装
    - [x] src/pages/tags/index.astro (全タグの一覧表示)
    - [x] src/pages/tags/[tag].astro (特定のタグに紐づく記事一覧)
    - [x] src/layouts/BlogPost.astro (記事詳細でのタグ表示)
    - [x] src/components/TagList.astro (タグを表示するための共通コンポーネント作成)
