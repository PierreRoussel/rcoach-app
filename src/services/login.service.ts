import { AuthTokenResponsePassword } from '@supabase/supabase-js';
import { loginStore } from '../stores/login.store';
import { supabase } from './supabaseClient';

export async function signInWithPasswordAndStore(params: {
  email: string;
  password: string;
}): Promise<AuthTokenResponsePassword> {
  const { data, error }: AuthTokenResponsePassword =
    await supabase.auth.signInWithPassword(params);
  if (data.user) {
    loginStore.set('user', data.user);
    console.log('loginStore', loginStore);
    return { data, error } as AuthTokenResponsePassword;
  }
  loginStore.clear();
  console.log('clear');
  return { data, error } as AuthTokenResponsePassword;
}
