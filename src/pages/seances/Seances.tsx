import { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';

import { supabase } from '../../services/supabaseClient';
import PageHeaderIllu from '../../components/layout/PageHeaderIllu';
import Bento from '../../components/layout/Bento';
import Avatar from '../../components/layout/Avatar';

import fusee from '../../styles/images/fusee.png';
import Nav from '../../components/layout/Nav';
import { loginStore } from '../../stores/login.store';
import { User } from '@supabase/supabase-js';
import { getIncomingSeances } from '../../services/seances.service';
import { getDateString } from '../../utils/shared/date';

export default function Seances() {
  const [seances, setSeances] = useState<any[] | null>(null);

  useEffect(() => {
    const getData = async () => {
      const user: User = await loginStore.get('user');

      // const { data } = await supabase
      //   .from('seanceUtilisateur')
      //   .select('*')
      //   .eq('sportif', user.id)
      //   .order('created_at', { ascending: false });

      getIncomingSeances(user.id, new Date(), (data, error) => {
        console.log('🚀 ~ error:', error);
        console.log('🚀 ~ data:', data);
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
            {seances?.map((seance) => {
              return (
                <Link
                  className='w-100 color-black'
                  to={`seance/${seance.id}`}
                  key={seance.id}
                >
                  <Bento className='d-flex flex-justify-start flex-align-center flex-gap'>
                    <Avatar chain={seance.libelle} />
                    <div className='d-flex flex-column'>
                      {seance.libelle}
                      <i style={{color:'#666'}}>
                        {getDateString(new Date(seance.date_programmation))}
                      </i>
                    </div>
                    <i className='iconoir-nav-arrow-right m-left-auto'></i>
                  </Bento>
                </Link>
              );
            })}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
