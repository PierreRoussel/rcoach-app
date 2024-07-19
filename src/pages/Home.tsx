import { IonContent, IonFooter, IonPage, IonText } from '@ionic/react';
import './Home.scss';

import Logo from '../styles/logo.png';
import pwa from '../styles/images/pwa.png';
import illustrationFond from '../styles/images/workout.svg';

import Historique from '../components/bentos/Historique';
import Bento from '../components/layout/Bento';
import Header from '../components/home/Header';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getRessentiByDate,
  getRessentisEnergie,
  upsertUtilisateurRessenti,
} from '../services/ressentis.service';
import { loginStore } from '../stores/login.store';
import { User } from '@supabase/supabase-js';
import { isSameDay } from '../utils/shared/date';
import RessentiButton from '../components/shared/buttons/RessentiButton';
import NewsCheck from '../components/shared/checks/NewsCheck';
import SuccessCheck from '../components/shared/checks/SuccessCheck';
import ThemeSwitcher from '../components/shared/buttons/ThemeSwitcher';
import Workout from '../styles/images/workout';

const Home: React.FC = () => {
  const [ressentis, setRessentis] = useState<any[] | null>(null);
  const [isRessentisPushed, setIsRessentisPushed] = useState<boolean>(false);
  const [choicesRessentisEnergie, setChoicesRessentisEnergie] = useState<
    any[] | null
  >(null);

  useEffect(() => {
    initEnergieRessenti();
  }, []);

  async function initEnergieRessenti() {
    const storedRessentis: any = await loginStore.get('ressentis');
    if (
      storedRessentis &&
      isSameDay(new Date(), new Date(storedRessentis.date_ressenti_utilisateur))
    ) {
      return setRessentis(storedRessentis);
    }

    const user: User = await loginStore.get('user');
    getRessentiByDate(user.id, new Date(), (data: any, error: any) => {
      if (data) {
        setRessentis(data);
        loginStore.set('ressentis', data);
        return;
      }

      getRessentisChoices();
    });
  }

  function getRessentisChoices() {
    getRessentisEnergie((data: any, error: any) => {
      setChoicesRessentisEnergie(data);
    });
  }

  async function energieRessentiSelected(id: any) {
    const user: User = await loginStore.get('user');
    upsertUtilisateurRessenti(
      user.id,
      {
        date: new Date(),
        ressenti_energie: id,
      },
      (data: any, error: any) => {
        setTimeout(() => {
          setIsRessentisPushed(true);
        }, 510);
      }
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen={true} className='home-container'>
        <div className='theme-switcher'>
          <ThemeSwitcher />
        </div>
        <div className='home-illustration-container'>
          <img className='home-illustration-logo' src={Logo} />{' '}
          <div className='home-illustration'>
            <Workout />
          </div>
        </div>
        <div className='home-container--content'>
          <IonText className='home-container--content--title'>
            Votre suivi sur-mesure
          </IonText>
          <Historique />
          {!ressentis && choicesRessentisEnergie && (
            <div
              className={`ressentis-bento ${
                isRessentisPushed ? 'disappear' : ''
              }`}
            >
              <Bento className='ressentis-bento'>
                <div className='d-flex flex-column flex-justify-start'>
                  <span className='ressentis-bento--question'>
                    Comment te sens-tu aujourd'hui ?
                  </span>
                  <div className='ressentis-bento--news-check'>
                    <NewsCheck />
                  </div>
                  {isRessentisPushed && (
                    <div className='ressentis-bento--success-check'>
                      <SuccessCheck />
                    </div>
                  )}

                  <div className='ressentis-container d-flex flex-gap flex-align-center justify-content-between'>
                    {choicesRessentisEnergie.map((ressenti: any) => (
                      <RessentiButton
                        key={ressenti.id}
                        id={ressenti.id}
                        couleur={ressenti.couleur}
                        icone={ressenti.icon_name}
                        libelle={ressenti.libelle}
                        ressentiSelected={(id: any) =>
                          energieRessentiSelected(id)
                        }
                      ></RessentiButton>
                    ))}
                  </div>
                </div>
              </Bento>
            </div>
          )}
          <Bento className='border-primary-r'>
            <div className='d-flex flex-justify-between flex-align-center'>
              <div className='d-flex flex-column flex-justify-start'>
                <i className='label'>Actualités</i>
                <span>
                  L'application est également accessible sur le web,{' '}
                  <a
                    target='_blank'
                    className='color-primary-r'
                    href='https://rcoach-admin-react.vercel.app'
                  >
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
        </div>
      </IonContent>
      <IonFooter class='home-footer'>
        <div className='home-footer--inner'>
          <Link to={'/journal'}>
            <i className='iconoir-graph-up'></i>
            <span>Journal</span>
          </Link>
          <Link to={'/seance'}>
            <i className='iconoir-treadmill'></i>
            <span>Séances</span>
          </Link>
          <Link className='play-seance' to={'/seance'}>
            <i className='iconoir-play'></i>
          </Link>
          <Link to={'/calendrier'}>
            <i className='iconoir-calendar'></i>
            <span>Calendrier</span>
          </Link>
          <Link to={'/account'}>
            <i className='iconoir-user'></i>
            <span>Compte</span>
          </Link>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
