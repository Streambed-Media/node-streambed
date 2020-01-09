import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ResetPassword = () => {
  //****************************************SweetAlert modal */
  const MySwal = withReactContent(Swal);

  const handleResetPassword = () => {
    MySwal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2']
    })
      .queue(['Enter New Password', 'Re-enter Password'])
      .then((result) => {
        if (result.value) {
          const answers = JSON.stringify(result.value);
          Swal.fire({
            title: 'All done!',
            html: `
              Your answers:
              <pre><code>${answers}</code></pre>
            `,
            confirmButtonText: 'Lovely!'
          });
        }
      });
  };
  //****************************************SweetAlert modal end */
  return (
    <div>
      <button className='reset--pw' onClick={handleResetPassword}>
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;
