import React from 'react';
import '../../styles/Hamburger/Hamburger.css';
import ResetPassword from './ResetPassword';
import GoogleAuth_Master from '../GoogleAuth_master';
import PubAnalytics from './PubAnalytics';

class Hamburger extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSidebarOpen: false
    };
  }

  handleMenuButtonClick = () => {
    this.setState({ isSidebarOpen: !this.state.isSidebarOpen });
  };

  render() {
    const { isSidebarOpen } = this.state;

    return (
      <div className='ham--container'>
        <div className='menu-button' onClick={this.handleMenuButtonClick}>
          <i className='fas fa-bars' style={{ color: '#2f63e3' }} />
        </div>

        {/*	Sidebar */}
        <nav className={`nav ${isSidebarOpen ? 'show' : 'close--nav'}`}>
          <div onClick={this.handleMenuButtonClick} className='close'>
            <i className='fas fa-times' />
          </div>
          <ul className='menu-items'>
            <li className='menu-list'>
              <a className='menu-link'>
                <PubAnalytics
                  isChecked={this.props.isChecked}
                  checkboxHandler={this.props.checkboxHandler}
                  handleClose={this.handleMenuButtonClick}
                />
              </a>
            </li>
            {/* Remember me for youtube auth, Not functional yet */}
            <div className='ui checkbox'>
              <input type='checkbox' />
              <label>
                <span className='social--media'>Remember Me</span>
              </label>
            </div>
            {/* End Remember me for youtube auth */}
            <li className='menu-list'>
              <a className='menu-link'>
                <ResetPassword handleClose={this.handleMenuButtonClick} />
              </a>
            </li>
            <li className='menu-list'>
              <a className='menu-link'>
                <GoogleAuth_Master isSignedIn={this.props.isSignedIn} />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Hamburger;
