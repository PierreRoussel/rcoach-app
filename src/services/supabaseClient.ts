import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environment'

const supabaseUrl: string = environment.REACT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey: string = environment.REACT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
