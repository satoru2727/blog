import type { APIRoute, GetStaticPaths } from 'astro';
import { glob } from 'glob';
import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';
import { renderOgpImageBuffer } from '../../utils/generateOgpImage';

export const getStaticPaths: GetStaticPaths = async () => {
  const postsPath = path.join(process.cwd(), 'src/content/blog');
  // Using `*.md` as per previous successful implementation for hero images.
  // If `**/*.md` is needed for nested directories, this can be changed.
  const postFiles = await glob('*.md', { cwd: postsPath });

  const paths = [];

  for (const file of postFiles) {
    const filePath = path.join(postsPath, file);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data } = matter(fileContent);

    const slug = file.replace(/\.md$/, '');

    // Skip if ogpImage or heroImage is already defined in frontmatter
    if (data.ogpImage || data.heroImage) {
      console.log(`Skipping OGP image generation for '${slug}' as 'ogpImage' or 'heroImage' is already defined.`);
      continue;
    }

    if (!data.title || !data.category) {
      console.warn(`Skipping OGP image for '${slug}' due to missing 'title' or 'category' in frontmatter.`);
      continue;
    }

    paths.push({
      params: { slug },
      // Including slug in props as per task description for clarity if needed by GET
      props: { title: data.title, category: data.category, slug: slug }, 
    });
  }

  return paths;
};

export const GET: APIRoute = async ({ props }) => {
  // The slug from props might be useful for logging or if renderOgpImageBuffer needed it
  const { title, category, slug } = props; 

  if (!title || !category) {
    // This case should ideally be prevented by getStaticPaths
    console.error(`Missing title or category for OGP image generation. Slug: ${slug}`);
    return new Response('Missing title or category', { status: 400 });
  }

  try {
    const imageBuffer = await renderOgpImageBuffer({ title, category });
    return new Response(imageBuffer, {
      headers: { 'Content-Type': 'image/png' },
    });
  } catch (error) {
    console.error(`Error generating OGP image for slug '${slug}' (Title: "${title}", Category: "${category}"):`, error);
    return new Response('Error generating OGP image', { status: 500 });
  }
};
