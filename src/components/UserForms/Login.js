import React from 'react';
import '../../styles/UserFormStyles/createUserForm.css';
import GoogleAuth from '../GoogleAuth_master';

/****************************************************************/
/*************Login page working with DB users! --Tommy *********/
/****************************************************************/

const Login = () => {
  return (
    <div>
      <form className='form-container' method='POST' action='/users/login'>
        <input
          className='text--input'
          type='email'
          name='email'
          required
          placeholder='&#xf0e0;   Email'
        />
        <input
          className='text--input'
          type='password'
          name='password'
          required
          placeholder='&#xf023;   Password'
        />
        <div className='remember--me--login'>
          <input type='checkbox' name='remember' value='1' />
          <label>Remember Me</label>
        </div>
        <button className='main-screen--button' type='submit'>
          Submit
        </button>
      </form>
      <GoogleAuth />
    </div>
  );
};

export default Login;
