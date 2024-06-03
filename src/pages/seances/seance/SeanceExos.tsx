import Bento from '../../../components/layout/Bento';
import ExerciceImg from '../../../components/exercices/Illustration';
import { fancyTimeFormat } from '../../../utils/shared/date';
import './Seance.scss';

export default function SeanceExos(params: {
  seance: any[] | null;
  simpleDisplay?: boolean;
  currExo?: number;
}) {
  return (
    <div className='page-seance__exercices d-flex flex-column flex-justify-stretch flex-gap flex-align-center w-100'>
      {params.seance?.map((exo, index) => {
        return (
          <Bento
            key={exo['id']}
            className={`
              ${params.currExo && params.currExo === index + 1 && 'current-exo'}
              ${params.currExo && params.currExo > index + 1 && 'passed-exo'}
              ${exo.est_superset ? 'color-white superset-bento' : 'bg-grey-1'}`}
          >
            <div className='w-100 border-radius d-flex flex-column flex-justify-center flex-align-center position-relative'>
              <h3 className='m-b-1 m-i-3'>
                {exo.exo.name_fr || exo.exo.name_en}
              </h3>
              <div className='d-flex flex-row flex-align-center flex-gap'>
                <div className='illu-container'>
                  <ExerciceImg exoImages={exo.exo.images} />
                </div>
                <div className='d-flex flex-align-center'>
                  <span>{exo.nb_series} séries</span>
                </div>
                <div className='d-flex flex-column m-b-2'>
                  <span className='d-flex flex-align-center flex-justify-start'>
                    {!exo.charge || (exo.charge === 0 && 'x ')}
                    {exo.nb_reps}
                    {exo.temps_action && exo.temps_action + 's'}
                    {exo.temps_action && (
                      <i className='iconoir-wristwatch text-l'></i>
                    )}
                    {exo.charge && exo.charge > 0 && ' x ' + exo.charge + 'kg'}
                  </span>
                </div>
              </div>
              {params.currExo && params.currExo > index + 1 && (
                <i className='checked-it iconoir-check'></i>
              )}
            </div>
            {!params.simpleDisplay && (
              <span className='exo-bento-chips d-flex flex-align-center flex-justify-start text-m'>
                <span className='exo-bento-chip d-flex- flex-justify-center flex-align-center'>
                  <i className='iconoir-timer'></i>
                  {fancyTimeFormat(exo.temps_repos)}
                </span>
              </span>
            )}
          </Bento>
        );
      })}
    </div>
  );
}
