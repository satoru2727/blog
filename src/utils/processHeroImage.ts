import { existsSync } from 'fs';
import { join } from 'path';
import { generateHeroImage } from './generateHeroImage';

interface BlogPost {
  title: string;
  category: string;
  slug: string;
  // heroImage field is no longer part of this interface's usage context
}

export async function processHeroImage(post: BlogPost): Promise<string> {
  const filename = `hero-${post.slug}.png`;
  const expectedImagePath = join(process.cwd(), 'public/images/hero', filename);
  const publicPath = `/images/hero/${filename}`;

  // Check if pre-generated image exists
  if (existsSync(expectedImagePath)) {
    return publicPath;
  }

  // If not, generate the image
  try {
    // generateHeroImage saves the file and returns the public path
    const generatedImagePublicPath = await generateHeroImage({
      title: post.title,
      category: post.category,
      slug: post.slug, // Ensure slug is passed to generateHeroImage
    });
    return generatedImagePublicPath;
  } catch (error) {
    console.error(`Error generating hero image for post "${post.slug}":`, error);
    console.warn(`Warning: Failed to generate hero image for post "${post.slug}".`);
    return ''; // Fallback to empty string if generation fails
  }
}
