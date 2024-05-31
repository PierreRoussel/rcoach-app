import './Exercices.scss';
import Confirm from './Confirm';
import IsometricExercice from './IsometricExercice';
import ExerciceImg from './Illustration';

export default function SeanceStepDisplay(params: any) {
  const isometricExercice = () => {
    return <IsometricExercice {...params} />;
  };

  const repetitiveExercice = () => {
    return (
      <>
        <div className='d-flex flex-column flex-align-center flex-justify-start exo-container'>
          {params.currentExoImage && params.currentExoImage.length ? (
            <ExerciceImg exoImages={params.currentExoImage} />
          ) : (
            <div className='illus bg-primary-r-gradient-shadow animated animate-in'>
              <i className='iconoir-gym'></i>
            </div>
          )}
          <div className='exo-container'>
            <h3>{params.currentExoLibelle}</h3>
            <span className='d-flex flex-justify-center m-b-3'>
              <span>
                <b>{params.currentExoNbRep}</b> rép.
              </span>
              {params.currentExoCharge && (
                <span className='m-l-1'>
                  x <b>{params.currentExoCharge}kg</b>
                </span>
              )}
            </span>
          </div>
          <Confirm onCompleteSerie={params.onCompleteSerie} />
        </div>
      </>
    );
  };

  return params.currentExoTpsAction > 0
    ? isometricExercice()
    : repetitiveExercice();
}
