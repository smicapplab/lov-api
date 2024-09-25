import { promises as fs } from 'fs';

const API_URL = 'https://psgc.gitlab.io/api/provinces';
const OUTPUT_FILE = '../src/lib/data/geo/provinces.json';

async function fetchProvinces() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

function processProvinces(rawData) {
  return rawData.map(province => ({
    label: province.name,
    code: province.code,
    value: province.psgc10DigitCode
  }))
  .sort((a, b) => a.label.localeCompare(b.label));
}

async function writeToFile(data) {
  try {
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(data, null, 2));
    console.log(`Data successfully written to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error writing to file:', error);
    throw error;
  }
}

export async function fetchProvincesMain() {
  try {
    const rawData = await fetchProvinces();
    const processedData = processProvinces(rawData);
    await writeToFile(processedData);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}