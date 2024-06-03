import { useEffect, useState } from 'react';
import './Seance.scss';
import { RouteComponentProps } from 'react-router';
import { IonContent, IonHeader, IonPage } from '@ionic/react';
import Nav from '../../../components/layout/Nav';
import { Link } from 'react-router-dom';
import { supabase } from '../../../services/supabaseClient';
import { orderStepsBySeanceIndex } from '../run/run.utils';
import SeanceExos from './SeanceExos';

interface SeancePageProps
  extends RouteComponentProps<{
    id: string;
  }> {}

export const Seance: React.FC<SeancePageProps> = ({ match }) => {
  const runId = match.params.id || '0';
  const [seance, setSeance] = useState<any[] | null>(null);

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase
        .from('seanceExo')
        .select(`*, seanceUtilisateur(libelle), exo(name_en,name_fr,images)`)
        .eq('seance', runId);
      setSeance(orderStepsBySeanceIndex(data as any));
    };
    getData();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <Nav />
      </IonHeader>
      <IonContent className='ion-padding'>
        <div className='recap-exo animate-in d-flex flex-column flex-justify-start flex-align-center h-100 w-100'>
          <div className='animate-in page-seance d-flex flex-column flex-align-center flex-justify-start w-100'>
            <h1>Séance {seance?.[0]['seanceUtilisateur']['libelle']}</h1>
            <SeanceExos seance={seance} />
          </div>
          <Link
            to={`/run/${runId}`}
            className='btn start-seance bg-primary-r-gradient'
          >
            S'entraîner
            <i className='iconoir-nav-arrow-right'></i>
          </Link>
        </div>
      </IonContent>
    </IonPage>
  );
};
