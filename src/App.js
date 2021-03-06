import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import GoogleAuthMaster from './components/GoogleAuth_master';
import RenderContent from './components/RenderContent';
import GetStartedandLogin from './components/UserForms/GetStartedandLogin';
import DropDown from './components/Dropdown';
import './styles/IndexStyles/index.css';
import 'semantic-ui-css/semantic.min.css';
import ResetPassword from './components/UserForms/ResetPassword';
import Hamburger from './components/UserForms/Hamburger';

class App extends React.Component {
  state = {
    isSignedIn: false,
    checked: true
  };

  handleCheckboxChange = () => {
    this.setState({ checked: !this.state.checked });
  };

  getUrl() {
    return window.location.pathname;
  }

  componentDidMount() {
    const loginURL = this.getUrl();
    const isMatch = /^(\/dashboard|\/upload-youtube|\/users\/login)/gi.test(
      loginURL
    );

    //Skips the login form page when page goes to upload-youtube
    if (loginURL === '/upload-youtube') {
      this.handleCheckboxChange();
    }
    if (loginURL === '/users/login') {
      // this.handleCheckboxChange()
    }
    if (isMatch) {
      this.setState({ isSignedIn: true });
    }
  }

  render() {
    if (this.state.isSignedIn === false) {
      return (
        <div>
          <div className='bg--image'></div>
          <img
            className='streambed--logo--main'
            src='images/StreambedLogo.svg'
            alt='streambed logo'
          ></img>
          <div className='container--login'>
            <div className='login--box'>
              <div className='trans--box'>
                <GetStartedandLogin url={this.getUrl()} />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className='container'>
          <div className='header--container'>
            <img
              src='/images/StreambedLogo.svg'
              alt='streambed logo'
              width={'250px'}
              className='streambed-logo'
            />
            <div className='toggle-publish-analytics'>
              <Hamburger
                isSignedIn={this.state.isSignedIn}
                isChecked={this.state.checked}
                checkboxHandler={this.handleCheckboxChange}
              />
            </div>
          </div>
          {this.state.checked === true ? (
            <div>
              <RenderContent checked={this.state.checked} />
            </div>
          ) : (
            <div>
              <DropDown getUrl={this.getUrl()} />
            </div>
          )}
        </div>
      );
    }
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
