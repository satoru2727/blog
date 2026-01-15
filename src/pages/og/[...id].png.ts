import { readFile } from 'node:fs/promises';
import { getCollection } from 'astro:content';
import { Resvg } from '@resvg/resvg-js';
import type { APIRoute } from 'astro';
import satori from 'satori';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const FONT_PATH_REGULAR = './src/assets/fonts/BIZUDPGothic-Regular.ttf';
const FONT_PATH_BOLD = './src/assets/fonts/BIZUDPGothic-Bold.ttf';

export async function getStaticPaths() {
	const posts = await getCollection('blog');
	return posts.map((post) => ({
		params: { id: post.id },
		props: {
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
		},
	}));
}

function formatDateJa(date: Date): string {
	return date.toLocaleDateString('ja-JP');
}

async function loadFonts(): Promise<
	{
		name: string;
		data: ArrayBuffer;
		weight?: 400 | 700;
		style?: 'normal' | 'italic';
	}[]
> {
	const regular = await readFile(FONT_PATH_REGULAR);
	const bold = await readFile(FONT_PATH_BOLD);

	const regularArrayBuffer = regular.buffer.slice(
		regular.byteOffset,
		regular.byteOffset + regular.byteLength,
	);
	const boldArrayBuffer = bold.buffer.slice(bold.byteOffset, bold.byteOffset + bold.byteLength);

	return [
		{
			name: 'BIZ UDPGothic',
			data: regularArrayBuffer,
			weight: 400,
			style: 'normal',
		},
		{
			name: 'BIZ UDPGothic',
			data: boldArrayBuffer,
			weight: 700,
			style: 'normal',
		},
	];
}

export const GET: APIRoute = async ({ props }) => {
	const { title, description, pubDate } = props as {
		title: string;
		description: string;
		pubDate: Date;
	};

	const fonts = await loadFonts();

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					background: '#0b1220',
					color: '#ffffff',
					padding: '64px',
				},
				children: [
					{
						type: 'div',
						props: {
							style: { display: 'flex', flexDirection: 'column', gap: '24px' },
							children: [
								{
									type: 'div',
									props: {
										style: {
											fontSize: '64px',
											fontWeight: 700,
											lineHeight: 1.1,
											letterSpacing: '-0.02em',
										},
										children: title,
									},
								},
								{
									type: 'div',
									props: {
										style: {
											fontSize: '28px',
											opacity: 0.9,
											lineHeight: 1.3,
											maxHeight: '4.0em',
											overflow: 'hidden',
										},
										children: description,
									},
								},
							],
						},
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								fontSize: '24px',
								opacity: 0.9,
							},
							children: [
								{
									type: 'div',
									props: { children: 'satoru.work' },
								},
								{
									type: 'div',
									props: { children: formatDateJa(pubDate) },
								},
							],
						},
					},
				],
			},
		},
		{
			width: OG_WIDTH,
			height: OG_HEIGHT,
			fonts,
		},
	);

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: OG_WIDTH,
		},
	});

	const png = resvg.render().asPng();
	return new Response(png as unknown as BodyInit, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
