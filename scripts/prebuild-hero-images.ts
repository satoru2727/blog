import { existsSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { generateHeroImage } from '../src/utils/generateHeroImage.js';

// ブログ投稿を手動で読み込む簡易版
function getBlogPosts() {
  const blogDir = join(process.cwd(), 'src/content/blog');
  const files = readdirSync(blogDir).filter(file => file.endsWith('.md'));
  
  return files.map(file => {
    const content = readFileSync(join(blogDir, file), 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (!frontmatterMatch) {
      throw new Error(`No frontmatter found in ${file}`);
    }
    
    // 簡易的なYAMLパース（実際のプロジェクトではyamlライブラリを使用）
    const frontmatter = frontmatterMatch[1];
    const title = frontmatter.match(/title:\s*["'](.+?)["']/)?.[1] || '';
    const category = frontmatter.match(/category:\s*["'](.+?)["']/)?.[1] || '';
    
    return {
      slug: file.replace('.md', ''),
      data: { title, category }
    };
  });
}

async function prebuildHeroImages() {
  console.log('🖼️  Hero images の事前生成を開始します...');
  
  // hero画像ディレクトリを作成
  const heroDir = join(process.cwd(), 'public/images/hero');
  if (!existsSync(heroDir)) {
    mkdirSync(heroDir, { recursive: true });
  }

  try {
    // ブログ投稿を取得
    const posts = getBlogPosts();
    
    let generatedCount = 0;
    let skippedCount = 0;

    for (const post of posts) {
      // 既存の画像があるかチェック
      const filename = `hero-${post.slug}.png`;
      
      const imagePath = join(heroDir, filename);
      
      if (existsSync(imagePath)) {
        console.log(`⏭️  スキップ: ${post.data.title} (image already exists)`);
        skippedCount++;
        continue;
      }

      // ヒーローイメージを生成
      try {
        console.log(`🎨 生成中: ${post.data.title}`);
        await generateHeroImage({
          title: post.data.title,
          category: post.data.category,
          slug: post.slug
        });
        generatedCount++;
        console.log(`✅ 完了: ${filename}`);
      } catch (error) {
        console.error(`❌ 失敗: ${post.data.title}`, error);
      }
    }

    console.log(`\n📊 結果:`);
    console.log(`   生成: ${generatedCount} images`);
    console.log(`   スキップ: ${skippedCount} images`);
    console.log(`✨ Hero images の事前生成が完了しました！`);

  } catch (error) {
    console.error('❌ Hero images の生成中にエラーが発生しました:', error);
    process.exit(1);
  }
}

prebuildHeroImages();
