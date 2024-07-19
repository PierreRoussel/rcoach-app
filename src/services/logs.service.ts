import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

const table = 'runsExo';

export const bulkInsertExercicesLogs = async (
  request: any,
  callback: (data: any[] | null, err: PostgrestError | null) => void
) => {
  const { data, error } = await supabase
    .from(table)
    .insert([...request])
    .select();
  callback(data, error);
};

export const checkRelatedSeance = async (
  row_id: number | string,
  callback?: (data: any[] | null, err: PostgrestError | null) => void
) => {
  const { data, error } = await supabase.rpc('checkrelatedseance', { row_id: +row_id });
  if (callback) callback(data, error);
};
