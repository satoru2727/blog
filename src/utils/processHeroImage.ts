import { existsSync } from 'fs';
import { join } from 'path';
import { generateHeroImage } from './generateHeroImage'; // generateHeroImage をインポート

interface BlogPost {
  title: string;
  category: string;
  slug: string;
  heroImage?: string;
}

export async function processHeroImage(post: BlogPost): Promise<string> {
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

  // 画像を生成
  try {
    const generatedImage = await generateHeroImage({
      title: post.title,
      category: post.category,
      slug: post.slug,
    });
    return generatedImage;
  } catch (error) {
    console.error(`Error generating hero image for post "${post.slug}":`, error);
    // フォールバック：空文字を返す
    console.warn(`Warning: No hero image found or generated for post "${post.slug}".`);
    return '';
  }
}
