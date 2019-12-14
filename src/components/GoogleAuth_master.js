import React from 'react';
// import '../styles/GoogleAuth/googleAuthMaster.css';

/***********************************************************Google Oauth login page component ***************/
/**Video Data */
//'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'

/**Analytics */
//'https://youtubeanalytics.googleapis.com/$discovery/rest?version=v2'

/***********************************************************************************************************/
class GoogleAuth extends React.Component {
  state = {
    isSignedIn: null
  };

  componentDidMount() {

    this.setState({
      isSignedIn: false
    });

  }

  //This function will sign into to both analytics button click
  onSignInClick = () => {
    /*****Yo fuck the ssl, its causing login issues 
    this.auth.signIn({
      scope: 'https://www.googleapis.com/auth/youtube.force-ssl'
    });
    */

    // this.auth.signIn({
    //   scope: 'https://www.googleapis.com/auth/yt-analytics.readonly'
    // });
  };

  onSignOutClick = () => {
    this.auth.signOut();
  };

  //Will render sign in or sign out button conditionally
  renderAuthButton() {
    if (this.state.isSignedIn === null) {
      return null;
    } else if (this.state.isSignedIn) {
      return (
        <div className='signout--container'>
          <button
            onClick={this.onSignOutClick}
            className='ui red google button'
          >
            <i className='google icon' /> Sign Out
          </button>
        </div>
      );
    } else {
      return (
        <div className='button--container'>
           <form onSubmit={this.isSignedIn} action="/dashboard" method="POST">
                <input className="green-google-button" type="submit" value="Login with Google"/>
            </form>
        </div>
      );
    }
  }

  render() {
    return (
      <div>{this.renderAuthButton()}</div>
    )
  }
}
export default GoogleAuth;
