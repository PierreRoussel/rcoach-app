import React from 'react';
import './Exercices.scss';

export default function SeanceStepTracker(params: any) {
  const tabs = [];
  for (let index = 0; index <= params.stepNumber; index++) {
    if (index === params.stepNumber) {
      tabs.push(
        <>
          <div className={`tab`}>
            <i className='iconoir-triangle-flag-circle'></i>
          </div>
        </>
      );
    } else {
      tabs.push(
        <>
          <div
            className={`tab ${
              index === params.currentStep ? 'bg-primary-l-5 color-white' : ''
            }`}
          >
            <i
              className={
                index < params.currentStep
                  ? 'iconoir-check-circle-solid tab-valid'
                  : 'iconoir-circle'
              }
            ></i>
          </div>
        </>
      );
    }
  }
  return (
    <>
      <div className='series-tracker d-flex flex-column m-t-auto'>
        <span className='label'>serie</span>
        <span className='numbers d-flex'>
          <b>{params.currentExoStep}</b>
          <b>/</b>
          <b>{params.currentExoNbStep}</b>
        </span>
      </div>
      <div className='container'>
        <span className='label etapes-label'>Etapes</span>
        <div className='tabs box-shadow'>
          {tabs.map((tab, i) => (
            <div key={i}>{tab}</div>
          ))}
        </div>
      </div>
    </>
  );
}
