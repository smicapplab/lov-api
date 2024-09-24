import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import provinces from '$lib/data/geo/provinces.json';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	// Check for API key in the request headers
	const apiKey = request.headers.get('X-API-Key');

	// Verify the API key
	if (!apiKey || apiKey !== env.API_KEY) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		return json(provinces);
	} catch (error) {
		console.error('Error reading provinces data:', error);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}