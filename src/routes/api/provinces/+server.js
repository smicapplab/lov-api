// import { json } from '@sveltejs/kit';
// import { readFile } from 'fs/promises';

// /** @type {import('./$types').RequestHandler} */
// export async function POST() {
// 	try {
// 		const filePath = 'src/routes/api/data/geo/provinces.json';
// 		const data = await readFile(filePath, 'utf8');

// 		// Parse the JSON data
// 		let provincesData = JSON.parse(data);

// 		// Return the data as JSON
// 		return json(provincesData);

// 	} catch (error) {
// 		console.error('Error reading provinces data:', error);
// 		return json({ error: 'Internal Server Error' }, { status: 500 });
// 	}
// }
