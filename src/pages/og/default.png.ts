import { readFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';
import type { APIRoute } from 'astro';
import satori from 'satori';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const FONT_PATH_REGULAR = './src/assets/fonts/BIZUDPGothic-Regular.ttf';
const FONT_PATH_BOLD = './src/assets/fonts/BIZUDPGothic-Bold.ttf';

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

export const GET: APIRoute = async () => {
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
											fontSize: '72px',
											fontWeight: 700,
											lineHeight: 1.1,
											letterSpacing: '-0.02em',
										},
										children: 'satoru.work',
									},
								},
								{
									type: 'div',
									props: {
										style: {
											fontSize: '32px',
											opacity: 0.9,
											lineHeight: 1.3,
										},
										children: 'Blog',
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
									props: { children: 'BIZ UDPGothic' },
								},
								{
									type: 'div',
									props: { children: 'OG image' },
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
