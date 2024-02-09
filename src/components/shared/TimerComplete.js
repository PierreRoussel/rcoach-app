import React, { forwardRef, useImperativeHandle, useRef } from 'react';

export const TimerComplete = React.forwardRef((props, ref) => {
  // The component instance will be extended

  // with whatever you return from the callback passed
  // as the second argument
  // useImperativeHandle(ref, () => ({
  //   play() {
  //     console.log('play');
  //     if (audioRef.current) {
  //       audioRef.current.play();
  //     }
  //   },
  // }));
{/* <audio ref={audioRef} src='/styles/sounds/timercomplete01.wav' /> */}
  return <h1>Hi</h1>;
});
