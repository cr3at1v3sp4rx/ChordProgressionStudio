// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchVendors = async () => {
  const { data, error } = await supabase.from('vendors').select('*');
  if (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }
  return data;
};
