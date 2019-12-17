import React, { useState, useEffect } from 'react';

import '../../styles/UserFormStyles/createUserForm.css';

const CreateUserForm = () => {

  //**Username State */
  const [allUsers, setAllUsers] = useState([]);
  const [username, setUsername] = useState('');

  //! Get users - fake backend -
  useEffect(() => {
    fetch(
      `https://jsonplaceholder.typicode.com/users/`,
      {
        method: 'GET',
      }
    )
      .then((response) => response.json())
      .then((data) => {
        let usernames = data.map((x) => x.username)
        setAllUsers(
          [...usernames]
        )
      });
  }, []);
  // !!

  //**Password States */
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [passErrorMessage, setPassErrorMessage] = useState('');

  /**Email States */
  const [email, setEmail] = useState('');
  const [reEmail, setReEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  /*******************************Function to compare password fields */
  const validateForm = (e) => {
    e.preventDefault();

    if (allUsers.includes(username)) {
      alert('The username already exist')
    }
    if (email !== reEmail) {
      setEmailErrorMessage('Emails do not match!');
    } else if (password !== rePassword) {
      setEmailErrorMessage('');
      setPassErrorMessage('Passwords do not match!');
    } else {
      setPassErrorMessage('');
      setEmailErrorMessage('');
    }
  };

  /*************The placeholders are fontawesome unicode, allows them to show in the placeholder field *****************/
  /*************Password fields get set to state to compare before submit*/
  return (
    <div>
      <form className='form-container' onSubmit={validateForm}>
        <input
          type='text'
          name='display_name'
          required
          placeholder='&#xf2bd;   Display Name'
          onChange={(e) => {
            setUsername(e.target.value)
          }}

        />
        <input
          type='email'
          name='email'
          required
          placeholder='&#xf0e0;   Email'
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
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
          type='password'
          name='password'
          required
          placeholder='&#xf023;   Password'
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
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
        <button type='submit' className='main-screen--button'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;
