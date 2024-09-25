export const handle = async ({ event, resolve }) => {
	// Define the allowed origins
	const allowedOrigins = ['http://localhost:5173', /\.koredorcapital\.com$/];

	const origin = event.request.headers.get('origin');
	const isAllowed = allowedOrigins.some((pattern) =>
		pattern instanceof RegExp ? pattern.test(origin) : pattern === origin
	);

	// Get the response from the endpoint or route
	const response = await resolve(event);

	if (isAllowed) {
		// Set CORS headers
		response.headers.set('Access-Control-Allow-Origin', origin);
		response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		response.headers.set('Access-Control-Allow-Credentials', 'true');
	}

	// Handle preflight requests for CORS
	if (event.request.method === 'OPTIONS') {
		return new Response(null, {
			headers: response.headers
		});
	}

	return response;
};
