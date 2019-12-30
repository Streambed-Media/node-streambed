import React from 'react';



const Platforms = () => {

  const Authenticate = (e) => {
    console.log(e)
    console.log(document.querySelectorAll('.ui.checkbox.platform'))
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
              onChange={Authenticate}
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
