import React from 'react';

class GetVideos extends React.Component {
  state = {
    videos: ''
  };

  componentDidMount() {
    fetch('/uploaded')
      .then((response) => {
        response.json().then((result) => {
          console.log(result);
          this.setState(() => {
            return {
              videos: result[0].videoFileName
            };
          });
        });
      })
      .catch(
        (error) => console.error // Handle the error response object
      );
  }

  render() {
    return (
      <div>
        <section className='youtube-data'>
          <h1 className='component-title'>Videos</h1>
          <div>{this.state.videos}</div>
        </section>
      </div>
    );
  }
}

export default GetVideos;
