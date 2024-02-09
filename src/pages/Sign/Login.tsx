import { useState } from 'react';
import {
  IonContent,
  IonPage,
  useIonToast,
  useIonLoading,
} from '@ionic/react';
import { supabase } from '../../services/supabaseClient';
import SignIllustration from '../../components/login/SignIllustration';
import LoginForm from '../../components/login/Login';
import fit_tracker from '../../styles/images/fit_tracker.png';

export function LoginPage() {
  const [email, setEmail] = useState('');

  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await showLoading();
    try {
      await supabase.auth.signInWithOtp({ email });
      await showToast({ message: 'Check your email for the login link!' });
    } catch (e: any) {
      await showToast({
        message: e.error_description || e.message,
        duration: 5000,
      });
    } finally {
      await hideLoading();
    }
  };
  return (
    <IonPage>
      <div className='animate-in d-flex flex-column flex-justify-start flex-align-center h-100'>
        <SignIllustration>
          <img src={fit_tracker} alt='' />
        </SignIllustration>

        <IonContent className='ion-padding'>
          <LoginForm />
        </IonContent>
      </div>
    </IonPage>
  );
}
