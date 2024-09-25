import { json } from '@sveltejs/kit';
import { readFile } from 'fs/promises';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { provinceCode, citiesOnly = false } = await request.json();
	try {
		const filePath = "src/routes/api/data/geo/cities/" + provinceCode + ".json";

		// Read the file
		const data = await readFile(filePath, 'utf8');

		// Parse the JSON data
		let citiesData = JSON.parse(data);

		if (citiesOnly) {
			// Remove barangays from each city
			citiesData.cities = citiesData.cities.map(city => {
				// eslint-disable-next-line no-unused-vars
				const { barangays, ...cityWithoutBarangays } = city;
				return cityWithoutBarangays;
			});
		}

		// Return the data as JSON
		return json(citiesData);
	} catch (error) {
		console.error('Error reading cities data:', error);
		return json({ error }, { status: 500 });
	}
}