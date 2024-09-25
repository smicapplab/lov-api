import { json } from '@sveltejs/kit';
import { readFile } from 'fs/promises';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { provinceCode, cityCode } = await request.json();
	try {
		// Construct the correct file path
		// const filePath = path.join('src', 'lib', 'data', 'geo', 'cities', `${provinceCode}.json`);
		const filePath = "src/routes/api/data/geo/cities/" + provinceCode + ".json";


		// Read the file
		const data = await readFile(filePath, 'utf8');

		// Parse the JSON data
		let citiesData = JSON.parse(data);

		// Find the city with the given code
		const city = citiesData.cities.find(c => c.code === cityCode);
		if (!city) {
			return json({ error: 'City not found' }, { status: 404 });
		}

		// Return the data as JSON
		return json(city);
	} catch (error) {
		console.error('Error reading cities data:', error);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}