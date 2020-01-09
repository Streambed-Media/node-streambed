import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ResetPassword = (props) => {
  //****************************************SweetAlert modal */
  const MySwal = withReactContent(Swal);

  //Fetch function for modal
  const handleFetch = (pw) => {
    fetch('/users/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: pw
      })
    });
  };

  const handleResetPassword = () => {
    MySwal.mixin({
      input: 'password',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2']
    })
      .queue(['Enter New Password', 'Re-enter Password'])
      .then((result) => {
        if (!result.value[0]) {
          Swal.fire({
            title: 'Password cannot be blank'
          });
        } else if (result.value[0] !== result.value[1]) {
          Swal.fire({
            title: 'Please enter matching passwords'
          });
        } else {
          handleFetch(result.value[0]);
          Swal.fire({
            title: 'All done!'
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
