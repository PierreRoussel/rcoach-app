import { Suspense, useEffect, useRef, useState } from 'react';
import { getNbSerieSucceeded, getRpe, groupByExercice } from './logs.utils';

import './RecapRun.scss';
import { supabase } from '../../../services/supabaseClient';
import { RouteComponentProps } from 'react-router';
import { getDateString, getDayPartString } from '../../../utils/shared/date';
import Bento from '../../../components/layout/Bento';
import ExoRecap from '../../../components/journal/ExoRecap';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonModal,
  IonPage,
  IonPopover,
} from '@ionic/react';
import Nav from '../../../components/layout/Nav';

interface RecapRunPageProps
  extends RouteComponentProps<{
    id: string;
  }> {}

export const RecapRun: React.FC<RecapRunPageProps> = ({ match }) => {
  const [run, setRun] = useState<any | null>();
  const [seance, setSeance] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  const modal = useRef<HTMLIonModalElement>(null);

  const runId = match.params.id || '0';

  const getData = async () => {
    const { data } = await supabase
      .from('runs')
      .select('*, seanceUtilisateur(libelle, id)')
      .eq('id', runId)
      .limit(1)
      .single();
    const endTime = new Date(data.created_at);
    endTime.setSeconds(endTime.getSeconds() + data.temps_total);
    setRun({ ...data, end_time: endTime });
    getExos(data.seanceUtilisateur.id, data?.logs);
  };

  const getExos = async (seanceId: number, logs: any) => {
    const { data } = await supabase
      .from('seanceExo')
      .select('*, exo(name_en,name_fr)')
      .eq('seance', seanceId);
    const orderedExos: any[] | undefined = data?.sort(
      (a: any, b: any) => a.seanceIndex - b.seanceIndex
    );
    setSeance(orderedExos || []);
    setLogs(groupByExercice(logs, data?.length || 1));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <Nav />
      </IonHeader>
      <IonContent className='ion-padding'>
        <div className='recap-exo animate-in d-flex flex-column flex-justify-start flex-align-center h-100 w-100'>
          {run && (
            <>
              <h1 className='text-l'>
                Séance {run.seanceUtilisateur.libelle}{' '}
                {getDayPartString(new Date(run.created_at))}
              </h1>
              <span className='text-m d-flex flex-justify-start flex-align-center'>
                <i className='iconoir-gym m-i-1'></i>
                {getDateString(new Date(run.date))},{' de '}
                {new Date(run.created_at).toLocaleTimeString('fr', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {' à '}²
                {run.end_time.toLocaleTimeString('fr', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <div className='recap-exos w-100 d-flex flex-column flex-gap-s'>
                {seance.map((exo) => (
                  <Bento key={exo.id}>
                    <ExoRecap
                      nbSerieGoal={exo.nb_series}
                      nbSerieDone={getNbSerieSucceeded(
                        logs[exo.seanceIndex - 1]
                      )}
                      exoLibelle={exo.exo.name_fr || exo.exo.name_en}
                      tpsRepos={exo.temps_repos}
                      tpsAction={exo.temps_action}
                      charge={exo.charge}
                      reps={exo.nb_reps}
                      rpe={getRpe(logs, exo.seanceIndex)}
                    />
                  </Bento>
                ))}
              </div>
            </>
          )}
          <IonButton size='large' fill='clear' id='popover-button-infos'>
            <i slot='icon-only' className='iconoir-info-circle'></i>
          </IonButton>
          <IonModal
            ref={modal}
            trigger='popover-button-infos'
            initialBreakpoint={0.25}
          >
            <IonContent className='ion-padding'>
              <IonList>
                <IonItem lines='none' detail={false}>
                  <div className='shower easy'></div> Exercice réalisé
                  facilement, encore des reps en réserve
                </IonItem>
                <IonItem lines='none' detail={false}>
                  <div className='shower perfect'></div> Diffculté parfaite, ni
                  plus ni moins.
                </IonItem>
                <IonItem lines='none' detail={false}>
                  <div className='shower hard'></div> En échec ou incapable
                  d'aller plus loin pour le moment.
                </IonItem>
              </IonList>
            </IonContent>
          </IonModal>
        </div>
      </IonContent>
    </IonPage>
  );
};
