import { useEffect, useRef, useState } from 'react';
import './IsoChronometre.scss';
import audioFile from './timercomplete01.mp3';
import { fancyTimeFormat } from '../../utils/shared/date';

export default function IsoChronometre(params: any) {
  const audioRef: any = useRef(undefined);
  const countdownNumberEl: any = useRef(undefined);
  const [isComplete, setIsComplete] = useState(false);
  const [playState, setPlayState] = useState(false);
  const circle: any = useRef(undefined);
  let countdown: any = params.timing || 3;
  let newcountdown = countdown;
  let maxoffset = 565;
  let offset = 0;
  let tick: any = null;

  useEffect(() => {
    return () => {
      clearInterval(tick);
      tick = null;
    };
  }, []);

  const initInterval = () => {
    if (tick === null) {
      setPlayState(true);
      tick = setInterval(function () {
        newcountdown = --newcountdown <= 0 ? 0 : newcountdown;
        if (offset - maxoffset / countdown >= -Math.abs(maxoffset)) {
          offset = offset - maxoffset / countdown;
          if (offset < -maxoffset + 10) {
            (audioRef as any).current.play();
          }
        } else {
          offset = -Math.abs(maxoffset);
          clearInterval(tick);
          setIsComplete(true);
        }

        countdownNumberEl.current.textContent = fancyTimeFormat(newcountdown);
        circle.current.setAttribute('style', `stroke-dashoffset: ${offset}px`);
      }, 1000);
    }
  };

  const play = () => {
    initInterval();
  };

  return (
    <div className='d-flex flex-column flex-gap flex-justify-center flex-align-center'>
      <audio ref={audioRef}>
        <source
          id='audio-player'
          // name='audio-player'
          src={audioFile}
          type='audio/mp3'
        />
      </audio>
      {playState ? (
        <div id='countdown'>
          {isComplete && (
            <div>
              <button
                className='animated animated-pulse btn complete-repos box-shadow'
                onClick={() => params.onContinue()}
              >
                <i className='iconoir-check'></i>
              </button>
            </div>
          )}
          <div
            className={isComplete ? 'opacity-0' : ''}
            onClick={() => params.onContinue()}
          >
            <div ref={countdownNumberEl} id='countdown-number'>
              {fancyTimeFormat(countdown)}
            </div>
            <button className='btn bg-fail fast-forward-iso-chrono m-b-2'>
              <i className='iconoir-forward text-l'></i>
            </button>
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
        </div>
      ) : (
        <button
          className='animated animated-pulse btn complete-repos box-shadow'
          onClick={() => play()}
        >
          <i className='iconoir-play'></i>
        </button>
      )}
    </div>
  );
}
