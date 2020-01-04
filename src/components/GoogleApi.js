import React from 'react'
import PropTypes from 'prop-types'
import { createContext } from 'react-broadcast'
import loadScript from '@lourd/load-script'
import { GoogleApi, GoogleApiConsumer } from '@lourd/react-google-api'
console.log(GoogleApi)

// class ApiProps extends React.Component {
    
//     render(){
//         const apiProps = {
//             clientId: "552574662444-3m7nr6iiogrss4ed2941414319ts4tdq.apps.googleusercontent.com",
//             apiKey: 'AIzaSyAnDUoAqnK73CFCt0DUsGQSdFZI6tdbVa0',
//             discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
//             scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
//         }
//         return (
//           <div>
//             <GoogleApi {...apiProps} />
//             </div>
//         )
//     }

// }

const {
  Provider: GoogleApiProvider,
  Consumer: GoogleApiConsumer,
} = createContext(null)
GoogleApiProvider.displayName = 'GoogleApiProvider'
GoogleApiConsumer.displayName = 'GoogleApiConsumer'

class GoogleApi extends React.Component {
  static propTypes = {
    clientId: PropTypes.string.isRequired,
    apiKey: PropTypes.string.isRequired,
    discoveryDocs: PropTypes.arrayOf(PropTypes.string).isRequired,
    scopes: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  }

  authorize = () => {
    if (this.auth) {
      this.auth.signIn()
    }
  }

  signout = () => {
    if (this.auth) {
      this.auth.signOut()
    }
  }

  state = {
    signedIn: false,
    client: null,
    loading: true,
    error: null,
    authorize: this.authorize,
    signout: this.signout,
  }

  componentDidMount() {
   console.log( this.props)
    this.setupApi()
  }

  async setupApi() {
    try {
      if (typeof window.gapi === 'undefined') {
        await loadScript('https://apis.google.com/js/api.js')
      }
      if (!gapi.client) {
        await new Promise((resolve, reject) =>
          gapi.load('client:auth2', {
            callback: resolve,
            onerror: reject,
          }),
        )
      }
      await gapi.client.init({
        apiKey: this.props.apiKey,
        clientId: this.props.clientId,
        discoveryDocs: this.props.discoveryDocs,
        scope: this.props.scopes.join(','),
      })
    } catch (error) {
      this.setState({
        loading: false,
        error,
      })
      return
    }
    this.auth = gapi.auth2.getAuthInstance()
    this.setState({
      client: gapi.client,
      loading: false,
      signedIn: this.auth.isSignedIn.get(),
    })
    this.auth.isSignedIn.listen(signedIn => this.setState({ signedIn }))
  }
  

  render() {
    return (
        
      <GoogleApiProvider value={this.state}>
        {typeof this.props.children === 'function'
          ? this.props.children(this.state)
          : this.props.children}
      </GoogleApiProvider>
    )
  }
}
export { GoogleApi, GoogleApiConsumer } from './GoogleApi'
export { GoogleApi, GoogleApiConsumer, GoogleApiProvider }