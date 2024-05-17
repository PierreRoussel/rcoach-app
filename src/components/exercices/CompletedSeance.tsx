import React from 'react';
import './Exercices.scss';
import { fancyTimeFormat, getTimeDiffInSeconds } from '../../utils/shared/date';
import SuccessCheck from '../shared/checks/SuccessCheck';

export default function CompletedSeance(params: any) {
  const resumee = {
    temps_total: getTimeDiffInSeconds(params.beginTime, new Date()),
  };

  return (
    <div className='animated completed-seance d-flex flex-column flex-justify-center flex-align-center'>
      <SuccessCheck />
      Temps total {fancyTimeFormat(resumee.temps_total)}
    </div>
  );
}
