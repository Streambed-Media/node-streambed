import React, { useState, useEffect } from 'react';
import '../styles/GoogleAuth/googleAuthMaster.css';

/***********************************************************Google Oauth login page component ***************/

const GoogleAuth = (props) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  /**This is taking props form App, setting state to true when you get signedIn to render the signout button**/
  useEffect(() => {
    setIsSignedIn(props.isSignedIn);
  }, []);

  //Will render sign in or sign out button conditionally
  const renderAuthButton = () => {
    if (isSignedIn) {
      return (
        <div>
          <form
            method='POST'
            action='/logout'
            onSubmit={() => {
              sessionStorage.clear();
              localStorage.clear();
            }}
          >
            <input className='reset--pw' type='submit' value='Logout' />
          </form>
        </div>
      );
    }
  };

  return <div>{renderAuthButton()}</div>;
};
export default GoogleAuth;
