import { IonContent, IonPage } from '@ionic/react';
import './Home.scss';

import Logo from '../styles/logo.png';
import pwa from '../styles/images/pwa.png';

import Historique from '../components/bentos/Historique';
import Bento from '../components/layout/Bento';
import Header from '../components/home/Header';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className='ion-padding'>
        <div className='index d-flex flex-column w-100 flex-align-center flex-justify-start flex-gap'>
          <img className='m-b-3' src={Logo} alt='' width='200' />
          <Historique />
          <Bento className='border-primary-r'>
            <div className='d-flex flex-justify-between flex-align-center'>
              <div className='d-flex flex-column flex-justify-start'>
                <i className='label'>Actualités</i>
                <span>
                  L'application est également accessible sur le web,{' '}
                  <a target='_blank' className='color-primary-r' href='https://rcoach-admin-react.vercel.app'>
                    rcoach.app
                  </a>
                </span>
              </div>
              <div className='d-flex flex-align-center'>
                <img
                  alt='application sport format progressive web app pwa ou web'
                  src={pwa}
                  width={150}
                />
              </div>
            </div>
          </Bento>
          <Bento className='bg-primary-r-gradient'>
            <Header />
          </Bento>
          <div className='d-flex w-100 flex-justify-between'>
            <Link to={'/journal'}>
              <Bento className='bento-half flex-gap d-flex flex-align-center'>
                <i className='iconoir-graph-up'></i>Journal
                <i className='iconoir-nav-arrow-right m-left-auto'></i>
              </Bento>
            </Link>
            <Link to={'/account'}>
              <Bento className='bento-half flex-gap d-flex flex-align-center'>
                <i className='iconoir-user'></i>Compte
                <i className='iconoir-nav-arrow-right m-left-auto'></i>
              </Bento>
            </Link>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
