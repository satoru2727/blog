import { generateHeroImage } from './src/utils/generateHeroImage.ts';

async function test() {
  try {
    console.log('Testing hero image generation...');
    
    const imagePath1 = await generateHeroImage({
      title: 'Astroで始める静的サイト生成',
      category: 'tech'
    });
    console.log('Generated image 1:', imagePath1);
    
    const imagePath2 = await generateHeroImage({
      title: 'TypeScriptの型安全性を活用したモダンWeb開発',
      category: 'tutorial'
    });
    console.log('Generated image 2:', imagePath2);
    
    console.log('All images generated successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
