import { useEffect, useRef, useState } from 'react';
import './Chronometre.scss';
import audioFile from './timercomplete01.mp3';
import { fancyTimeFormat } from '../../../../utils/shared/date';

export default function EmomChronometre(params: { initialTime: number }) {
  const countdownNumberEl: any = useRef(undefined);
  const audioRef: any = useRef(undefined);
  const circle: any = useRef(undefined);

  let countdown = params.initialTime || 3;
  let newcountdown = countdown;
  let maxoffset = 565;
  let offset = 0;
  let tick: any = null;

  useEffect(() => {
    if (countdownNumberEl.current && circle.current) {
      initInterval();
    }
    return () => {
      clearInterval(tick);
      tick = null;
    };
  }, []);

  const initInterval = () => {
    if (tick === null) {
      tick = setInterval(function () {
        newcountdown = --newcountdown <= 0 ? 0 : newcountdown;
        if (offset - maxoffset / countdown >= -Math.abs(maxoffset)) {
          offset = offset - maxoffset / countdown;
          if (offset < -maxoffset + 10) {
            (audioRef.current! as any).play();
          }
        } else {
          offset = -Math.abs(maxoffset);
          clearInterval(tick);
        }

        (countdownNumberEl as any).current.textContent =
          fancyTimeFormat(newcountdown);
        (circle as any).current.setAttribute(
          'style',
          `stroke-dashoffset: ${offset}px`
        );
      }, 1000);
    }
  };

  return (
    <div className='emom-chrono d-flex flex-column flex-gap flex-justify-center h-100'>
      <audio ref={audioRef}>
        <source id='audio-player' src={audioFile} type='audio/mp3' />
      </audio>
      <div ref={countdownNumberEl} id='countdown-number'>
        {fancyTimeFormat(countdown)}
      </div>
      <svg
        className='countdown'
        viewBox='0 0 200 200'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle r='90' cx='100' cy='100'></circle>
        <circle
          ref={circle}
          className='countdown-circle'
          r='90'
          cx='100'
          cy='100'
        ></circle>
      </svg>
    </div>
  );
}
