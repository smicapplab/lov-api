import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';

const OUTPUT_FILE = './static/data/general/banks.json';

export const getSupabaseClient = () => {
	const supabase = createClient(
		process.env.PUBLIC_SUPABASE_URL,
		process.env.PUBLIC_SUPABASE_ANON_KEY,
		{
			global: {
				fetch
			}
		}
	);
	return supabase;
};

export async function fetchMasterBanks() {
	try {
		const supabase = getSupabaseClient();
		const { data, error } = await supabase.from('master_banks').select('name, code'); // Await the result

		if (error) {
			throw error;
		}

        await fs.writeFile(OUTPUT_FILE, JSON.stringify(data, null, 2));
		console.log('Master Banks Data:', data); // Log the data
	} catch (error) {
		console.error('An error occurred:', error);
	}
}
