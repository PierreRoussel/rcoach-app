import { Storage } from '@ionic/storage';

export const loginStore = new Storage();

export async function initLoginStore() {
  return await loginStore.create();
}
