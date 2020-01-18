import React from 'react';
import DerivativePlaceholder from '../../../public/images/derivativePlaceholder.png';

//! Just a picture of the design right now, not functional
const Derivative = (props) => {
  if (props.videoData === false) {
    return (
      <div className='derivative--container'>
        Sign into Youtube to view data
      </div>
    );
  }
  return (
    <div className='derivative--container'>
      <img src={DerivativePlaceholder} alt='DerivativePicture' />
    </div>
  );
};

export default Derivative;
