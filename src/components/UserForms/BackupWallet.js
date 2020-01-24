import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CryptoJS, { enc, AES } from 'crypto-js';

const BackupWallet = (props) => {
  //****************************************SweetAlert modal */
  const MySwal = withReactContent(Swal);
  //**********************************************************************/
  //********This will fetch the encrypted mnemonic from the Db if pw is correct */
  //********It will decrypt and show to user, telling them to write it down */
  //**********************************************************************/

  const backupWallet = () => {
    props.handleClose();
    MySwal.mixin({
      input: 'password',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1']
    })
      .queue(['Enter Password'])
      .then((result) => {
        if (!result.value) {
          Swal.fire({
            title: 'Fields cannot be blank'
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
              if (data.msg === 'All Good!') {
                const { mnemonic } = data;
                console.log(mnemonic);
                let deCrypt = AES.decrypt(mnemonic.toString(), result.value[0]);
                let plaintext = deCrypt.toString(CryptoJS.enc.Utf8);
                console.log(plaintext);
                Swal.fire({
                  title: 'Write this mnemonic down',
                  text: plaintext,
                  footer: "<strong>Don't lose it, Don't share it</strong>"
                });
              } else {
                Swal.fire({
                  title: data.msg
                });
              }
            });
        }
      });
  };
  //****************************************SweetAlert modal end */
  return (
    <div>
      <button className='reset--pw' onClick={() => backupWallet()}>
        Backup Account
      </button>
    </div>
  );
};

export default BackupWallet;
