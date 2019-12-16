import React from 'react';
import '../styles/GoogleAuth/googleAuthMaster.css';

/***********************************************************Google Oauth login page component ***************/
//!!!!!!!!!!!!!!!!!!!Need to work on this form submit, when switching accounts it doesn't switch right away
//!!!!!!!!!!!!!!!!Also need to render SignOut and make sign out correctly with auth
class GoogleAuth extends React.Component {
  state = {
    isSignedIn: false
  };
  /**This is taking props form App, setting state to true when you get signedIn to render the signout button**/
  componentDidMount() {
    this.setState({ isSignedIn: this.props.isSignedIn });
  }

  /**These functions arent really used currently**/
  onSignInClick = () => {
    this.setState({
      isSignedIn: true
    });
  };

  onSignOutClick = () => {
    this.setState({
      isSignedIn: false
    });
  };

  //Will render sign in or sign out button conditionally
  renderAuthButton() {
    if (this.state.isSignedIn) {
      return (
        <div className='signout--container'>
          <form
            onSubmit={this.isSignedIn}
            action='/logout-dashboard'
            method='POST'
          >
            <input
              className='ui red google button'
              type='submit'
              value='Logout of Google'
            />
          </form>
        </div>
      );
    } else {
      return (
        <div className='button--container'>
          <form onSubmit={this.isSignedIn} action='/dashboard' method='POST'>
            <input
              className='ui green google button'
              type='submit'
              value='Login with Google'
            />
          </form>
        </div>
      );
    }
  }

  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}
export default GoogleAuth;
