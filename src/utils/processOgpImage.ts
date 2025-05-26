// No specific imports needed for this simplified function.

interface PostFrontmatter {
  slug: string;
  ogpImage?: string; // For new OGP specific images
  heroImage?: string; // For backward compatibility
  // Other frontmatter fields like title, category are not directly used by this function
  // but might be part of the overall post object passed to it.
  title?: string;
  category?: string;
}

// This function processes post frontmatter to determine the OGP image path.
// It does not generate images itself.
export async function processOgpImage(
  post: Pick<PostFrontmatter, 'slug' | 'ogpImage' | 'heroImage'>
): Promise<string> {
  // 1. Check for a specific OGP image in frontmatter
  if (post.ogpImage && post.ogpImage.trim() !== '') {
    return post.ogpImage;
  }

  // 2. Check for a heroImage in frontmatter (for backward compatibility)
  if (post.heroImage && post.heroImage.trim() !== '') {
    return post.heroImage;
  }

  // 3. Default to the new statically generated OGP image path
  return `/ogp/${post.slug}.png`;
}
