import './Journal.scss';

export default function CircularProgress(params: { percentDone: number }) {
  const getStep = () => {
    let stepClass = '';

    switch (true) {
      case params.percentDone <= 10:
        stepClass = 'progress-10';
        break;
      case params.percentDone <= 20:
        stepClass = 'progress-20';
        break;
      case params.percentDone <= 30:
        stepClass = 'progress-30';
        break;
      case params.percentDone > 30 && params.percentDone <= 50:
        stepClass = 'progress-60';
        break;
      case params.percentDone > 50 && params.percentDone <= 60:
        stepClass = 'progress-50';
        break;
      case params.percentDone > 60 && params.percentDone <= 99.9:
        stepClass = 'progress-90';
        break;
      case params.percentDone > 99:
        stepClass = 'progress-100';
        break;
      default:
        stepClass = '';
    }
    return stepClass;
  };
  const step = getStep();
  return (
    <div className='set-size charts-container'>
      <div className={`pie-wrapper ${step}`}>
        <span className='label'>
          <i className='iconoir-gym'></i>
        </span>
        <div className='pie'>
          <div className='left-side half-circle'></div>
          <div className='right-side half-circle'></div>
        </div>
      </div>
    </div>
  );
}
