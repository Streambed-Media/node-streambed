import React, { useState, useEffect } from 'react';

import '../../styles/UserFormStyles/createUserForm.css';

/***********************************************************************/
/*************Creates user in DB, ITS WORKING! --Tommy *****************/
/***********************************************************************/

const CreateUserForm = () => {
  //Currently pulling from backend created with mongoose/mongoDB, everything seems to be working correctly

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Get users, NEED TO DO VALIDATION ON BACKEND
  // useEffect(() => {
  //   fetch(`http://localhost:5000/users/`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       let usernames = data.map((c) => c.displayName);
  //       console.log(usernames);
  //       setAllUsers(usernames);
  //     });
  // }, []);
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // ***************************************************************************************************

  /********************************************************************STATE SECTION*********************************************/
  //**Display Name States */
  const [allUsers, setAllUsers] = useState([]);
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
  /********************************************************************STATE SECTION*********************************************/

  /*******************************Function to compare password, usename, email fields */
  // const validateForm = (e) => {
  //   if (allUsers.includes(username)) {
  //     e.preventDefault();
  //     setUsernameErrorMessage('The username already exist');
  //   } else if (email !== reEmail) {
  //     e.preventDefault();
  //     setEmailErrorMessage('Emails do not match!');
  //     setUsernameErrorMessage('');
  //   } else if (password !== rePassword) {
  //     e.preventDefault();
  //     setEmailErrorMessage('');
  //     setPassErrorMessage('Passwords do not match!');
  //   } else {
  //     setPassErrorMessage('');
  //   }
  // };
  /***********************************Function to submit form to users/singup ********************/

  const onFormSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        displayName: username,
        email: email,
        password: password
      })
    })
      .then((response) => response.json())
      .then((message) => {
        setUsernameErrorMessage(message.message);
        console.log(message);
      });
  };

  /*************The placeholders are fontawesome unicode, allows them to show in the placeholder field *****************/
  /*************Password fields get set to state to compare before submit*/
  return (
    <div>
      <form className='form-container'>
        <input
          type='text'
          name='displayName'
          value={username}
          required
          placeholder='&#xf2bd;   Display Name'
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <div>{usernameErrorMessage}</div>
        <input
          type='email'
          name='email'
          value={email}
          required
          placeholder='&#xf0e0;   Email'
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type='email'
          name='email'
          value={reEmail}
          required
          placeholder='&#xf14a;   Re-enter Email'
          onChange={(e) => {
            setReEmail(e.target.value);
          }}
        />
        {/**********************************Error message prints out for emails not matching */}
        <div>{emailErrorMessage}</div>
        <input
          type='password'
          name='password'
          value={password}
          required
          placeholder='&#xf023;   Password'
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          type='password'
          name='password'
          value={rePassword}
          required
          placeholder='&#xf14a;   Re-enter Password'
          onChange={(e) => {
            setRePassword(e.target.value);
          }}
        />
        {/**********************************Error message prints out for passwords not matching */}
        <div>{passErrorMessage}</div>
        <button
          type='submit'
          onClick={onFormSubmit}
          value='submit'
          style={{ display: 'none' }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;
