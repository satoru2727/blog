import { existsSync } from 'fs';
import { join } from 'path';

interface BlogPost {
  title: string;
  category: string;
  heroImage?: string;
}

export function processHeroImage(post: BlogPost): string {
  // heroImageが既に設定されている場合はそれを使用
  if (post.heroImage) {
    return post.heroImage;
  }

  // 事前生成された画像のパスを生成
  const filename = `hero-${post.title.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50)}.png`;
  
  const imagePath = join(process.cwd(), 'public/images/hero', filename);
  
  // 事前生成された画像がある場合はそれを使用
  if (existsSync(imagePath)) {
    return `/images/hero/${filename}`;
  }

  // フォールバック：デフォルト画像を返すか、空文字を返す
  console.warn(`Warning: No hero image found for "${post.title}". Run "bun run prebuild:images" to generate hero images.`);
  return '';
}
