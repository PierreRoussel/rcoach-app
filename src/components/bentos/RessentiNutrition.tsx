import { useEffect, useState } from 'react';
import { loginStore } from '../../stores/login.store';
import {
  getRessentisNutrition,
  upsertUtilisateurNutrition,
} from '../../services/ressentis.service';
import Bento from '../layout/Bento';
import NewsCheck from '../shared/checks/NewsCheck';
import SuccessCheck from '../shared/checks/SuccessCheck';
import RessentiButton from '../shared/buttons/RessentiButton';
import { User } from '@supabase/supabase-js';

export default function RessentiNutrition({
  ressenti,
  callbackUpsertRessentiNutrition,
}: any) {
  const [isRessentisPushed, setIsRessentisPushed] = useState<boolean>(false);
  const [choicesRessentisNutrition, setChoicesRessentisNutrition] = useState<
    any[] | null
  >(null);

  useEffect(() => {
    if (
      !ressenti ||
      (ressenti && !ressenti.ressenti_nutrition)
    )
      getRessentisChoices();
  }, [ressenti]);

  function getRessentisChoices() {
    getRessentisNutrition((data: any, error: any) => {
      setChoicesRessentisNutrition(data);
    });
  }

  async function energieRessentiSelected(id: any) {
    const user: User = await loginStore.get('user');
    upsertUtilisateurNutrition(
      user.id,
      {
        date: new Date(),
        ressenti_nutrition: id,
      },
      (data: any, error: any) => {
        loginStore.set('ressentis', data);

        setTimeout(() => {
          setIsRessentisPushed(true);
        }, 510);
      }
    );
  }

  return (
    !isRessentisPushed &&
    choicesRessentisNutrition && (
      <div
        className={`ressentis-bento ${isRessentisPushed ? 'disappear' : ''}`}
      >
        <Bento className='ressentis-bento'>
          <div className='d-flex flex-column flex-justify-start'>
            <span className='ressentis-bento--question'>
              Par rapport à ton objectif, comment as-tu mangé aujourd'hui ?
            </span>
            <div className='ressentis-bento--news-check'>
              <NewsCheck />
            </div>
            {isRessentisPushed && (
              <div className='ressentis-bento--success-check'>
                <SuccessCheck />
              </div>
            )}

            <div className='ressentis-container d-flex flex-gap flex-align-center justify-content-between'>
              {choicesRessentisNutrition.map((ressenti: any) => (
                <RessentiButton
                  key={ressenti.id}
                  id={ressenti.id}
                  couleur={ressenti.couleur}
                  icone={ressenti.icon_name}
                  libelle={ressenti.libelle}
                  ressentiSelected={(id: any) => energieRessentiSelected(id)}
                ></RessentiButton>
              ))}
            </div>
          </div>
        </Bento>
      </div>
    )
  );
}
