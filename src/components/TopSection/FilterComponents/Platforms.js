import React, { useState } from 'react';
// import runTheContent from '/../helpers/GetToken';
// import { web } from '../../oauthTwo.keys.json';




const Platforms = () => {

  const [checked, setCheckBox] = useState(false);

  console.log(checked);

  const handleChecked = () => {
    setCheckBox(!checked)
  }

  const Authenticate = (e) => {

    console.log('inside', { checked });

    if (checked) {
      console.log('cool');
      fetch('http://localhost:5000/dashboard')
    }

    // if (checked === true) {
    //   runTheContent((accessToken) => {
    //     fetch(
    //       `https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true&maxResults=50&type=video&key={${web.apiKey}}`,
    //       {
    //         method: 'GET',
    //         headers: {
    //           'Content-type': 'application/json',
    //           Authorization: 'Bearer ' + accessToken
    //         }
    //       }
    //     )
    //       .then((response) => response.json())
    //       .then((data) => {
    //         console.log(data)
    //         setVideoData(data.items);
    //       });
    //   })
    // }

  }

  return (
    <div className='platforms'>
      <h1>Platforms</h1>
      <div className='checkbox-platforms'>
        <div className='ui checkbox platform'>
          <input type='checkbox' disabled />
          <label>
            <i className='instagram icon'>
              <span className='social--media'>Instagram</span>
            </i>
          </label>
        </div>
        <div className='ui checkbox platform'>
          <form action='/dashboard' method='POST'>
            <input type='checkbox'
              checked={checked}
              onChange={handleChecked}
            />
            <label>
              <i className='youtube icon'>
                <span className='social--media'>Youtube</span>
              </i>
            </label>
          </form>
          {/* <input type='checkbox' checked readOnly />
          <label>
            <i className='youtube icon'>
              <span className='social--media'>Youtube</span>
            </i>
          </label> */}
        </div>
        <div className='ui checkbox platform'>
          <input type='checkbox' disabled />
          <label>
            <i className='facebook icon'>
              <span className='social--media'>Facebook</span>
            </i>
          </label>
        </div>
        <div className='ui checkbox platform'>
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
