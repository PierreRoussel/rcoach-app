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
import SuccessCheck from '../components/shared/checks/SuccessCheck';
import ThemeSwitcher from '../components/shared/buttons/ThemeSwitcher';
import Workout from '../styles/images/workout';
import RessentiNutrition from '../components/bentos/RessentiNutrition';

const Home: React.FC = () => {
  const [isRessentisPushed, setIsRessentisPushed] = useState<boolean>(false);
  const [choicesRessentisEnergie, setChoicesRessentisEnergie] = useState<
    any[] | null
  >(null);
  const [isRessentiEnergieSet, setIsRessentiEnergieSet] = useState(true);
  const [isRessentiNutritionSet, setIsRessentiNutritionSet] = useState(true);

  useEffect(() => {
    initTodayRessenti();
    if (!isRessentiEnergieSet) getRessentisChoices();
  }, [isRessentiEnergieSet]);

  async function initTodayRessenti() {
    // on tente de récupérer le ressenti en store
    const dailyRessenti: any = await loginStore.get('ressentis');

    // si on a pas de ressenti en store ou qu'il ne correspond pas à la date actuelle
    // on essaie de récupérer en distance
    if (
      !dailyRessenti ||
      !isSameDay(new Date(), new Date(dailyRessenti.date_ressenti_utilisateur))
    ) {
      const user: User = await loginStore.get('user');

      return getRessentiByDate(user.id, new Date(), (data: any, error: any) => {
        // si on a un ressenti en distance, on le met en store et on actualise l'affichage
        // des blocs de récupération de ressenti
        if (data) {
          loginStore.set('ressentis', data);
        }
        handleRessentisDisplay(data);
      });
    } else {
      // si on a un ressenti en store et qu'il est au bon jour, on check les
      // ressentis à récupérer et on gère l'affichage
      handleRessentisDisplay(dailyRessenti);
    }
  }

  function handleRessentisDisplay(ressenti: any) {
    if (!ressenti || !ressenti.ressenti_energie) setIsRessentiEnergieSet(false);
    if (!ressenti || !ressenti.ressenti_nutrition)
      setIsRessentiNutritionSet(false);
  }

  function getRessentisChoices() {
    getRessentisEnergie((data: any, error: any) => {
      setChoicesRessentisEnergie(data);
    });
  }

  async function energieRessentiSelected(id: any) {
    const user: User = await loginStore.get('user');
    setIsRessentiEnergieSet(true)
    upsertUtilisateurRessenti(
      user.id,
      {
        date: new Date(),
        ressenti_energie: id,
      },
      (data: any, error: any) => {
        loginStore.set('ressentis', data);
        
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
          {!isRessentiEnergieSet && choicesRessentisEnergie && (
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
          {!isRessentiNutritionSet && <RessentiNutrition />}
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
