import React from 'react';
import CircularProgress from './CircularProgress';

export default function ExoRecap(params: {
  exoLibelle: string;
  tpsRepos: number;
  nbSerieDone: number;
  reps: number | null;
  nbSerieGoal: number;
  charge: number | null;
  tpsAction: number | null;
}) {
  const percentDone = (params.nbSerieDone / params.nbSerieGoal) * 100;
  const isSucceeded = params.nbSerieDone === params.nbSerieGoal;
  return (
    <div
      className={`d-flex flex-justify-start flex-align-center  w-100 flex-gap ${
        isSucceeded ? 'succeeded' : ''
      }`}
    >
      <div className='d-flex flex-justify-start flex-align-center'>
        <CircularProgress percentDone={percentDone} />
      </div>
      <div className='d-flex flex-justify-between flex-align-center w-100'>
        <div className='text-s d-flex flex-justify-center flex-align-start flex-column'>
          <span>{params.exoLibelle}</span>
          <span className='label'>
            <b>
              {params.nbSerieDone}/{params.nbSerieGoal}
            </b>
            <span className='m-i-2'>
              {params.reps && params.reps + ' x '}
              {params.tpsAction && params.tpsAction + 's'}
              {params.charge && params.charge + 'kg'}
            </span>
          </span>
        </div>
        <i
          className={`${
            isSucceeded
              ? 'text-l iconoir-check color-success'
              : 'color-fail text-s'
          } p-2`}
        >
          {!isSucceeded && 'Echoué'}
        </i>
      </div>
    </div>
  );
}
