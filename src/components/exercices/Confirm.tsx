import React from 'react';

export default function Confirm(params: { onCompleteSerie: Function }) {
  return (
    <div className='d-flex flex-row flex-gap flex-justify-center flex-align-center m-bot-3'>
      <button className='btn btn-l fail' onClick={() => params.onCompleteSerie(true)}>
        <i className='iconoir-xmark'></i>
      </button>
      <button className='btn btn-xl success' onClick={() => params.onCompleteSerie()}>
        <i className='iconoir-check'></i>
      </button>
    </div>
  );
}
