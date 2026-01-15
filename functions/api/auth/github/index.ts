function randomHex(bytes: number): string {
	const buffer = new Uint8Array(bytes);
	crypto.getRandomValues(buffer);

	return Array.from(buffer)
		.map((value) => value.toString(16).padStart(2, '0'))
		.join('');
}

function getEnvString(env: Record<string, unknown>, key: string): string {
	const value = env[key];
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error(`Missing environment variable: ${key}`);
	}
	return value;
}

type OnRequestContext = {
	request: Request;
	env?: Record<string, unknown>;
};

function readEnvValue(env: Record<string, unknown> | undefined, key: string): string {
	return getEnvString(env ?? globalThis.process?.env ?? {}, key);
}

export const onRequest = async ({ request, env }: OnRequestContext): Promise<Response> => {
	const clientId = readEnvValue(env, 'GITHUB_CLIENT_ID');

	const url = new URL(request.url);
	const state = randomHex(16);
	const redirectUri = new URL('/api/auth/github/callback', url.origin).toString();

	const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
	authorizeUrl.searchParams.set('client_id', clientId);
	authorizeUrl.searchParams.set('redirect_uri', redirectUri);
	authorizeUrl.searchParams.set('scope', 'public_repo');
	authorizeUrl.searchParams.set('state', state);

	const headers = new Headers({
		Location: authorizeUrl.toString(),
		'Set-Cookie': `decap_cms_github_state=${state}; Path=/; Max-Age=300; HttpOnly; Secure; SameSite=Lax`,
		'Cache-Control': 'no-store',
	});

	return new Response(null, { status: 302, headers });
};
