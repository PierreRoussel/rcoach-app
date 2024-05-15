// import { useState } from 'react';
// import Confirm from './Confirm';

// export default function IsometricExercice(params: any) {
//   const [phase, setPhase] = useState(1);
//   function onIsometricComplete() {
//     if (params.currentExo.is_gauche_droite) {
//       setPhase((prev) => prev + 1);
//     } else {
//       params.onCompleteSerie();
//     }
//   }
//   return (
//     <>
//       <div className='isometric-exercice h-100 d-flex flex-column flex-align-center flex-justify-start'>
//         <div className='illus bg-primary-r-gradient-shadow animated animate-in'>
//           <i className='iconoir-gym'></i>
//         </div>
//         <div className='exo-container'>
//           <h3>
//             {params.currentExoLibelle} {params.currentExoTpsAction}s{' '}
//             {params.currentExo.is_gauche_droite &&
//               ' - ' + getGaucheDroiteLibelle(phase)}
//           </h3>
//           {phase < 3 ? (
//             <div key={phase}>
//               <IsoChronometre
//                 timing={params.currentExoTpsAction}
//                 onContinue={onIsometricComplete}
//               />
//             </div>
//           ) : (
//             <div className='h-100 d-flex flex-column flex-align-center flex-justify-start'>
//               <i className='g-d-checked iconoir-double-check rounded'></i>
//             </div>
//           )}
//         </div>
//       </div>
//       {!params.currentExo.is_gauche_droite ||
//         (phase > 2 && <Confirm onCompleteSerie={params.onCompleteSerie} />)}
//     </>
//   );
// }
