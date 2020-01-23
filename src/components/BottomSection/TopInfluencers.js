import React, { useState, useEffect } from 'react';
//import Avatar from '../../../public/images/rachel.png';

/*************************************Top influencers sections, non-functional currently */

const TopInfluencers = () => {
  /**User State */
  const [users, setUsers] = useState([]);

  /**Fetching fake users to simulate dynamic user data */
  useEffect(() => {
    fetch('https://randomuser.me/api/?results=4')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.results);
        console.log(data.results);
      });
  }, []);

  return (
    <div className='influencer-container'>
      <h1>Top Influencers / Sharers</h1>
      <div className='influencers'>
        {users
          ? users.map((c) => (
              <div className='ui list'>
                <div className='item'>
                  <img
                    className='ui avatar image'
                    src={c.picture.thumbnail}
                    alt=''
                  />
                  <div className='content'>
                    <a className='header' href='#'>
                      {c.name.first}
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
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default TopInfluencers;
