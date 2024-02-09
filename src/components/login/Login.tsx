import './Login.scss';
import { supabase } from '../../services/supabaseClient';
import {
  IonButton,
  IonIcon,
  IonInput,
  useIonLoading,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import { useState } from 'react';
import { eye, lockClosed } from 'ionicons/icons';
function LoginForm() {
  const router = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();

  async function login(e: React.FormEvent<HTMLFormElement>) {
    console.log('🚀 ~ e:', e);
    e.preventDefault();
    await showLoading();

    const params = {
      email,
      password,
    };

    try {
      const { data, error } = await supabase.auth.signInWithPassword(params);
      if (data.user) {
        await showToast({
          message: `Bienvenue !`,
          duration: 2000,
          position: 'top',
          cssClass: 'bg-success',
        });
        router.push('/', 'root', 'replace');
      }
      if (error) throw error;
    } catch (e: any) {
      await showToast({
        message: e.error_description || e.message,
        duration: 3000,
        position: 'top',
        cssClass: 'bg-success',
      });
    } finally {
      await hideLoading();
    }
  }

  return (
    <div className='d-flex flex-column w-100 m-top-1 flex-align-center '>
      <h2>Connexion</h2>
      <form className='d-flex flex-column flex-gap w-100 ' onSubmit={login}>
        <IonInput
          className='rcoach-input'
          type='text'
          name='email'
          placeholder='Email Address'
          error-text='Please enter a valid email'
          value={email}
          onIonChange={(e) => setEmail(e.detail.value ?? '')}
        />
        <IonInput
          className='rcoach-input'
          type='password'
          name='password'
          placeholder='Mot de passe'
          value={password}
          onIonInput={(e) => {
            console.log('e', e);
            setPassword(e.detail.value ?? '');
          }}
        />
        <a className='forgot-password label' href='#'>
          Mot de passe oublié ?
        </a>
        <div className='d-flex flex-column flex-gap-s flex-align-center'>
          <IonButton
            type='submit'
            fill='clear'
            className='btn btn-l bg-primary-r-gradient'
          >
            Me connecter
          </IonButton>
          <span className='label w-100 text-align-center'>
            Pas encore de compte ? <a href='#'>M'inscrire</a>
          </span>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
