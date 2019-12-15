import React, { useState } from 'react';
import CreateUserForm from './CreateUserForm';
import Login from './Login';
import '../../styles/UserFormStyles/getStartedandLogin.css';

const GetStartedandLogin = () => {
  const [getStarted, setGetStarted] = useState(false);
  const [login, setLogin] = useState(false);

  /************************************Function to show correct components when one is selected */
  const startOrLog = () => {
    if (getStarted === true) {
      return (
        <div>
          <CreateUserForm />
        </div>
      );
    } else if (login === true) {
      return (
        <div>
          <Login />
        </div>
      );
    } else {
      return (
        <div className='get-log--buttons'>
          <button
            className='main-screen--button'
            onClick={() => setGetStarted(true)}
          >
            Get Started
          </button>
          <button
            className='main-screen--button'
            onClick={() => setLogin(true)}
          >
            Log In
          </button>
        </div>
      );
    }
  };

  /*********************Back button will set states to false and hide the back button */

  return (
    <div className='start-log--container'>
      {startOrLog()}
      <button
        className={
          login === false && getStarted === false
            ? 'main-screen--none'
            : 'main-screen--button'
        }
        onClick={() => {
          setGetStarted(false);
          setLogin(false);
        }}
      >
        Back
      </button>
    </div>
  );
};

export default GetStartedandLogin;
