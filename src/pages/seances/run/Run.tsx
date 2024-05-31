import { useEffect, useState } from 'react';
import './Run.scss';
import { RouteComponentProps } from 'react-router';
import { IonContent, IonHeader, IonPage } from '@ionic/react';
import Nav from '../../../components/layout/Nav';
import { buildStepsFromSeance, isSeanceAtBeginning } from './run.utils';
import { supabase } from '../../../services/supabaseClient';
import { Run, SeanceStep } from './seance';
import Chronometre from '../../../components/exercices/Chronometre';
import SeanceStepDisplay from '../../../components/exercices/SeanceStepDisplay';
import SeanceStepTracker from '../../../components/exercices/SeanceStepTracker';
import CompletedSeance from '../../../components/exercices/CompletedSeance';
import { POST } from '../../../services/run.service';
import { getTimeDiffInSeconds } from '../../../utils/shared/date';

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

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase
        .from('seanceExo')
        .select(`*, seanceUtilisateur(libelle), exo(name_en, name_fr, images,rowid)`)
        .eq('seance', seanceId);
      setSeance(data);
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
    if (!actualRun.seance[actualRun.currentStep])
      return {
        ...actualRun,
        currentStepExo: 0,
        currentStepExoSerie: 1,
        currentStep: actualRun.currentStep + 1,
        is_complete: true,
      };
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

  const isLastSerie = () => {
    if (run.currentStepExoSerie === currExo.nb_series) return true;
    return false;
  };

  const getTitle = () => {
    if (run && run.is_complete) return 'Entraînement terminé';
    if (isSeanceAtBeginning(run))
      return `La séance ${seance?.[0]['seanceUtilisateur']['libelle']} commence`;
    return '';
  };

  const onCompleteSerie = (failed?: boolean) => {
    setLogs((prev: any) => [
      ...prev,
      {
        seanceIndex: currExo.seanceIndex,
        exoStep: run.currentStepExo,
        exoId: currExo.exo.id,
        charge: currExo.charge,
        reps: failed ? 0 : currExo.nb_reps,
        is_failed: !!failed,
      },
    ]);
    if (!currExo.est_superset) return setInTransition(true);
    getSupersetNextStep();
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
    <IonPage>
      <IonHeader>
        <Nav />
      </IonHeader>
      <IonContent className='ion-padding'>
        <div className='animate-in h-100 d-flex flex-column flex-justify-center flex-align-center'>
          <h2 className='text-align-center m-b-1'>{`Entraînement du ${new Date().toLocaleDateString()}`}</h2>
          <h3 className='text-align-center'>{getTitle()}</h3>
          {!!run && !run.is_complete && isLastSerie() && (
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
      </IonContent>
    </IonPage>
  );
};
