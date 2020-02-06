import React from 'react';
class VideoData extends React.Component {
  state = {
    data: ''
  };

  componentDidMount() {
    fetch('/analytics')
      .then((response) => {
        response.json().then((result) => {
          console.log(result.data);
          console.log(Object.keys(result.data));
          Object.keys(result.data).map((key, i) => {
            console.log('index:', i);
            if (i === 3) {
              console.log(result.data[key].thumbnails.medium.url);
            }
          });
          this.setState(() => {
            return {
              data: result.data
            };
          });
        });
      })
      .catch(
        (error) => console.error // Handle the error response object
      );
  }

  render() {
    console.log(this.state.data);
    return (
      <div>
        <section className='youtube-data'>
          <h1 className='component-title'>Youtube Data</h1>
          {Object.keys(this.state.data).map((key, i) => {
            return (
              <React.Fragment key={i}>
                {i === 3 && (
                  <div className='profile-title-container'>
                    <div className='data-header'>
                      <h3>PROFILE</h3>
                      <svg>
                        <rect width='100' height='2' />
                      </svg>
                      <i className='fas fa-user-circle'></i>
                    </div>
                    <div className='data-wrap'>
                      <h4>
                        Youtube Title: <span>{this.state.data[key].title}</span>
                      </h4>
                      <h4>
                        Youtube Publish Date:{' '}
                        <span>{this.state.data[key].publishedAt}</span>
                      </h4>
                    </div>
                    <div className='profile-img-wrap'>
                      <img
                        className='profileImg'
                        src={this.state.data[key].thumbnails.medium.url}
                        alt='profile image'
                      />
                    </div>
                  </div>
                )}
                {i === 5 && (
                  <div className='statistics'>
                    <div className='data-header'>
                      <h3>STATISTICS</h3>
                      <svg>
                        <rect width='100' height='2' />
                      </svg>
                      <i className='fas fa-chart-bar'></i>
                    </div>
                    <div className='data-wrap'>
                      <h4>
                        Youtube views:{' '}
                        <span>{this.state.data[key].viewCount}</span>
                      </h4>
                      <h4>
                        Comments:{' '}
                        <span>{this.state.data[key].commentCount}</span>
                      </h4>
                      <h4>
                        Subscribers:{' '}
                        <span>{this.state.data[key].subscriberCount}</span>
                      </h4>
                      <h4>
                        Total videos:{' '}
                        <span>{this.state.data[key].videoCount}</span>
                      </h4>
                    </div>
                  </div>
                )}
                {i === 6 && (
                  <div className='status'>
                    <div className='data-header'>
                      <h3>ACCOUNT STATUS</h3>
                      <svg>
                        <rect width='100' height='2' />
                      </svg>
                      <i className='fas fa-eye'></i>
                    </div>
                    <div className='data-wrap'>
                      <h4>
                        Privacy status:{' '}
                        <span>{this.state.data[key].privacyStatus}</span>
                      </h4>
                      <h4>
                        Long uploads:{' '}
                        <span>{this.state.data[key].longUploadsStatus}</span>
                      </h4>
                      <h4>
                        Made for kids:{' '}
                        {this.state.data[key].madeForKids ? (
                          <span>True</span>
                        ) : (
                          <span>False</span>
                        )}
                      </h4>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </section>
      </div>
    );
  }
}

export default VideoData;
