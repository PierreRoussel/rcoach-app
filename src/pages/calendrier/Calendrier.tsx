import { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage } from '@ionic/react';

import PageHeaderIllu from '../../components/layout/PageHeaderIllu';
import { getDateString, isSameDay } from '../../utils/shared/date';
import './Calendrier.scss';

import Nav from '../../components/layout/Nav';
import { User } from '@supabase/supabase-js';
import { loginStore } from '../../stores/login.store';
import { getPastSeances, PastEvent } from '../../services/seances.service';
import { getPastRessentis } from '../../services/ressentis.service';
import { OnArgs, Value } from 'react-calendar/dist/cjs/shared/types';
import Calendar from 'react-calendar';
import { Link } from 'react-router-dom';
import Bento from '../../components/layout/Bento';
import Avatar from '../../components/layout/Avatar';

export default function Calendrier() {
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
  const [pastRessentis, setPastRessentis] = useState([]);
  const [value, onChange] = useState<Value>(new Date());
  const [currValueDetails, setCurrValueDetails] = useState<any>();

  useEffect(() => {
    getMonthData();
  }, []);

  async function getMonthData(date = new Date()) {
    const user: User = await loginStore.get('user');
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const enDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

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

    getPastRessentis(
      user.id,
      (data: any, error: any) => {
        if (error) console.error(error);
        else {
          setPastRessentis(data);
        }
      },
      {
        start: startDate.toISOString(),
        end: enDate.toISOString(),
      }
    );
  }

  useEffect(() => {
    if (pastRessentis) setCurrValueDetails(getDayTileContent(new Date()));
  }, [pastRessentis]);

  function daySelected(event: any) {
    onChange(event);
    setCurrValueDetails(getDayTileContent(event));
  }

  function getDayTileContent(date: any) {
    const event = pastEvents.find((event) =>
      isSameDay(event.date_programmation, date)
    );
    const ressentis: any = pastRessentis.find((ressenti: any) =>
      isSameDay(ressenti.date_ressenti_utilisateur, date)
    );
    return {
      ...(event && { 'seance': event }),
      ...(ressentis && { 'ressentis': ressentis }),
      date,
    };
  }

  function tileContent({ date, view }: any) {
    if (view === 'month') {
      const tileContentCompiled: any = getDayTileContent(date);
      return <CalendrierTileContent {...tileContentCompiled} />;
    }
  }

  function refreshMonthData({ action, activeStartDate, value, view }: OnArgs) {
    getMonthData(activeStartDate || new Date());
  }

  return (
    <IonPage>
      <IonHeader>
        <Nav />
      </IonHeader>
      <IonContent className='ion-padding'>
        <div className='d-flex flex-column flex-justify-start flex-align-center h-100'>
          <PageHeaderIllu>
            <h1 className='ion-padding'>Calendrier</h1>
          </PageHeaderIllu>
          <div className='content animate-in  d-flex flex-column flex-align-start w-100 h-100 flex-gap-s'>
            <Calendar
              formatShortWeekday={(locale, date) =>
                date.toLocaleDateString('fr', { weekday: 'narrow' })
              }
              formatMonthYear={(locale, date) =>
                date.toLocaleDateString('fr', {
                  month: 'short',
                  year: 'numeric',
                })
              }
              prevLabel={<i className='iconoir-nav-arrow-left'></i>}
              nextLabel={<i className='iconoir-nav-arrow-right'></i>}
              prev2Label={null}
              next2Label={null}
              tileContent={tileContent}
              onChange={(e) => daySelected(e)}
              onActiveStartDateChange={refreshMonthData}
              value={value}
            />
            <CalendrierDayDetails {...currValueDetails}></CalendrierDayDetails>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

function CalendrierTileContent({ seance, ressentis }: any) {
  return (
    <div className='d-flex calendrier-tile-content'>
      <div
        className={`historique-column-date--seance
                    ${
                      seance && seance.a_ete_executee
                        ? ' historique-column-date--seance_check'
                        : ''
                    }
                    `}
        style={{
          background: `${seance ? seance.couleur : ''}`,
          color: `${seance ? 'var(--grey-0)' : ''}`,
        }}
      >
        <i
          className={`${
            seance && seance.a_ete_executee ? 'iconoir-check' : ''
          }`}
        ></i>
      </div>
      <div
        className='historique-column-date--ressentis'
        style={{
          background: `${
            ressentis && ressentis.ressenti_nutrition
              ? `var(--${ressentis.ressenti_nutrition.couleur})`
              : ''
          }`,
        }}
      >
        <div
          className='--nutrition'
          style={{
            color: `${
              ressentis && ressentis.ressenti_nutrition
                ? `var(--${ressentis.ressenti_nutrition.couleur}-dark)`
                : ''
            }`,
          }}
        >
          <i className={`iconoir-cutlery`}></i>
        </div>
      </div>
      <div
        className='historique-column-date--ressentis --energie'
        style={{
          background: `${
            ressentis && ressentis.ressenti_energie
              ? `var(--${ressentis.ressenti_energie.couleur})`
              : ''
          }`,
        }}
      >
        <div
          className='--energie'
          style={{
            background: `${
              ressentis && ressentis.ressenti_energie
                ? `var(--${ressentis.ressenti_energie.couleur}-dark)`
                : ''
            }`,
          }}
        ></div>
      </div>
    </div>
  );
}

function CalendrierDayDetails({
  seance,
  ressentis,
  date,
}: {
  seance: any;
  ressentis: any;
  date: Date;
}) {
  return (
    <div className='d-flex flex-column flex-gap'>
      <h2>
        {date?.toLocaleDateString('fr', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
        })}
      </h2>
      <div className='d-flex flex-gap calendrier-details-ressenti --nutrition'>
        <div
          className='calendrier-details-ressenti--badge'
          style={{
            background: `${
              ressentis && ressentis.ressenti_nutrition
                ? `var(--${ressentis.ressenti_nutrition.couleur})`
                : ''
            }`,
          }}
        >
          <div
            className='--nutrition'
            style={{
              color: `${
                ressentis && ressentis.ressenti_nutrition
                  ? `var(--${ressentis.ressenti_nutrition.couleur}-dark)`
                  : ''
              }`,
            }}
          >
            <i className={`iconoir-cutlery`}></i>
          </div>
        </div>
        <div className='calendrier-details-ressenti--details'>
          Par rapport à votre objectif, vous avez mangé :{' '}
          {ressentis && ressentis.ressenti_nutrition
            ? ressentis.ressenti_nutrition.libelle
            : 'Pas renseigné'}
        </div>
      </div>
      <div className='d-flex flex-gap calendrier-details-ressenti --energie'>
        <div
          className='calendrier-details-ressenti--badge --energie'
          style={{
            background: `${
              ressentis && ressentis.ressenti_energie
                ? `var(--${ressentis.ressenti_energie.couleur})`
                : ''
            }`,
          }}
        >
          <i
            className={`iconoir-${
              ressentis &&
              ressentis.ressenti_energie &&
              ressentis.ressenti_energie.icon_name
                ? ressentis.ressenti_energie.icon_name
                : 'battery-empty'
            }`}
            style={{
              color: `${
                ressentis && ressentis.ressenti_energie
                  ? `var(--${ressentis.ressenti_energie.couleur}-dark)`
                  : ''
              }`,
            }}
          ></i>
        </div>
        <div className='calendrier-details-ressenti--details'>
          Par rapport à votre objectif, vous avez jugé votre taux d'énergie
          comme :{' '}
          {ressentis && ressentis.ressenti_energie
            ? ressentis.ressenti_energie.libelle
            : 'Pas renseigné'}
        </div>
      </div>
      <div className='d-flex flex-column flex-gap-s'></div>
      {seance && (
        <>
          <h3>Votre séance ce jour là</h3>
          <Link
            className={`w-100 color-black`}
            to={`seance/${seance.id}`}
            key={seance.id}
          >
            <Bento
              className={`d-flex flex-justify-start flex-align-center flex-gap`}
            >
              <Avatar chain={seance.libelle} couleur={seance.couleur || null} />
              <div className='d-flex flex-column'>
                {seance.libelle}
                <i
                  style={{
                    color: '#888',
                  }}
                >
                  {getDateString(new Date(seance.date_programmation))}
                </i>
              </div>
              <i className='iconoir-nav-arrow-right m-left-auto'></i>
            </Bento>
          </Link>
        </>
      )}
    </div>
  );
}
