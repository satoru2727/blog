import { existsSync } from 'fs';
import { join } from 'path';

interface BlogPost {
  title: string;
  category: string;
  slug: string;
  heroImage?: string;
}

export function processHeroImage(post: BlogPost): string {
  // heroImageが既に設定されている場合はそれを使用
  if (post.heroImage) {
    return post.heroImage;
  }

  // slugをベースにした画像ファイル名を生成
  const filename = `hero-${post.slug}.png`;
  
  const imagePath = join(process.cwd(), 'public/images/hero', filename);
  
  // 事前生成された画像がある場合はそれを使用
  if (existsSync(imagePath)) {
    return `/images/hero/${filename}`;
  }

  // フォールバック：デフォルト画像を返すか、空文字を返す
  console.warn(`Warning: No hero image found for post "${post.slug}". Run "bun run prebuild:images" to generate hero images.`);
  return '';
}
