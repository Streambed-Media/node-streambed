import React from 'react';
import ReactDOM from 'react-dom';
import { App } from '../App.js'
import { Upload } from './VideoUpload.js'
import { Results } from './Results'

class Nav extends React.Component {
    constructor( props ) {
        super( props )
        this.showDropDown = this.showDropDown.bind(this)
        // this.renderUpload = this.renderUpload.bind(this)
        this.state = {
            loggedIn: true,
            isUpload: false
        }
    }
    

    showDropDown(e){
        console.log(e.target)
        const dropDown = document.getElementsByClassName('dropdown-menu')[0]
        let hight = dropDown.style.height || '0' 
        let currentHeight = +hight.replace(/px$/g, '')

        if(e.target.className === 'dropdown-item') {
            return dropDown.style.height = 0;
        }
        
        if(currentHeight <= 0) {
            dropDown.style.height = '175px';
        } else {
            dropDown.style.height = 0;
        }
    }

    getUrl() {
        let url = window.location.href
        const urlPath = url.replace(/^.+5000\//ig, ""); 
        let path = urlPath ? '/'+urlPath : '/'
        return path
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                    <a className="navbar-brand" href="/dashboard">Streambed</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item dropdown" style={{display: this.props.showDropDown}}>
                                <a onClick={this.showDropDown} className="nav-link dropdown-toggle" href="#" role="button"
                                    aria-haspopup="true" aria-expanded="false">Dropdown</a>
                                <div onClick={this.showDropDown} className="dropdown-wrap">
                                    <div className="dropdown-menu show" aria-labelledby="navbarDropdown">
                                        <a onClick={() => this.setState({ isUpload: true }) } className="dropdown-item" href="/upload">Video uploads</a>
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item" href="#">Channels</a>
                                        <a className="dropdown-item" href="#">Playlist</a>
                                        <a className="dropdown-item" href="#">Videos</a>
                                        <a className="dropdown-item" href="/analytics">Analytics</a>
                                    </div>
                                </div>
                            </li>
                            <li style={{display: this.props.showLogin}} className="nav-item">
                                <form onSubmit={this.loggedIn} action="/dashboard" method="POST">
                                    <input type="submit" value="Login"/>
                                </form>
                            </li>
                        </ul>
                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                        </form>
                    </div>
                </nav>
                {/* { this.props.getUrl === '/upload' ? <Results /> : null} */}
            </div>
        )
    }
}

export { Nav }