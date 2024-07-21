import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

const seanceUtilisateur = 'seanceUtilisateur';

export const getIncomingSeances = async (
  userId: number | string,
  date: Date,
  callback: (data: any[] | null, error: PostgrestError | null) => void
) => {
  if (!userId) return;
  if (!date) date = new Date();
  const { data, error } = await supabase
    .from(seanceUtilisateur)
    .select('*')
    .eq('sportif', userId)
    .not('date_programmation', 'is', null)
    .not('a_ete_executee', 'is', true)
    .order('date_programmation', { ascending: true });
  return callback(data, error);
};

export interface PastEvent {
  couleur: string;
  a_ete_executee: boolean;
  libelle: string;
  date_programmation: Date | null;
}

export const getPastSeances = async (
  userId: string,
  callback: any,
  interval?: { start: string; end: string }
) => {
  const actualDate = new Date();
  actualDate.setHours(0, 0, 0);
  const { data, error } = await supabase
    .from(seanceUtilisateur)
    .select('couleur, a_ete_executee, libelle, date_programmation')
    .eq('sportif', userId)
    .gte('date_programmation', interval?.start || '2024-01-01')
    .lte('date_programmation', interval?.end || actualDate.toISOString())
    .order('created_at', { ascending: false });
  callback(data, error);
};
