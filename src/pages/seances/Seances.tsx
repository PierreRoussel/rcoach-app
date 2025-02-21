import { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';

import PageHeaderIllu from '../../components/layout/PageHeaderIllu';
import Bento from '../../components/layout/Bento';
import Avatar from '../../components/layout/Avatar';

import fusee from '../../styles/images/fusee.png';
import Nav from '../../components/layout/Nav';
import { loginStore } from '../../stores/login.store';
import { User } from '@supabase/supabase-js';
import { getIncomingSeances } from '../../services/seances.service';
import { getDateString } from '../../utils/shared/date';

import './styles.scss';

export default function Seances() {
  const [seances, setSeances] = useState<any[] | null>(null);

  useEffect(() => {
    const getData = async () => {
      const user: User = await loginStore.get('user');

      getIncomingSeances(user.id, new Date(), (data, error) => {
        setSeances(data);
      });
    };
    getData();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <Nav />
      </IonHeader>
      <IonContent className='ion-padding'>
        <div className='d-flex flex-column flex-justify-start flex-align-center h-100'>
          <PageHeaderIllu>
            <img className='m-top-1' src={fusee} alt='' width='210' />
            <h1>Séances</h1>
          </PageHeaderIllu>
          <div className='content animate-in d-flex flex-column flex-align-start w-100 flex-gap-s'>
            <h3>Activités</h3>
            <div className='d-flex activites-container'>
              <Link to={`emom`} className='activites-link'>
                <Bento className='activites-bento'>
                  <Avatar chain={'EMOM Timer'} couleur='var(--bien-dark)' />
                  <div className='d-flex flex-column'>EMOM Timer</div>
                </Bento>
              </Link>
              <Link to={`emom`} className='activites-link'>
                <Bento className='activites-bento'>
                  <Avatar chain={'EMOM Timer'} couleur='var(--primary-l-5)' />
                  <div className='d-flex flex-column'>EMOM Timer</div>
                </Bento>
              </Link>
            </div>
            <h3>Séances programmées</h3>
            {seances?.map((seance, index) => {
              const isToday =
                new Date(seance.date_programmation).setHours(0, 0, 0, 0) ===
                new Date().setHours(0, 0, 0, 0);
              return (
                <>
                  {isToday && index == 0 && (
                    <span className='is-today-label' style={{ color: '#888' }}>
                      Séance(s) du jour
                    </span>
                  )}
                  <Link
                    className={`w-100 ${
                      isToday
                        ? 'relative bg-primary-r-gradient-shadow border-primary-r border-radius seance-today'
                        : 'color-black'
                    }`}
                    to={`seance/${seance.id}`}
                    key={seance.id}
                  >
                    <Bento
                      className={`d-flex flex-justify-start flex-align-center flex-gap ${
                        isToday ? 'bg-primary-r-gradient' : ''
                      }`}
                    >
                      <Avatar
                        chain={seance.libelle}
                        couleur={seance.couleur || null}
                      />
                      <div className='d-flex flex-column'>
                        {seance.libelle}
                        <i
                          style={{
                            ...(isToday
                              ? { color: '#ddd' }
                              : { color: '#888' }),
                          }}
                        >
                          {getDateString(new Date(seance.date_programmation))}
                        </i>
                      </div>
                      <i className='iconoir-nav-arrow-right m-left-auto'></i>
                    </Bento>
                  </Link>
                </>
              );
            })}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
