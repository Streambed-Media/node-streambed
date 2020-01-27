import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CryptoJS, { enc, AES } from 'crypto-js';

const ResetPassword = (props) => {
  //****************************************SweetAlert modal */
  const MySwal = withReactContent(Swal);
  //**********************************************************************/
  //********This will fetch the encrypted mnemonic from the Db */
  //********It will then decrypt and re-encrypt with the new pw */
  //********Then it sends the newly encrypted mnemonic and pw back to the server to be saved */
  //********Server never knows mnemonic */
  //**********************************************************************/
  const handleFetch = (pwArr) => {
    fetch('/users/getmnemonic')
      .then((response) => response.json())
      .then((data) => {
        const { mnemonic } = data;
        console.log(mnemonic);
        let deCrypt = AES.decrypt(mnemonic.toString(), pwArr[0]);
        let plaintext = deCrypt.toString(CryptoJS.enc.Utf8);
        console.log(plaintext);
        let encryption = AES.encrypt(plaintext, pwArr[1]).toString();
        console.log(encryption);
        fetch('/users/reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            password: pwArr[1],
            encryption
          })
        });
      });
  };

  const handleResetPassword = () => {
    props.handleClose();
    MySwal.mixin({
      input: 'password',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2', '3']
    })
      .queue(['Enter Old Password', 'Enter New Password', 'Re-enter Password'])
      .then((result) => {
        if (result.dismiss) {
          return;
        }
        if (!result.value[1] || !result.value[0] || !result.value[2]) {
          Swal.fire({
            title: 'Fields cannot be blank'
          });
        } else if (result.value[1] !== result.value[2]) {
          Swal.fire({
            title: 'Please enter matching passwords'
          });
        } else {
          fetch('/users/comparepw', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              password: result.value[0]
            })
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              if (data.msg === 'All Good!') handleFetch(result.value); //If the passwords match, it will fire handleFetch
              Swal.fire({
                title: data.msg
              });
            });
        }
      });
  };
  //****************************************SweetAlert modal end */
  return (
    <div>
      <button className='reset--pw' onClick={() => handleResetPassword()}>
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;
