import { useEffect, useState } from 'react';
import './Seance.scss';
import { RouteComponentProps } from 'react-router';
import { fancyTimeFormat } from '../../../utils/shared/date';
import Bento from '../../../components/layout/Bento';
import { IonContent, IonHeader, IonPage } from '@ionic/react';
import Nav from '../../../components/layout/Nav';
import { Link } from 'react-router-dom';
import { supabase } from '../../../services/supabaseClient';
import { orderStepsBySeanceIndex } from '../run/run.utils';
import ExerciceImg from '../../../components/exercices/Illustration';

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
            <div className='page-seance__exercices d-flex flex-column flex-justify-stretch flex-align-center w-100'>
              {seance?.map((exo) => {
                return (
                  <Bento
                    key={exo['id']}
                    className={
                      exo.est_superset
                        ? 'color-white superset-bento'
                        : 'bg-grey-1'
                    }
                  >
                    <div className='w-100 border-radius d-flex flex-column flex-justify-center flex-align-center '>
                      <h3 className='m-b-1 m-i-3'>
                        {exo.exo.name_fr || exo.exo.name_en}
                      </h3>
                      <div className='d-flex flex-row flex-align-center flex-gap'>
                        <div className='illu-container'>
                          <ExerciceImg exoImages={exo.exo.images} />
                        </div>
                        <div className='d-flex flex-align-center'>
                          <span>{exo.nb_series} séries</span>
                        </div>
                        <div className='d-flex flex-column m-b-2'>
                          <span className='d-flex flex-align-center flex-justify-start'>
                            {!exo.charge && 'x '}
                            {exo.nb_reps}
                            {exo.temps_action && exo.temps_action + 's'}
                            {exo.temps_action && (
                              <i className='iconoir-wristwatch text-l'></i>
                            )}
                            {exo.charge && ' x ' + exo.charge + 'kg'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className='exo-bento-chips d-flex flex-align-center flex-justify-start text-m'>
                      <span className='exo-bento-chip d-flex- flex-justify-center flex-align-center'>
                        <i className='iconoir-timer'></i>
                        {fancyTimeFormat(exo.temps_repos)}
                      </span>
                    </span>
                  </Bento>
                );
              })}
            </div>
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
