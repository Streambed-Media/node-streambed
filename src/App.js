import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import GoogleAuthMaster from './components/GoogleAuth_master';
// import streambedLogo from '../public/images/streambedHeader.svg';
import RenderContent from './components/RenderContent';
import GetStartedandLogin from './components/UserForms/GetStartedandLogin';
import { Upload } from './components/VideoUpload.js';
import CreateDropDown from './components/Dropdown'
import './styles/IndexStyles/index.css';
import 'semantic-ui-css/semantic.min.css';
import 'font-awesome/css/font-awesome.min.css';

class App extends React.Component {
    state = {
      isSignedIn: false,
      checked: true
    };
 
  handleCheckboxChange = (e) => {
    this.setState({ checked: !this.state.checked });
  }

  getUrl() {
    let url = window.location.href;
    const urlPath = url.replace(/^.+5000\//gi, '');
    let path = urlPath ? '/' + urlPath : '/';
    return path;
  }

  componentDidMount() {
    let loginURL = this.getUrl();
    console.log(loginURL)
    const isMatch = /^(\/dashboard|\/youtube-upload)/gi.test(loginURL);
    if (isMatch) {
      this.setState({ isSignedIn: true });
    }
  }

  render() {
    console.log(this.getUrl(), this.state.isSignedIn);
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
            <div>
              <CreateDropDown />
            </div>
          )}
        </div>
      );
    }
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
