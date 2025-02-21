import './styles.scss';
import { RouteComponentProps } from 'react-router';
import { IonContent, IonHeader, IonPage } from '@ionic/react';
import Nav from '../../../components/layout/Nav';
import { useEffect, useRef, useState } from 'react';
import audioFile from './emom-chrono/timercomplete01.mp3';

interface EmomPageProps
  extends RouteComponentProps<{
    id: string;
  }> {}

export const Emom: React.FC<EmomPageProps> = () => {
  const [seconds, setSeconds] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [rounds, setRounds] = useState(0);
  const audioRef: any = useRef(undefined);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 3) {
            if (audioRef.current) {
              audioRef.current.play();
            }
          }
          if (prev === 1) {
            setRounds((prevRounds) => prevRounds + 1);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(60);
    setRounds(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (seconds / 60) * circumference;

  return (
    <IonPage>
      <IonHeader>
        <Nav title='EMOM Timer' />
      </IonHeader>
      <IonContent className='ion-padding'>
        <div className='d-flex flex-column flex-gap emom'>
          <div className='timer-container'>
            <svg className='timer-circle' width='300' height='300'>
              <circle
                className='timer-circle-bg'
                cx='150'
                cy='150'
                r={radius}
              />
              <circle
                className='timer-circle-progress'
                cx='150'
                cy='150'
                r={radius}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                }}
              />
              <text x='150' y='150' className='timer-text'>
                {formatTime(seconds)}
              </text>
            </svg>
          </div>
          <div className='d-flex flex-gap flex-column flex-justify-center text-align-center'>
            <span>Tours complétés: {rounds}</span>
            <div className='d-flex flex-gap controls'>
              <button onClick={toggleTimer}>
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button onClick={resetTimer}>Reset</button>
            </div>
          </div>
        </div>
        <audio ref={audioRef}>
          <source
            id='audio-player'
            // name='audio-player'
            src={audioFile}
            type='audio/mp3'
          />
        </audio>
      </IonContent>
    </IonPage>
  );
};
