'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getDateString, getDayPartString } from '@/utils/shared/date';
import './RecapRun.scss';
import ExoRecap from '@/components/journal/ExoRecap';
import { getNbSerieSucceeded, groupByExercice } from './logs.utils';
import Bento from '@/components/layout/Bento';
import { createClient } from '@/utils/supabase/client';

export default function RecapRun() {
  return (
    <Suspense>
      <SuspenseRecapRun />
    </Suspense>
  );
}

function SuspenseRecapRun() {
  const [run, setRun] = useState<any | null>();
  const [seance, setSeance] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  const supabase = createClient();

  const searchParams = useSearchParams();
  const runId = searchParams.get('id') || '0';
  useEffect(() => {
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
        .select('*, exo(libelle)')
        .eq('seance', seanceId);
      const orderedExos: any[] | undefined = data?.sort(
        (a: any, b: any) => a.seanceIndex - b.seanceIndex
      );
      setSeance(orderedExos || []);
      setLogs(groupByExercice(logs, data?.length || 1));
    };
    getData();
  }, []);

  return (
    <div className='recap-exo animate-in d-flex flex-column flex-justify-start flex-align-center h-100'>
      {run && (
        <>
          <h1 className='text-l'>
            Séance {run.seanceUtilisateur.libelle}{' '}
            {getDayPartString(new Date(run.created_at))}
          </h1>
          <span className='text-m d-flex flex-justify-start flex-align-center'>
            <i className='iconoir-gym m-i-1'></i>
            {getDateString(new Date(run.date))},{' '}
            {new Date(run.created_at).toLocaleTimeString('fr', {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {' - '}
            {run.end_time.toLocaleTimeString('fr', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <div className='recap-exos d-flex flex-column flex-gap-s'>
            {seance.map((exo) => (
              <Bento key={exo.id}>
                <ExoRecap
                  nbSerieGoal={exo.nb_series}
                  nbSerieDone={getNbSerieSucceeded(
                    logs,
                    exo.seanceIndex,
                    exo.nb_reps
                  )}
                  exoLibelle={exo.exo.libelle}
                  tpsRepos={exo.temps_repos}
                  tpsAction={exo.temps_action}
                  charge={exo.charge}
                  reps={exo.nb_reps}
                />
              </Bento>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
