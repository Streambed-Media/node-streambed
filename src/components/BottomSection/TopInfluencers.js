import React, { useState, useEffect } from 'react';

/*************************************Top influencers sections, non-functional currently */

const TopInfluencers = props => {
  /**User State */
  const [users, setUsers] = useState([]);
  const [users2, setUsers2] = useState([]);

  /**Added font awesome to arrays so they could be looped in the map of the users */
  const [sM, setSM] = useState([
    'fab fa-instagram fa-lg',
    'fab fa-youtube fa-lg'
  ]);
  const [sM2, setSM2] = useState([
    'fab fa-facebook-square fa-lg',
    'fab fa-twitter-square fa-lg'
  ]);

  /**Fetching fake users to simulate dynamic user data */
  /**Needed 2 to have seperate columns */
  useEffect(() => {
    fetch('https://randomuser.me/api/?results=2')
      .then(response => response.json())
      .then(data => {
        setUsers(data.results);
      });
    fetch('https://randomuser.me/api/?results=2')
      .then(response => response.json())
      .then(data => {
        setUsers2(data.results);
      });
  }, []);

  if (!props.videoData) {
    return (
      <div className='influencer-container'>
        <h1>Top Influencers / Sharers</h1>
        <div className='influencers'>
          <div>Please sign in to Youtube</div>;
        </div>
      </div>
    );
  }

  return (
    <div className='influencer-container'>
      <h1>Top Influencers / Sharers</h1>
      <div className='influencers'>
        <div className='list--one'>
          {users
            ? users.map((c, i) => (
                <div key={c.login.uuid} className='ui list'>
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
                        Last seen watching <br />
                        <a
                          target='_blank'
                          rel='noopener noreferrer'
                          href='https://www.youtube.com/watch?v=oQ85hwLnkNE'>
                          <b>How to Win "The Platform Wars"</b>
                        </a>
                        <br />
                        on: <i className={sM[i]}></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>
        <div className='list--two'>
          {users
            ? users2.map((c, i) => (
                <div key={c.login.uuid} className='ui list'>
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
                        Last seen watching
                        <br />
                        <a
                          target='_blank'
                          rel='noopener noreferrer'
                          href='https://www.youtube.com/watch?v=i67MHSNhbc4'>
                          <b>Are there public spaces on the web?</b>
                        </a>
                        <br />
                        on: <i className={sM2[i]}></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default TopInfluencers;
