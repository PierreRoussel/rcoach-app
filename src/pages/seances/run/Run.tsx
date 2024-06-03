import { useEffect, useRef, useState } from 'react';
import './Run.scss';
import { RouteComponentProps } from 'react-router';
import {
  IonActionSheet,
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import Nav from '../../../components/layout/Nav';
import {
  buildStepsFromSeance,
  isSeanceAtBeginning,
  orderStepsBySeanceIndex,
} from './run.utils';
import { supabase } from '../../../services/supabaseClient';
import { Run, SeanceStep } from './seance';
import Chronometre from '../../../components/exercices/Chronometre';
import SeanceStepDisplay from '../../../components/exercices/SeanceStepDisplay';
import SeanceStepTracker from '../../../components/exercices/SeanceStepTracker';
import CompletedSeance from '../../../components/exercices/CompletedSeance';
import { POST } from '../../../services/run.service';
import { getTimeDiffInSeconds } from '../../../utils/shared/date';
import SeanceExos from '../seance/SeanceExos';

interface RunPageProps
  extends RouteComponentProps<{
    id: string;
  }> {}

export const RunPage: React.FC<RunPageProps> = ({ match }) => {
  const seanceId = match.params.id || '0';
  const [seance, setSeance] = useState<any[] | null>(null);
  const [buildedSeance, setBuildedSeance] = useState<SeanceStep[] | null>(null);
  const [run, setRun] = useState<any>();
  const [inTransition, setInTransition] = useState<any>(false);
  const [currExo, setCurrExo] = useState<any>(null);
  const [nextExo, setNextExo] = useState<any>(null);
  const [logs, setLogs] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [serieLog, setSerieLog] = useState({});
  const [islastSerie, setIsLastSerie] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [recapSeance, setRecapSeance] = useState<any[] | null>(null);

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase
        .from('seanceExo')
        .select(
          `*, seanceUtilisateur(libelle), exo(name_en, name_fr, images,rowid)`
        )
        .eq('seance', seanceId);
      setSeance(data);
      setRecapSeance(orderStepsBySeanceIndex(data as any));
      setBuildedSeance(buildStepsFromSeance(data as any));
    };
    getData();
  }, []);

  const startSeance = () => {
    const initRun: Run = {
      seance: buildedSeance || [],
      beginTime: new Date(),
      currentStep: 0,
      currentStepExo: 0,
      currentStepExoSerie: 1,
      is_complete: false,
    };
    setRun(initRun);
    setCurrExo(initRun.seance[initRun.currentStep].exo[initRun.currentStepExo]);
    const nextStep = getNextStep(initRun);
    setNextExo(
      nextStep.seance[nextStep.currentStep].exo[nextStep.currentStepExo]
    );
  };

  const getNextStep = (actualRun: Run) => {
    if (!actualRun.seance[actualRun.currentStep]) {
      return {
        ...actualRun,
        currentStepExo: 0,
        currentStepExoSerie: 1,
        currentStep: actualRun.currentStep + 1,
        is_complete: true,
      };
    }
    const currentExo =
      actualRun.seance[actualRun.currentStep].exo[actualRun.currentStepExo];
    if (actualRun.currentStepExoSerie >= currentExo.nb_series) {
      // Pas de prochain exercice mais une prochaine étape, on continue
      if (actualRun.seance[actualRun.currentStep + 1]) {
        return {
          ...actualRun,
          currentStepExo: 0,
          currentStepExoSerie: 1,
          currentStep: actualRun.currentStep + 1,
        };
      }

      return {
        ...actualRun,
        currentStepExo: 0,
        currentStepExoSerie: 1,
        currentStep: actualRun.currentStep + 1,
        is_complete: true,
      };
    }
    return {
      ...actualRun,
      currentStepExoSerie: actualRun.currentStepExoSerie + 1,
    };
  };

  const nextStep = () => {
    checkIfLastSerieAndSetState();

    setInTransition(false);
    const nextStep = getNextStep(run);
    if (nextStep.is_complete) endRun(nextStep);
    setRun(nextStep);
    if (nextStep.seance[nextStep.currentStep]) {
      setCurrExo(
        nextStep.seance[nextStep.currentStep].exo[nextStep.currentStepExo]
      );
    }
    const nextExoStep = getNextStep(nextStep);
    if (nextExoStep.seance[nextExoStep.currentStep]) {
      setNextExo(
        nextExoStep.seance[nextExoStep.currentStep].exo[
          nextExoStep.currentStepExo
        ]
      );
    }
  };

  const endRun = (run: Run) => {
    POST(
      seanceId,
      logs,
      getTimeDiffInSeconds(run.beginTime, new Date()),
      new Date()
    );
  };

  const getTransition = () => {
    return (
      <Chronometre
        onContinue={() => nextStep()}
        timing={currExo.temps_repos || 30}
      />
    );
  };

  const getIsLastSerie = () => {
    return checkIfLastSerie();
  };

  const checkIfLastSerieAndSetState = () => {
    const isLast = checkIfLastSerie(1);
    if (isLast) {
      return setIsLastSerie(true);
    }
    return setIsLastSerie(false);
  };

  const checkIfLastSerie = (modifier = 0) => {
    if (!run) return false;
    if (run.currentStepExoSerie === currExo.nb_series - modifier) return true;
    return false;
  };

  const getTitle = () => {
    if (run && run.is_complete) return 'Entraînement terminé';
    if (isSeanceAtBeginning(run))
      return `La séance ${seance?.[0]['seanceUtilisateur']['libelle']} commence`;
    return '';
  };

  const onCompleteSerie = (failed?: boolean) => {
    if (!currExo.est_superset) {
      if (islastSerie) {
        // si derniere serie, on cache les logs et on affiche l'alert de RPE
        setSerieLog({
          seanceIndex: currExo.seanceIndex,
          exoStep: run.currentStepExo,
          exoId: currExo.exo.id,
          charge: currExo.charge,
          reps: failed ? 0 : currExo.nb_reps,
          is_failed: !!failed,
        });
        return setIsOpen(true);
      }
      // sinon on complete simplement
      return setCompleteSerie(null, {
        seanceIndex: currExo.seanceIndex,
        exoStep: run.currentStepExo,
        exoId: currExo.exo.id,
        charge: currExo.charge,
        reps: failed ? 0 : currExo.nb_reps,
        is_failed: !!failed,
      });
    }
    return getSupersetNextStep();
  };

  const setCompleteSerie = (rpe: string | null, logs?: any) => {
    if (rpe) {
      // si rpe, alors les logs sont en cache et on a un rpe en plus
      setIsOpen(false);
      setIsLastSerie(false);
      setLogs((prev: any) => [
        ...prev,
        {
          ...serieLog,
          rpe: rpe || 5,
        },
      ]);
    } else {
      // si pas de rpe, on prend le param de logs
      setLogs((prev: any) => [...prev, logs]);
    }
    return setInTransition(true);
  };

  const getSupersetNextStep = () => {
    isNextSupersetExo();
  };

  const isNextSupersetExo = () => {
    if (run.currentStepExo < run.seance[run.currentStep].exo.length - 1) {
      // il y a d'autres exo dans le set, on passe au suivant
      setCurrExo(run.seance[run.currentStep].exo[run.currentStepExo + 1]);
      return setRun((prev: any) => ({
        ...prev,
        currentStepExo: prev.currentStepExo + 1,
      }));
    }
    // pas d'autre exo dans le set, on remet le compteur à 0 et nextStep
    setRun((prev: any) => ({
      ...prev,
      currentStepExo: 0,
    }));
    setInTransition(true);
  };

  return (
    <>
      <IonMenu
        side='end'
        contentId='run'
        type='push'
        onIonDidOpen={() => setIsMenuOpen(true)}
        onIonDidClose={() => setIsMenuOpen(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Votre séance</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding'>
          <SeanceExos
            seance={recapSeance}
            simpleDisplay={true}
            currExo={currExo?.seanceIndex}
          />
        </IonContent>
      </IonMenu>
      <IonPage id='run'>
        <IonHeader>
          <Nav />
        </IonHeader>

        <IonActionSheet
          isOpen={isOpen}
          header='Diffcultée ressentie'
          className='rcoach-action-sheet'
          buttons={[
            {
              text: 'Trop dur',
              role: 'hard',
            },
            {
              text: 'Parfait',
              role: 'perfect',
            },
            {
              text: 'Trop facile',
              role: 'easy',
            },
          ]}
          onDidDismiss={({ detail }) =>
            setCompleteSerie(detail.role || 'perfect')
          }
        ></IonActionSheet>
        <IonContent className='ion-padding'>
          <div className='animate-in h-100 d-flex flex-column flex-justify-center flex-align-center'>
            <h2 className='text-align-center m-b-1'>{`Entraînement du ${new Date().toLocaleDateString()}`}</h2>
            <h3 className='text-align-center'>{getTitle()}</h3>
            {!!run && !run.is_complete && getIsLastSerie() && (
              <div className='preview d-flex flex-align-center'>
                <i className='iconoir-arrow-right'></i>
                <span className='text-s'>
                  {nextExo.exo.libelle} {nextExo.nb_reps}
                </span>
                {nextExo.charge && (
                  <span className='m-l-1'>x {nextExo.charge}kg</span>
                )}
              </div>
            )}
            {inTransition && !run.is_complete && getTransition()}
            {!run && (
              <button
                onClick={() => startSeance()}
                className='btn bg-primary-r-gradient m-b-3'
              >
                Commencer
              </button>
            )}
            {!inTransition && !!run && !run.is_complete && (
              <>
                <SeanceStepDisplay
                  currentExoLibelle={currExo.exo.name_fr || currExo.exo.name_en}
                  currentExoNbRep={currExo.nb_reps}
                  currentExoCharge={currExo.charge}
                  currentExoTpsAction={currExo.temps_action || 0}
                  currentExoImage={currExo.exo.images}
                  onCompleteSerie={onCompleteSerie}
                  currentExo={currExo}
                />
              </>
            )}
            {!!run && !run.is_complete && (
              <SeanceStepTracker
                stepNumber={run.seance.length}
                currentStep={run.currentStep}
                currentExoStep={run.currentStepExoSerie}
                currentExoNbStep={currExo.nb_series}
              />
            )}
            {run && run.is_complete && (
              <CompletedSeance beginTime={run.beginTime.toString()} />
            )}
          </div>
          <IonMenuToggle>
            <button className='get-recap'>
              <i
                className={`iconoir-nav-arrow-${isMenuOpen ? 'right' : 'left'}`}
              ></i>
            </button>
          </IonMenuToggle>
        </IonContent>
      </IonPage>
    </>
  );
};
