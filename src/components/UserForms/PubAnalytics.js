import React, { useState } from 'react';

const PubAnalytics = (props) => {
  /**Recieves functions from app component, used here to pass the onChange back up to App */
  const [pub, setPub] = useState(false);
  const onCheckChange = () => {
    props.handleClose();
    props.checkboxHandler();
    setPub(!pub);
  };

  return (
    <div>
      <button
        id='pub--lish'
        className='reset--pw'
        onClick={() => onCheckChange()}
      >
        {pub ? 'Analytics' : 'Publisher'}
      </button>
    </div>
  );
};

export default PubAnalytics;
