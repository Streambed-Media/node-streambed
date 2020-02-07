import React from 'react';
import { YoutubeUpload } from './YoutubeUpload';

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUploaded: false,
      results: []
    };
  }

  componentDidMount() {
    fetch('/uploaded')
      .then((response) => {
        response.json().then((result) => {
          this.setState(() => {
            return {
              isUploaded: true,
              results: result,
              videoName: result[0].videoFileName,
              imgName: result[0].imgFileName,
              uid: result[0].uid
            };
          });
        });
      })
      .catch(
        (error) => console.error // Handle the error response object
      );
  }

  render() {
    console.log(this.state.results, this.state, this.props);

    return (
      <div className='content-container'>
        <div className='content-wrapper'>
          {this.state.results.map((results, i) => {
            return (
              <React.Fragment key={i}>
                <p className='result-item'>
                  Title: &nbsp;&nbsp;{results.title}
                </p>
                <p className='result-item'>
                  Description: &nbsp;&nbsp;{results.desc}
                </p>
              </React.Fragment>
            );
          })}
          {this.state.imgName && (
            <img
              className='result-item'
              key={this.state.imgName}
              width='200px'
              src={'../uploads/' + this.state.uid + '/' + this.state.imgName}
              alt='thumbnail'
            />
          )}
          {this.state.videoName && (
            <VideoElem videoName={'../uploads/' + this.state.uid + '/' + this.state.videoName} />
          )}
          {this.props.getUrl === '/upload-youtube' ? (
            <VideoConfirmation />
          ) : (
            <YoutubeUpload />
          )}
        </div>
      </div>
    );
  }
}

const VideoElem = (props) => {
  return (
    <div className='video-container'>
      <video key={props.videoName} className='video-element' controls>
        <source src={props.videoName} type='video/mp4' />
      </video>
    </div>
  );
};

export { Results };
