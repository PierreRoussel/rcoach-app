import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export const getIncomingSeances = async (
  userId: number | string,
  date: Date,
  callback: (data: any[] | null, error: PostgrestError | null) => void
) => {
  if (!userId) return;
  if (!date) date = new Date();
  const { data, error } = await supabase
    .from('seanceUtilisateur')
    .select('*')
    .eq('sportif', userId)
    .not('date_programmation', 'is', null)
    .not('a_ete_executee', 'is', true)
    .order('date_programmation', { ascending: true });
  return callback(data, error);
};
