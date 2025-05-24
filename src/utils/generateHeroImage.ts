import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

interface GenerateImageOptions {
  title: string;
  category: string;
  slug: string;
  width?: number;
  height?: number;
}

export async function generateHeroImage(options: GenerateImageOptions): Promise<string> {
  const { title, category, slug, width = 1200, height = 630 } = options;
  
  // カテゴリごとの色設定
  const categoryColors: Record<string, { bg: string; gradient: string; accent: string }> = {
    tech: { bg: '#1e293b', gradient: '#334155', accent: '#3b82f6' },
    blog: { bg: '#0f172a', gradient: '#1e293b', accent: '#10b981' },
    tutorial: { bg: '#18181b', gradient: '#27272a', accent: '#f59e0b' },
    default: { bg: '#1e293b', gradient: '#334155', accent: '#94a3b8' }
  };

  const colors = categoryColors[category.toLowerCase()] || categoryColors.default;

  // SVGを生成
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.bg,
          background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.gradient} 100%)`,
          color: '#ffffff',
          fontFamily: 'BIZ UDGothic, sans-serif',
          padding: '60px',
          position: 'relative',
        },
        children: [
          // カテゴリバッジ
          {
            type: 'div',
            props: {
              style: {
                fontSize: '20px',
                fontWeight: '600',
                color: colors.accent,
                backgroundColor: `${colors.accent}20`,
                padding: '8px 20px',
                borderRadius: '20px',
                marginBottom: '30px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                border: `2px solid ${colors.accent}40`,
              },
              children: category,
            },
          },
          // タイトル
          {
            type: 'div',
            props: {
              style: {
                fontSize: title.length > 50 ? '40px' : '48px',
                fontWeight: '700',
                textAlign: 'center',
                lineHeight: '1.2',
                maxWidth: '900px',
                wordWrap: 'break-word',
              },
              children: title,
            },
          },
          // 装飾的な要素
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                width: '100px',
                height: '4px',
                backgroundColor: colors.accent,
                borderRadius: '2px',
              },
            },
          },
        ],
      },
    },
    {
      width,
      height,
      fonts: [
        {
          name: 'BIZ UDGothic',
          data: readFileSync(join(process.cwd(), 'assets/fonts/BIZUDGothic-Regular.ttf')),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'BIZ UDGothic',
          data: readFileSync(join(process.cwd(), 'assets/fonts/BIZUDGothic-Bold.ttf')),
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  // SVGをPNGに変換
  const pngBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  // ファイル名を生成（slugをベースに）
  const filename = `hero-${slug}.png`;

  // public/images/hero/ ディレクトリに保存
  const outputPath = join(process.cwd(), 'public/images/hero', filename);
  await sharp(pngBuffer).toFile(outputPath);

  return `/images/hero/${filename}`;
}
