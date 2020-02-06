import React, { useState } from 'react';
import '../../styles/UserFormStyles/createUserForm.css';
import GoogleAuth from '../GoogleAuth_master';
import CryptoJS, { enc, AES } from 'crypto-js';
import HDMW from 'oip-hdmw';

/****************************************************************/
/*************Login page working with DB users! --Tommy *********/
/****************************************************************/

const Login = () => {
  //State for login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  //Login and send back mnemonic, decrpyt it and set to local storage
  //Local storage is used with publishing videos
  const onLogin = async () => {
    try {
      const response = await fetch('/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      const data = await response.json();
      if (data.msg === 'Please enter correct credentials') {
        setError(data.msg);
      }
      const { mnemonic } = data;
      let deCrypt = AES.decrypt(mnemonic, password);
      let plaintext = deCrypt.toString(CryptoJS.enc.Utf8);
      console.log(plaintext);
      const Wallet = HDMW.Wallet;
      let wif = new Wallet(plaintext, {
        supported_coins: ['flo'],
        discover: false
      })
        .getCoin('flo')
        .getAccount(0)
        .getMainAddress()
        .getPrivateAddress();
      localStorage.setItem('userAddress', JSON.stringify(wif));
      location.reload();
    } catch {
      console.log('error');
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div>
      <form className='form-container' onSubmit={onFormSubmit} value='submit'>
        <input
          className='text--input'
          type='email'
          name='email'
          required
          placeholder='&#xf0e0;   Email'
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className='text--input'
          type='password'
          name='password'
          required
          placeholder='&#xf023;   Password'
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <div className='remember--me--login'>
          <input type='checkbox' name='remember' value='1' />
          <label>Remember Me</label>
        </div>
        <div>{error}</div>
        <button className='main-screen--button' type='submit'>
          Submit
        </button>
      </form>
      <GoogleAuth />
    </div>
  );
};

export default Login;
