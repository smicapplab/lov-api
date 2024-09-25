import { json } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import path from 'path';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { provinceCode, citiesOnly = false } = await request.json();
	try {
		// Construct the correct file path
		const filePath = path.join('src', 'lib', 'data', 'geo', 'cities', `${provinceCode}.json`);

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
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}