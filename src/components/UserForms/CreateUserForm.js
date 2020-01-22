import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/UserFormStyles/createUserForm.css';
import wallet from '../../helpers/Wallet';
import { enc, AES } from 'crypto-js';


const CreateUserForm = () => {
  /**************************STATE SECTION************************/
  //**Display Name States */
  const [username, setUsername] = useState('');
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');

  //**Password States */
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [passErrorMessage, setPassErrorMessage] = useState('');

  //**Email States */
  const [email, setEmail] = useState('');
  const [reEmail, setReEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [walletRecord, setWalletRecord] = useState({mnemonic: '', encryption: '', signed64: ''})

  /*****************************STATE SECTION******************************/
  const { createMnemonic, createRegistration, publishRecord } = wallet;
  const encrypt = (nmonic, password) => {
    let encryption = AES.encrypt(nmonic, password).toString()
    return encryption
  }

  const decrypt = () => {
    let decrypt = AES.decrypt().toString(enc.Utf8)
    return decrypt
  }
  
  const walletData = () => {
    const walletdata = {}
    createMnemonic()
      .then((mnemonic) => {
        // AES signed and save to state
        const hash = encrypt(mnemonic, password);
        walletdata.mnemonic = hash
        setWalletRecord({mnemonic: mnemonic, encryption: hash})
        
        return createRegistration(mnemonic, username)

      }).then((data)=> publishRecord( data ))
      .then((signed64)=> {
        walletdata.signed64 = signed64;
        sendUser( walletdata )
      })
    .catch(err => console.log('WalletData '+ err));
  }


  /*******************************Function to compare password, usename, email fields */


  const validateForm = (e) => {
    if (email !== reEmail) {
      setEmailErrorMessage('Emails do not match!');
      setUsernameErrorMessage('');
    } else if (password !== rePassword) {
      setEmailErrorMessage('');
      setPassErrorMessage('Passwords do not match!');
    } else {
      setPassErrorMessage('');
      walletData();
    }   
  };

  const sendUser = (walletData) => {

    fetch('http://localhost:5000/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        displayName: username,
        email: email,
        password: password,
        mnemonic: walletData.mnemonic,
        signed64: walletData.signed64
      })
    })
      .then((response) => response.json())
      .then((message) => {
        if (message.error) {
          setUsernameErrorMessage(message.error);
        } else {
          setUsernameErrorMessage('');
          setPassErrorMessage(message.message);
        }
        console.log(message);
      });
  };


  const onFormSubmit = (e) => {
    e.preventDefault();

    validateForm(e);
  
  };
  /*************The placeholders are fontawesome unicode, allows them to show in the placeholder field *****************/
  /*************Password fields get set to state to compare before submit*/
  return (
    <div>

      <form className='form-container' onSubmit={onFormSubmit} value='submit'>
        <input
          className='text--input'
          type='text'
          name='displayName'
          required
          placeholder='&#xf2bd;   Display Name'
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <div>{usernameErrorMessage}</div>
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
          type='email'
          name='email'
          required
          placeholder='&#xf14a;   Re-enter Email'
          onChange={(e) => {
            setReEmail(e.target.value);
          }}
        />
        {/**********************************Error message prints out for emails not matching */}
        <div>{emailErrorMessage}</div>
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
        <input
          className='text--input'
          type='password'
          name='password'
          required
          placeholder='&#xf14a;   Re-enter Password'
          onChange={(e) => {
            setRePassword(e.target.value);
          }}
        />
        {/**********************************Error message prints out for passwords not matching */}
        <div>{passErrorMessage}</div>
        <div className='link-wrapper'>
          {passErrorMessage === 'User Created' ? (
            <a className='item' href='/users/login'>
              <div className='main-screen--button continue--button'>
                Continue to dashboard
              </div>
            </a>
          ) : (
            <button type='submit' className='main-screen--button'>
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
