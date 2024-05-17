export interface Seance {
  libelle: string;
}

export interface Exo {
  charge?: number;
  est_superset?: boolean;
  created_at: '2024-01-23T16:48:40.033597+00:00';
  exo: ExerciceType;
  id: number;
  nb_reps: number;
  nb_series: number;
  rpe_cible: number;
  temps_action: number | null;
  seance: number;
  seanceUtilisateur: Seance;
  temps_repos: number;
  is_gauche_droite:boolean;
  seanceIndex?: number;
}

export interface ExerciceType {
  libelle: string;
}

export interface SeanceStep {
  libelle: string;
  exo: Exo[];
  seanceIndex: number;
  est_superset: boolean;
}

export interface Run {
  seance: SeanceStep[];
  beginTime: Date;
  currentStep: number;
  currentStepExo: number;
  currentStepExoSerie: number;
  is_complete: boolean;
}
