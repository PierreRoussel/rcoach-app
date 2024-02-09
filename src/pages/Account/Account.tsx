import {
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  IonContent,
  IonButton,
  useIonRouter,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export function AccountPage() {
  const [showToast] = useIonToast();
  const [session] = useState(async () => await supabase.auth.getSession());
  const [profile, setProfile] = useState({
    seances: [] as any,
  });
  const router = useIonRouter();

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      const userData = await supabase.auth.getUser();
      const { data, error, status } = await supabase
        .from('seanceUtilisateur')
        .select(`libelle`)
        .eq('sportif', userData.data.user?.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        console.log('🚀 ~ data:', data);
        setProfile({
          seances: data,
        });
      }
    } catch (error: any) {
      showToast({ message: error.message, duration: 2000 });
      await supabase.auth.signOut();
      router.push('/', 'root', 'replace');
    }
  };
  const signOut = async () => {
    router.push('/login', 'forward', 'replace');
    await supabase.auth.signOut();
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>
          {profile.seances.map((seance: { libelle: string }) => {
            return (
              <span key={`${new Date().getMilliseconds()}${seance.libelle}`}>
                {seance.libelle}
              </span>
            );
          })}
        </div>
        <div className='ion-text-center'>
          <IonButton fill='clear' onClick={signOut}>
            Log Out
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
