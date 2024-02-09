'use client';
import React, { useEffect } from 'react';
import Bento from '../layout/Bento';
import { getWeekDays } from '../../utils/shared/date';

export default function Historique() {
  const week = getWeekDays();
  return (
    <Bento>
      <div className='d-flex flex-justify-between flex-align-center'>
        {week.map((day) => (
          <div key={`${day.date}${day.isToday}`} className='h-100 d-flex flex-justify-between flex-gap flex-column'>
            <span className='flex-1'>{day.libelle}</span>
            <b className={`rounded d-flex flex-justify-center flex-align-center p-1 ${day.isToday ? 'bg-primary color-white' : ''}`}>{day.date}</b>
          </div>
        ))}
      </div>
    </Bento>
  );
}
