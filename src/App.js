import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import GoogleAuthMaster from './components/GoogleAuth_master';
// import streambedLogo from '../public/images/streambedHeader.svg';
import RenderContent from './components/RenderContent';
import GetStartedandLogin from './components/UserForms/GetStartedandLogin';
import DropDown from './components/Dropdown';
import './styles/IndexStyles/index.css';
import 'semantic-ui-css/semantic.min.css';
import ResetPassword from './components/UserForms/ResetPassword';
import Hamburger from './components/UserForms/Hamburger';
// import newWallet  from '../wallet/wallet'
// console.log(newWallet)
class App extends React.Component {
  state = {
    isSignedIn: false,
    checked: true
  };

  handleCheckboxChange = () => {
    console.log('TESTING CHECKBOX');
    this.setState({ checked: !this.state.checked });
  };

  getUrl() {
    let url = window.location.href;
    const urlPath = url.replace(/^.+5000\//gi, '');
    let path = urlPath ? '/' + urlPath : '/';
    return path;
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
    console.log(this.getUrl(), this.state.isSignedIn);
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
                <GetStartedandLogin />
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
              src='/images/streambedLogo.svg'
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
              {/* <GoogleAuthMaster isSignedIn={this.state.isSignedIn} />
              <ResetPassword /> */}
              {/* <div className='ui toggle checkbox'>
                <input
                  type='checkbox'
                  name='publisher-analytics'
                  checked={this.state.checked}
                  onChange={this.handleCheckboxChange}
                />
                <label>Publisher / Analytics </label>
              </div> */}
            </div>
          </div>
          {this.state.checked === true ? (
            <div className='analytics-info'>
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
