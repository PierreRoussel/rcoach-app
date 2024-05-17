import { Exo, Run, Seance, SeanceStep } from './seance';

export const buildStepsFromSeance = (seance: Exo[]): SeanceStep[] => {
  let buildedSeance: SeanceStep[] = [];
  let index = 0;
  for (const exo of seance) {
    if (!!exo.est_superset) {
      if (isPreviousSuperset(buildedSeance, exo)) {
        const stepIndex = buildedSeance.findIndex(
          (step) => step.seanceIndex === (exo.seanceIndex || -1) - 1
        );
        buildedSeance[stepIndex].est_superset = true;
        buildedSeance[stepIndex].exo.push(exo);
        buildedSeance[stepIndex].libelle = 'Superset';
      } else {
        buildedSeance.push(addStepToSeance(exo));
      }
    } else {
      buildedSeance.push(addStepToSeance(exo));
    }
    index++;
  }
  return orderStepsBySeanceIndex(buildedSeance);
};

export const orderStepsBySeanceIndex = (buildedSeance: SeanceStep[]) => {
  console.log("🚀 ~ buildedSeance:", buildedSeance)
  return buildedSeance.sort(function(a, b){return a.seanceIndex - b.seanceIndex});
};

export const isPreviousSuperset = (seance: SeanceStep[], exo: Exo): boolean => {
  if (!exo.seanceIndex) return false;
  const previousSiblingIndex = exo.seanceIndex - 1;
  for (const step of seance) {
    if (step.seanceIndex === previousSiblingIndex) {
      return step.exo[0].est_superset || false;
    }
  }
  return false;
};

export const addStepToSeance = (exo: Exo) => {
  return {
    exo: [exo],
    libelle: exo.exo.libelle,
    est_superset: !!exo.est_superset,
    seanceIndex: exo.seanceIndex || -1,
  };
};

export const isSeanceAtBeginning = (run: Run): boolean => {
  if (!run) return true;
  if (
    run.currentStep === 0 &&
    run.currentStepExo === 0 &&
    run.currentStepExoSerie === 1
  )
    return true;
  return false;
};

export const getGaucheDroiteLibelle = (phase: number) => {
  return phase === 1 ? 'Gauche' : 'Droite';
}
