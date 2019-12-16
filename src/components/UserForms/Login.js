import React from 'react';
import '../../styles/UserFormStyles/createUserForm.css';
import GoogleAuth from '../GoogleAuth_master';

//*************************Basic set up for login page */
const Login = () => {
  return (
    <div>
      <form className='form-container'>
        <input
          type='email'
          name='email'
          required
          placeholder='&#xf0e0;   Email'
        />
        <a className="forgotpass" href="#" rel="noopener">Forgot password?</a>
        <input
          type='password'
          name='password'
          required
          placeholder='&#xf023;   Password'
        />
        <button type='submit' style={{ display: 'none' }}>
          Submit
        </button>
      </form>
      <GoogleAuth />
    </div>
  );
};

export default Login;
