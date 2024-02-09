import React from 'react';
import './Exercices.scss';
import SuccessCheck from '@/components/shared/checks/SuccessCheck';
import { getTimeDiffInSeconds, fancyTimeFormat } from '@/utils/shared/date';

export default function CompletedSeance(params) {
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
