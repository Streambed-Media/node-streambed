import React from 'react';
//import orgGraph from '../../../../public/images/orgGraph.png';

const Graph = (props) => {
  if (props.videoData === false) {
    return <div>Sign into Youtube to view data</div>;
  }
  return (
    <div>
      <img src='images/orgGraph.png' alt='graph' />
    </div>
  );
};

export default Graph;
