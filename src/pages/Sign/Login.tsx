import { IonContent, IonPage } from '@ionic/react';
import SignIllustration from '../../components/login/SignIllustration';
import LoginForm from '../../components/login/Login';
import fit_tracker from '../../styles/images/fit_tracker.png';

export function LoginPage() {
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
