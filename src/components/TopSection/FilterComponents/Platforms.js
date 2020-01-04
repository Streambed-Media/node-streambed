import React, { useState } from 'react';

const Platforms = () => {

  const Authenticate = (e) => {
    const target = e.target.className

    switch (target) {
      case 'youtube':
          document.getElementsByClassName( 'youtubeAuth' )[0].submit()
        break;
        case 'facebook':
          document.getElementsByClassName( 'facebookAuth' )[0].submit()
        break;
    }
  }

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
          <form className="youtubeAuth" action='/dashboard' method='POST'>
            <input type='checkbox'
              onChange={Authenticate}
              className="youtube"
            />
            <label>
              <i className='youtube icon'>
                <span className='social--media'>Youtube</span>
              </i>
            </label>
          </form>
        </div>
        <div className='ui checkbox'>
          <form className="facebookAuth" action='#' method='POST'>
            <input type='checkbox'
              onChange={Authenticate}
              className="facebook"
            />
            <label>
            <i className="facebook icon">
                <span className="social--media">Facebook</span>
              </i>
            </label>
          </form>
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
