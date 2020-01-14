import React from 'react';
//import DerivativePlaceholder from '../../../public/images/derivativePlaceholder.PNG';

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
      <img src='images/derivativePlaceholder.png' alt='DerivativePicture' />
      {/* <img src={DerivativePlaceholder} alt='DerivativePicture' /> */}
    </div>
  );
};

export default Derivative;
