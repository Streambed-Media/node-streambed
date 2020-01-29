import React from 'react';
import { web } from '../../oauthTwo.keys.json';
import App from '../App.js';

class GetChannelData extends React.Component {
  constructor(props) {
    super(props);
    this.getAPIdata = this.getAPIdata.bind(this);
    this.state = {
      inputTitle: 'Node js'
    };
  }

  getAPIdata() {
    let url = window.location.href;
    const accessToken = url.replace(/^.+=/gi, '');
    console.log(accessToken);
    fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&key={${web.apiKey}}`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + accessToken
        }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState(() => {
          return {
            items: data.items
          };
        });
        console.log('this statee: ', this.state);
        console.log(data);

        // window.alert('https://www.youtube.com/playlist?list=' + data.id)
      });
  }

  render() {
    return (
      <div>
        <AddForm />
        <button onClick={this.getAPIdata}></button>
      </div>
    );
  }
}

export { GetChannelData };
