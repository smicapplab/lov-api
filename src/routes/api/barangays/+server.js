// import { json } from '@sveltejs/kit';

// /** @type {import('./$types').RequestHandler} */
// export async function POST({ request }) {
// 	const { provinceCode, cityCode } = await request.json();
// 	try {
// 		const fileUrl = "https://lov.koredorcapital.com/data/geo/cities/${provinceCode}.json";

// 		console.log(citiesData)
// 		// Access cities data
// 		const city = citiesData.cities.find((c) => c.code === cityCode);

// 		if (!city) {
// 			return json({ error: 'City not found' }, { status: 404 });
// 		}

// 		// Return the data as JSON
// 		return json(city);
// 	} catch (error) {
// 		console.error('Error reading cities data:', error);
// 		return json({ error: 'Internal Server Error' }, { status: 500 });
// 	}
// }