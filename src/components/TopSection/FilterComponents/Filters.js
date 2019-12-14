import React from 'react';
import DistanceFrom from './DistanceFrom';
import OriginalDerivative from './OriginalDerivative';
import Demographics from './Demographics';
import Platforms from './Platforms';

/*****************************************Filters section, non-functional right now */

const Filters = () => {
  return (
    <div className='filters-container'>
      <h1>Filters</h1>
      <div className='filters'>
        <div className='original--conatiner'>
          <DistanceFrom />
          <OriginalDerivative />
        </div>
        <div className='demoplat-container'>
          <Demographics />
          <Platforms />
        </div>
      </div>
    </div>
  );
};
export default Filters;
