import { useEffect, useRef, useState } from 'react';
import './Chronometre.scss';
import audioFile from './timercomplete01.mp3';
import { fancyTimeFormat } from '../../utils/shared/date';

export default function Chronometre(params: any) {
  const countdownNumberEl: any = useRef(undefined);
  const audioRef: any = useRef(undefined);
  const circle: any = useRef(undefined);

  const [isComplete, setIsComplete] = useState(false);

  let countdown = params.timing || 3;
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
          setIsComplete(true);
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

  const skipTimer = () => {
    params.onContinue();
  };

  const addTime = () => {
    if (isComplete) {
      setIsComplete(false);
      newcountdown = 30;
      countdown = 30;
    } else {
      newcountdown += 30;
      countdown += 30;
    }

    offset = 0;
    (circle as any).current.setAttribute(
      'style',
      `stroke-dashoffset: ${offset}px`
    );
    clearInterval(tick);
    tick = null;
    initInterval();
  };

  return (
    <div className='d-flex flex-column flex-gap flex-justify-center h-100'>
      <audio ref={audioRef}>
        <source
          id='audio-player'
          // name='audio-player'
          src={audioFile}
          type='audio/mp3'
        />
      </audio>
      <div id='countdown'>
        {isComplete && (
          <div>
            <button
              className='animated animated-pulse btn complete-repos box-shadow'
              onClick={() => params.onContinue()}
            >
              Go
            </button>
          </div>
        )}
        <div className={isComplete ? 'opacity-0' : ''}>
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
      </div>
      {countdown > 3 && (
        <div className='d-flex flex-gap flex-justify-between flex-align-center m-bot-3'>
          <button className='btn bg-fail' onClick={() => skipTimer()}>
            <i className='iconoir-arrow-right'></i>
            Passer
          </button>
          <button className='btn bg-secondary' onClick={() => addTime()}>
            <i className='iconoir-plus'></i>
            30 sec
          </button>
        </div>
      )}
    </div>
  );
}
