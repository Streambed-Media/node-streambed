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
          <i className='fas fa-bars' />
        </div>

        {/*	Sidebar */}
        <nav className={`nav ${isSidebarOpen ? 'show' : ''}`}>
          <div onClick={this.handleMenuButtonClick} className='close'>
            <i className='fas fa-times' />
          </div>
          <ul className='menu-items'>
            <li className='menu-list'>
              <a className='menu-link'>
                <PubAnalytics
                  isChecked={this.props.isChecked}
                  checkboxHandler={this.props.checkboxHandler}
                />
              </a>
            </li>
            <li className='menu-list'>
              <a className='menu-link'>
                <ResetPassword />
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
