import React from 'react';
import Avatar from '../../../public/images/rachel.png';

/*************************************Top influencers sections, non-functional currently */

const TopInfluencers = () => {
  return (
    <div className='influencer-container'>
      <h1>Top Influencers / Sharers</h1>
      <div className='influencers'>
        <div className='list--one'>
          <div className='ui list'>
            <div className='item'>
              <img className='ui avatar image' src={Avatar} alt='' />
              <div className='content'>
                <a className='header' href='/'>
                  Rachel
                </a>
                <div className='description'>
                  Last seen watching{' '}
                  <a href='/'>
                    <b>Arrested Development</b>
                  </a>{' '}
                  just now.
                </div>
              </div>
            </div>
            <div className='item'>
              <img className='ui avatar image' src={Avatar} alt='' />
              <div className='content'>
                <a className='header' href='/'>
                  Lindsay
                </a>
                <div className='description'>
                  Last seen watching{' '}
                  <a href='/'>
                    <b>Bob's Burgers</b>
                  </a>{' '}
                  10 hours ago.
                </div>
              </div>
            </div>
            <div className='item'>
              <img className='ui avatar image' src={Avatar} alt='' />
              <div className='content'>
                <a className='header' href='/'>
                  Matthew
                </a>
                <div className='description'>
                  Last seen watching{' '}
                  <a href='/'>
                    <b>The Godfather Part 2</b>
                  </a>{' '}
                  yesterday.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='list--two'>
          <div className='ui list'>
            <div className='item'>
              <img className='ui avatar image' src={Avatar} alt='' />
              <div className='content'>
                <a className='header' href='/'>
                  Rachel
                </a>
                <div className='description'>
                  Last seen watching{' '}
                  <a href='/'>
                    <b>Arrested Development</b>
                  </a>{' '}
                  just now.
                </div>
              </div>
            </div>
            <div className='item'>
              <img className='ui avatar image' src={Avatar} alt='' />
              <div className='content'>
                <a className='header' href='/'>
                  Lindsay
                </a>
                <div className='description'>
                  Last seen watching{' '}
                  <a href='/'>
                    <b>Bob's Burgers</b>
                  </a>{' '}
                  10 hours ago.
                </div>
              </div>
            </div>
            <div className='item'>
              <img className='ui avatar image' src={Avatar} alt='' />
              <div className='content'>
                <a className='header' href='/'>
                  Matthew
                </a>
                <div className='description'>
                  Last seen watching{' '}
                  <a href='/'>
                    <b>The Godfather Part 2</b>
                  </a>{' '}
                  yesterday.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopInfluencers;
