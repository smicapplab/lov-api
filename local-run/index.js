import { fetchMasterBanks } from "./banks.js";
import { fetchCitiesMunicipalitiesMain } from "./cities.js";
import { fetchProvincesMain } from "./provinces.js";

await fetchProvincesMain();
await fetchCitiesMunicipalitiesMain();
await fetchMasterBanks();