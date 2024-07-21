import { formatDateWithRightTimeZoneOffset } from '../utils/shared/date';
import { supabase } from './supabaseClient';

const utilisateur_ressentis = 'utilisateur_ressentis';
const ressenti_energie = 'ressenti_energie';
const ressenti_nutrition = 'ressenti_nutrition';

export const getRessentiByDate = async (
  userId: string,
  date = new Date(),
  callback: any
) => {
  date = formatDateWithRightTimeZoneOffset(date);
  const { data, error } = await supabase
    .from(utilisateur_ressentis)
    .select(
      '*, ressenti_energie(libelle, couleur, icon_name), ressenti_nutrition(libelle, couleur)'
    )
    .eq('utilisateur', userId)
    .eq('date_ressenti_utilisateur', date.toISOString())
    .maybeSingle();
  return callback(data, error);
};

export const upsertUtilisateurRessenti = async (
  userId: string,
  { date = new Date(), ressenti_energie = null },
  callback: any
) => {
  date = formatDateWithRightTimeZoneOffset(date);
  const { data, error } = await supabase
    .from(utilisateur_ressentis)
    .upsert({
      'utilisateur': userId,
      'date_ressenti_utilisateur': date,
      'ressenti_energie': ressenti_energie,
      'have_been_checked': true,
    })
    .select();
  return callback(data, error);
};

export const upsertUtilisateurNutrition = async (
  userId: string,
  { date = new Date(), ressenti_nutrition = null },
  callback: any
) => {
  date = formatDateWithRightTimeZoneOffset(date);
  const { data, error } = await supabase
    .from(utilisateur_ressentis)
    .upsert({
      'utilisateur': userId,
      'date_ressenti_utilisateur': date,
      'ressenti_nutrition': ressenti_nutrition,
      'have_been_checked': true,
    })
    .select();
  return callback(data, error);
};

export const getRessentisEnergie = async (callback: any) => {
  const { data, error } = await supabase
    .from(ressenti_energie)
    .select('*')
    .order('index');
  return callback(data, error);
};

export const getRessentisNutrition = async (callback: any) => {
  const { data, error } = await supabase
    .from(ressenti_nutrition)
    .select('*')
    .order('index');
  return callback(data, error);
};

export const getPastRessentis = async (
  userId: string,
  callback: any,
  interval?: { start: string; end: string }
) => {
  const actualDate = new Date();
  actualDate.setHours(0, 0, 0);
  const { data, error } = await supabase
    .from(utilisateur_ressentis)
    .select('*, ressenti_energie(*), ressenti_nutrition(*)')
    .eq('utilisateur', userId)
    .gte('date_ressenti_utilisateur', interval?.start || '2024-01-01')
    .lte('date_ressenti_utilisateur', interval?.end || actualDate.toISOString())
  callback(data, error);
};
