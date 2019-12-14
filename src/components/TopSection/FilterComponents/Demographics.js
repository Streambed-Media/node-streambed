import React from 'react';

const Demographics = () => {
  return (
    <div className='demographics'>
      <h1>Demographics</h1>

      <select className='ui dropdown'>
        <option value=''>Age</option>
        <option value='1'>1-20</option>
        <option value='0'>21-100</option>
      </select>
      <select className='ui dropdown'>
        <option value=''>Gender</option>
        <option value='1'>Male</option>
        <option value='0'>Female</option>
      </select>
    </div>
  );
};

export default Demographics;
