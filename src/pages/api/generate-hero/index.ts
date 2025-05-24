import type { APIRoute } from 'astro';
import { generateHeroImage } from '../../../utils/generateHeroImage';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { title, category } = body;

    if (!title || !category) {
      return new Response(JSON.stringify({ error: 'title and category are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const imagePath = await generateHeroImage({ title, category });

    return new Response(JSON.stringify({ imagePath }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error generating hero image:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
