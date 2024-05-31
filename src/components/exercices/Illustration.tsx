/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';
import { getExoImage } from '../../services/run.service';
// ----------------------------------------------------------------------

export default function ExerciceImg({ exoImages }: { exoImages: string[] }) {
  const [img, setImg]: any = useState();
  useEffect(() => {
    if (exoImages) {
      getExoImage(exoImages, (data: any) => {
        setImg(data.publicUrl);
      });
    } else {
      setImg(null);
    }
  }, [exoImages]);

  const fallback = () => <i className='iconoir-treadmill' />;

  return (
    <div
      style={{ 'height': '100%', 'width': '100%', 'fontSize': '24px' }}
      className='d-flex flex-centered'
    >
      {img ? (
        <img
          onError={fallback}
          className='exercice-img'
          src={img}
          height='100%'
          width='100%'
          alt=''
        />
      ) : (
        <i className='iconoir-treadmill' />
      )}
    </div>
  );
}
ExerciceImg.propTypes = {
  exoImages: PropTypes.array,
};
