import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROVINCES_URL = 'https://psgc.gitlab.io/api/provinces';
const BARANGAYS_URL = 'https://psgc.gitlab.io/api/cities-municipalities';
const PROVINCES_FILE = path.join(__dirname, '..', 'static', 'data', 'geo', 'provinces.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'static', 'data', 'geo', 'cities');

async function readProvinces() {
	const data = await fs.readFile(PROVINCES_FILE, 'utf8');
	return JSON.parse(data);
}

async function fetchData(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return await response.json();
}

async function fetchCitiesMunicipalities(provinceCode) {
	return fetchData(`${PROVINCES_URL}/${provinceCode}/cities-municipalities/`);
}

async function fetchBarangays(cityCode) {
	return fetchData(`${BARANGAYS_URL}/${cityCode}/barangays.json`);
}

function processBarangays(barangaysData) {
	return barangaysData
		.map((item) => ({
			label: item.name,
			value: item.code
		}))
		.sort((a, b) => a.label.localeCompare(b.label));
}

async function processCitiesMunicipalities(provinceData, citiesData) {
	const processedCities = [];

	for (const city of citiesData) {
		console.log(`  Fetching barangays for ${city.name}...${city.code}`);
		const barangaysData = await fetchBarangays(city.code);
		processedCities.push({
			label: city.name,
			value: city.code,
			barangays: processBarangays(barangaysData)
		});
	}

	return {
		province: provinceData.name,
		cities: processedCities.sort((a, b) => a.label.localeCompare(b.label))
	};
}

async function writeToFile(data, filename) {
	await fs.mkdir(OUTPUT_DIR, { recursive: true });
	const filePath = path.join(OUTPUT_DIR, filename);
	await fs.writeFile(filePath, JSON.stringify(data, null, 2));
	console.log(`Data written to ${filePath}`);
}


async function fetchMetroManilaDistricts() {
	return fetchData("https://psgc.gitlab.io/api/districts/");
}

async function fetchDistrictCities(districtData) {
	return fetchData(`https://psgc.gitlab.io/api/districts/${districtData.code}/cities/`);
}

async function processMetroManilaDistricts(provinceName, districts) {
	const processedCities = [];
	for (const district of districts) {
		const citiesData = await fetchDistrictCities(district);
		//console.log(citiesData)

		for (const city of citiesData) {
			const barangaysData = await fetchBarangays(city.code);
			processedCities.push({
				label: city.name.replace("City of ", ""),
				value: city.code,
				barangays: processBarangays(barangaysData)
			})
		}
	}

	return {
		province: provinceName,
		cities: processedCities.sort((a, b) => a.label.localeCompare(b.label))
	};
}

export async function fetchCitiesMunicipalitiesMain() {
	try {
		const provinces = await readProvinces();

		for (const province of provinces) {
			//console.log(`Fetching data for ${province.label}...`);

			if (province.value === '130000000') {
				const districts = await fetchMetroManilaDistricts();
				const processedDistricts = await processMetroManilaDistricts(province.label, districts);
				console.log(`${province.value}.json`)
				await writeToFile(processedDistricts, `${province.value}.json`);	
			} else {
				// const citiesData = await fetchCitiesMunicipalities(province.value);
				// const processedData = await processCitiesMunicipalities(province, citiesData);
				// await writeToFile(processedData, `${province.value}.json`);	
			}
		}

		// console.log('All data has been processed and saved.');
	} catch (error) {
		console.error('An error occurred:', error);
	}
}
