import { supabase } from './supabaseClient';

export async function POST(
  seanceId: any,
  logs: any,
  temps_total: any,
  date: Date
) {
  const { data, error } = await supabase
    .from('runs')
    .insert([
      {
        seance_utilisateur: seanceId,
        logs: logs,
        temps_total: temps_total,
        date: date,
      },
    ])
    .select();
}

export const getExoImage = async (images: any, callback: any) => {
  if (!images.length) callback(null);
  const { data } = await supabase.storage
    .from('exercices_images')
    .getPublicUrl(`${images[0]}`);
  callback(data);
};
