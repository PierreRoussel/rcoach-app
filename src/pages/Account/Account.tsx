import {
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  IonContent,
  IonButton,
  useIonRouter,
  IonItem,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import Nav from '../../components/layout/Nav';

export function AccountPage() {
  const [showToast] = useIonToast();
  const [session] = useState(async () => await supabase.auth.getSession());
  const [profile, setProfile] = useState({
    email: '',
  });
  const router = useIonRouter();

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      const userData = await supabase.auth.getUser();

      setProfile({
        email: userData.data.user?.email || 'No profile found!',
      });
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
      <IonHeader collapse='fade'>
        <IonToolbar>
          <Nav />
          <h1 className='ion-text-center'>Compte</h1>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <div>
          <span>{profile.email}</span>
        </div>
        <div className='ion-text-center'>
          <IonButton fill='clear' onClick={signOut}>
            Se déconnecter
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
