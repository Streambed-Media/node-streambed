import React from 'react';
import '../../styles/UserFormStyles/createUserForm.css';
import GoogleAuth from '../GoogleAuth_master';

/****************************************************************/
/*************Login page working with DB users! --Tommy *********/
//TODO Doesnt let you access the dashboard, that is still done with Oauth currently
//TODO still need to figure out oauth with db user
/****************************************************************/

const Login = () => {

  return (
    <div>
      <form className='form-container' method='POST' action='/users/login'>
        <input
          type='email'
          name='email'
          required
          placeholder='&#xf0e0;   Email'
        />
        <input
          type='password'
          name='password'
          required
          placeholder='&#xf023;   Password'
        />
        <a className='forgotpass' href='#' rel='noopener'>
          Forgot password?
        </a>
        <button type='submit' style={{ display: 'none' }}>
          Submit
        </button>
        <button className="main-screen--button" type='submit'>
          Submit
        </button>
      </form>
      <GoogleAuth />
    </div>
  );
};

export default Login;
