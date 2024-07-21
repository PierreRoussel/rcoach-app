'use client';
import Bento from '../../layout/Bento';
import {
  DateWithLibelleAndSeance,
  getWeekDays,
  isSameDay,
  setDateToMaxHours,
  setDateToMinHours,
} from '../../../utils/shared/date';

import './Historique.scss';
import { useEffect, useState } from 'react';
import { getPastSeances, PastEvent } from '../../../services/seances.service';
import { User } from '@supabase/supabase-js';
import { loginStore } from '../../../stores/login.store';

export default function Historique() {
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
  const [pastRessentis, setPastRessentis] = useState([]);
  const [week, setWeek] = useState<DateWithLibelleAndSeance[]>([]);

  useEffect(() => {
    const getData = async () => {
      const _week = getWeekDays();
      setWeek(_week);

      const user: User = await loginStore.get('user');

      const startDate = setDateToMinHours(_week[0].fullDate as Date);
      const enDate = setDateToMaxHours(new Date());

      getPastSeances(
        user.id,
        (data: any, error: any) => {
          if (error) console.error(error);
          else setPastEvents(data);
        },
        {
          start: startDate.toISOString(),
          end: enDate.toISOString(),
        }
      );
    };
    getData();
  }, []);

  useEffect(() => {
    let newWeek = [...week];
    if (pastEvents && pastEvents.length > 0) {
      for (const event of pastEvents) {
        const dayIndex = week.findIndex((day) =>
          isSameDay(day.fullDate, event.date_programmation)
        );
        newWeek[dayIndex].seance = event;
      }
      console.log('week', week);
      setWeek(newWeek);
    }
  }, [pastEvents]);

  return (
    <Bento className='historique-bento bg-primary-r-gradient'>
      <div className='historique-container'>
        <h2>Mon suivi</h2>
        <div className='d-flex flex-justify-between'>
          {week.map((day) => (
            <div
              key={`${day.date}${day.isToday}`}
              className={`
                historique-column ${
                  day.isToday ? 'historique-column_today' : ''
                }`}
            >
              <span className='historique-column--libelle'>{day.libelle}</span>
              <b
                className={`rounded d-flex flex-justify-center flex-align-center p-1
                historique-column--date `}
              >
                <div className='historique-column-date--background'></div>
                {day.date}
                <div
                  className='historique-column-date--seance'
                  style={{
                    background: `${day.seance ? day.seance.couleur : ''}`,
                  }}
                ></div>
              </b>
            </div>
          ))}
        </div>
      </div>
    </Bento>
  );
}
