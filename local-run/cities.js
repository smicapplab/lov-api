import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROVINCES_URL = 'https://psgc.gitlab.io/api/provinces';
const BARANGAYS_URL = 'https://psgc.gitlab.io/api/cities-municipalities';
const PROVINCES_FILE = path.join(__dirname, '..', 'src', 'lib', 'data', 'geo', 'provinces.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'lib', 'data', 'geo', 'cities');

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
  return barangaysData.map(item => ({
    name: item.name,
    code: item.code,
    psgc: item.psgc10DigitCode
  })).sort((a, b) => a.name.localeCompare(b.name));
}

async function processCitiesMunicipalities(provinceData, citiesData) {
  const processedCities = [];

  for (const city of citiesData) {
    console.log(`  Fetching barangays for ${city.name}...`);
    const barangaysData = await fetchBarangays(city.code);
    processedCities.push({
      name: city.name,
      code: city.code,
      psgc: city.psgc10DigitCode,
      barangays: processBarangays(barangaysData)
    });
  }

  return {
    province: provinceData.name,
    code: provinceData.code,
    cities: processedCities.sort((a, b) => a.name.localeCompare(b.name))
  };
}

async function writeToFile(data, filename) {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const filePath = path.join(OUTPUT_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`Data written to ${filePath}`);
}

export async function fetchCitiesMunicipalitiesMain() {
  try {
    const provinces = await readProvinces();
    
    for (const province of provinces) {
      console.log(`Fetching data for ${province.name}...`);
      const citiesData = await fetchCitiesMunicipalities(province.code);
      const processedData = await processCitiesMunicipalities(province, citiesData);
      await writeToFile(processedData, `${province.code}.json`);
    }

    console.log('All data has been processed and saved.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}