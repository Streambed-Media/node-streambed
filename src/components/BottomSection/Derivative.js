import React from 'react';
//import DerivativePlaceholder from '../../../public/images/DerivativeGraph-mockup.png';

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
      <h1>Derivative</h1>
      <img src='/images/DerivativeGraph-final2.svg' alt='streambed logo' />
    </div>
  );
};

export default Derivative;
