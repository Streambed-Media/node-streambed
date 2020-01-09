import React, { useState } from 'react';

const PubAnalytics = (props) => {
  /**Recieves functions from app component, used here to pass the onChange back up to App */

  const onCheckChange = () => {
    props.checkboxHandler();
  };

  return (
    <div>
      <div className='ui toggle checkbox'>
        <input
          type='checkbox'
          name='publisher-analytics'
          checked={props.checked}
          onChange={onCheckChange}
        />
        <label>Publisher / Analytics </label>
      </div>
    </div>
  );
};

export default PubAnalytics;
