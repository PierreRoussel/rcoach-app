import { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';

import { supabase } from '../../services/supabaseClient';
import PageHeaderIllu from '../../components/layout/PageHeaderIllu';
import Bento from '../../components/layout/Bento';
import Avatar from '../../components/layout/Avatar';
import { fancyTimeFormat, getDateString } from '../../utils/shared/date';

import journal from '../../styles/images/journal.png';
import Nav from '../../components/layout/Nav';

export default function Journal() {
  const [runs, setRuns] = useState<any[] | null>([]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase
        .from('runs')
        .select('*, seanceUtilisateur(libelle)')
        .order('created_at', { ascending: false });
      setRuns(data);
    };
    if (!runs?.length) getData();
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <Nav />
      </IonHeader>
      <IonContent className='ion-padding'>
        <div className='d-flex flex-column flex-justify-start flex-align-center h-100'>
          <PageHeaderIllu>
            <img className='m-top-1' src={journal} alt='' width='210' />
            <h1>Journal</h1>
          </PageHeaderIllu>
          <div className='content animate-in  d-flex flex-column flex-align-start w-100 flex-gap-s'>
            {runs?.map((run) => {
              return (
                <Link
                  key={run.date + run.id}
                  className='w-100'
                  to={`/journal/${run.id}`}
                >
                  <Bento>
                    <div className='d-flex flex-column flex-gap'>
                      <div className='d-flex flex-justify-between flex-align-center'>
                        <span className='text-s'>
                          {getDateString(new Date(run.date))}
                        </span>
                        <i className='iconoir-nav-arrow-right'></i>
                      </div>
                      <div className='d-flex flex-justify-between flex-align-center'>
                        <div className='d-flex flex-column w-100'>
                          <span className='text-s d-flex flex-justify-start flex-align-center'>
                            <i className='iconoir-gym'></i>
                            <span className='m-i-1'>
                              {new Date(run.created_at).toLocaleTimeString(
                                'fr',
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </span>
                          </span>
                          <span className='d-flex flex-align-end w-100'>
                            {run.seanceUtilisateur.libelle}
                            <i className='text-s m-i-1'>
                              en {fancyTimeFormat(run.temps_total)}
                            </i>
                          </span>
                        </div>
                        <Avatar>
                          <i className='iconoir-gym'></i>
                        </Avatar>
                      </div>
                    </div>
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
