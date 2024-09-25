import { json } from '@sveltejs/kit';
import provinces from '$lib/data/geo/provinces.json';

/** @type {import('./$types').RequestHandler} */
export async function POST() {
	try {
		return json(provinces);
	} catch (error) {
		console.error('Error reading provinces data:', error);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}