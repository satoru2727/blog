function parseCookieHeader(cookieHeader: string | null): Map<string, string> {
	const cookies = new Map<string, string>();
	if (!cookieHeader) return cookies;

	for (const part of cookieHeader.split(';')) {
		const [rawName, ...rest] = part.trim().split('=');
		if (!rawName) continue;
		cookies.set(rawName, decodeURIComponent(rest.join('=')));
	}

	return cookies;
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
	env: Record<string, unknown>;
};

function htmlResponse(body: string, headers?: HeadersInit): Response {
	return new Response(body, {
		status: 200,
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'Cache-Control': 'no-store',
			...headers,
		},
	});
}

export const onRequest = async ({ request, env }: OnRequestContext): Promise<Response> => {
	const clientId = getEnvString(env, 'GITHUB_CLIENT_ID');
	const clientSecret = getEnvString(env, 'GITHUB_CLIENT_SECRET');

	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const redirectUri = new URL('/api/auth/github/callback', url.origin).toString();

	const cookies = parseCookieHeader(request.headers.get('Cookie'));
	const expectedState = cookies.get('decap_cms_github_state');

	if (!code || !state || !expectedState || state !== expectedState) {
		return new Response('Invalid state', {
			status: 400,
			headers: {
				'Cache-Control': 'no-store',
			},
		});
	}

	const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			client_id: clientId,
			client_secret: clientSecret,
			code,
			redirect_uri: redirectUri,
			state,
		}),
	});

	if (!tokenResponse.ok) {
		return new Response('Failed to fetch access token', {
			status: 502,
			headers: {
				'Cache-Control': 'no-store',
			},
		});
	}

	const tokenJson: unknown = await tokenResponse.json();
	if (
		typeof tokenJson !== 'object' ||
		tokenJson === null ||
		!('access_token' in tokenJson) ||
		typeof tokenJson.access_token !== 'string'
	) {
		return new Response('Invalid token response', {
			status: 502,
			headers: {
				'Cache-Control': 'no-store',
			},
		});
	}

	const token = tokenJson.access_token;

	return htmlResponse(
		`<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="robots" content="noindex" />
		<title>Authorization</title>
	</head>
	<body>
		<script>
			(() => {
				const payload = JSON.stringify({ token: ${JSON.stringify(token)} });
				const message = 'authorization:github:success:' + payload;

				if (window.opener) {
					window.opener.postMessage(message, '*');
				}

				window.close();
			})();
		</script>
	</body>
</html>
`,
		{
			'Set-Cookie': 'decap_cms_github_state=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax',
		},
	);
};
