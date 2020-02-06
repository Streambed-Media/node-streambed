import React, { useState, useEffect } from 'react';
// import runTheContent from '../../../helpers/GetToken';

const Platforms = (props) => {
  const [hasRT, setHasRT] = useState('');

  useEffect(() => {
    fetch('/users/getrT')
      .then((response) => response.json())
      .then((message) => {
        const { rT } = message;

        setHasRT(rT);
      });
  });

  const youtubeAuth = async () => {
    if (hasRT) {
      let brt = hasRT;
      fetch('/users/deleterT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rt: brt
        })
      }).then(() => {
        setHasRT('');
        sessionStorage.clear();
        location.reload();
      });
    } else {
      const response = await fetch('/youtube-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      window.location.assign(data.url);
    }
  };

  return (
    <div className='platforms'>
      <h1>Platforms</h1>
      <div className='checkbox-platforms'>
        <div className='ui checkbox'>
          <input type='checkbox' disabled />
          <label>
            <i className='instagram icon'>
              <span className='social--media'>Instagram</span>
            </i>
          </label>
        </div>
        <div className='ui checkbox'>
          <input
            type='checkbox'
            className='youtube'
            onChange={youtubeAuth}
            checked={hasRT !== '' ? true : false}
          />
          <label>
            <i className='youtube icon'>
              <span className='social--media'>Youtube</span>
            </i>
          </label>
        </div>
        <div className='ui checkbox'>
          <input type='checkbox' disabled className='facebook' />
          <label>
            <i className='facebook icon'>
              <span className='social--media'>Facebook</span>
            </i>
          </label>
        </div>
        <div className='ui checkbox'>
          <input type='checkbox' disabled />
          <label>
            <i className='twitter icon'>
              <span className='social--media'>Twitter</span>
            </i>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Platforms;
