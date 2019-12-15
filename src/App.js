import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import { Nav } from './components/nav.js';
import GoogleAuthMaster from './components/GoogleAuth_master';
// import streambedLogo from '../public/images/streambedHeader.svg';
import RenderContent from './components/RenderContent';
import GetStartedandLogin from './components/UserForms/GetStartedandLogin';
import { Upload } from './components/VideoUpload.js';
import { GetChannelData } from './components/channelData.js';
import './styles/IndexStyles/index.css';
import 'semantic-ui-css/semantic.min.css';
import 'font-awesome/css/font-awesome.min.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      checked: true
    };
  }
  handleCheckboxChange = (e) => {
    this.setState({ checked: !this.state.checked });
  };
  getUrl() {
    let url = window.location.href;
    const urlPath = url.replace(/^.+5000\//gi, '');
    let path = urlPath ? '/' + urlPath : '/';
    return path;
  }

  componentDidMount() {
    let loginURL = this.getUrl();
    const isMatch = /^\/\?access_token/gi.test(loginURL);
    console.log(isMatch);
    if (isMatch) {
      this.setState({ isSignedIn: true });
    }
  }

  isSignedIn(getUrl) {
    let loginURL = this.getUrl();
    const isMatch = /^\/\?access_token/gi.test(loginURL);
    if (isMatch) {
      this.setState({ isSignedIn: true });
    }
  }

  showLogin() {
    let path = this.getUrl();
    return path === '/' ? 'block' : 'none';
  }
  showDropDown() {
    let path = this.getUrl();
    return path === '/' ? 'none' : 'block';
  }
  render() {
    console.log(this.getUrl());
    if (this.state.isSignedIn === false) {
      return (
        <div className='container'>
          <img src='images/streambedHeader.svg' alt='streambed logo'></img>
          <div className='login--box'>
            <div className='trans--box'>
              <GetStartedandLogin />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className='container'>
          <img
            src='/images/streambedHeader.svg'
            alt='streambed logo'
            width={'250px'}
            className='streambed-logo'
          />
          <div className=' toggle-publish-analytics'>
            <GoogleAuthMaster isSignedIn={this.state.isSignedIn} />
            <div className='ui toggle checkbox'>
              <input
                type='checkbox'
                name='publisher-analytics'
                checked={this.state.checked}
                onChange={this.handleCheckboxChange}
              />
              <label>Publisher / Analytics </label>
            </div>
          </div>
          {this.state.checked === true ? (
            <div className='analytics-info'>
              <RenderContent />
            </div>
          ) : (
            <div>Youtube Upload here!!!</div>
          )}
        </div>
      );
    }
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
