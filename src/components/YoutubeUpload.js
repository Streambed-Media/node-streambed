import React, { PropTypes } from 'react';
import wallet from '../helpers/Wallet';

let basic = {
  descriptor:
    'ClwKB3AucHJvdG8SEm9pcFByb3RvLnRlbXBsYXRlcyI1CgFQEg0KBXRpdGxlGAEgASgJEhMKC2Rlc2NyaXB0aW9uGAIgASgJEgwKBHllYXIYAyABKBFiBnByb3RvMw==',
  name: 'tmpl_66089C48',
  payload: {
    title: '',
    description: '',
    year: 2020
  }
};

let iterativeYTAssociation = {
  descriptor:
    'CkoKB3AucHJvdG8SEm9pcFByb3RvLnRlbXBsYXRlcyIjCgFQEgsKA3VybBgBIAEoCRIRCgl5b3VUdWJlSWQYAiABKAliBnByb3RvMw==',
  name: 'tmpl_834772F4',
  payload: {
    url: 'youtubevideolink',
    youTubeId: '',
    contentPlatform: 1 // ContentPlatform_YOUTUBE
  }
};

let basicVideoTmpl = {
  descriptor:
    'CuABCgdwLnByb3RvEhJvaXBQcm90by50ZW1wbGF0ZXMiuAEKAVASEwoLcHVibGlzaERhdGUYASABKAQSGAoQYWRkcmVzc0RpcmVjdG9yeRgDIAEoCRIQCghmaWxlbmFtZRgEIAEoCRITCgtkaXNwbGF5TmFtZRgFIAEoCRIZChF0aHVtYm5haWxGaWxlbmFtZRgGIAEoCSJCCgdOZXR3b3JrEg0KCVVOREVGSU5FRBAAEhAKDE5ldHdvcmtfSVBGUxABEhYKEk5ldHdvcmtfQklUVE9SUkVOVBACYgZwcm90bzM=',
  name: 'tmpl_5D503849',
  payload: {
    publishDate: Date.now(),
    addressDirectory: 'ipfsHASH',
    filename: 'video.mp4',
    displayName: '',
    thumbnailFilename: 'thumb.png',
    network: 1 // Network_IPFS
  }
};

class YoutubeUpload extends React.Component {
  state = {
    loader: false,
    results: null,
    checkbox: {},
    checkBoxErr: false
  };
  isIPFSerror = (youTubeData) => {
    return /^IPFS failed:/gi.test(youTubeData);
  };

  upDatePayloads = () => {
    const youTubeData = this.state.results;

    //If IPFS is not running empty payload else add the ipfs hash
    let ipfs = this.isIPFSerror(youTubeData.ipfs) ? '' : youTubeData.ipfs;

    basic.payload.title = youTubeData.snippet.title;
    basic.payload.description = youTubeData.snippet.description;
    iterativeYTAssociation.payload.url =
      'https://www.youtube.com/watch?v=' + youTubeData.id;
    iterativeYTAssociation.payload.youTubeId = youTubeData.id;
    basicVideoTmpl.payload.displayName = youTubeData.snippet.title + '.mp4';
    basicVideoTmpl.payload.addressDirectory = ipfs;

    let registration = [basic, iterativeYTAssociation, basicVideoTmpl];
    return registration;
  };

  sendFloPost = async (floData) => {
    console.log(floData);
    const response = await fetch('/sendflo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        signed64: floData
      })
    });
    const json = await response.json();
    return json;
  };

  walletData = (youtubeResults) => {
    if (youtubeResults.err) return;

    const { createRegistration, publishRecord } = wallet;
    let registration = this.upDatePayloads();

    createRegistration(registration)
      .then((data) => {
        console.log(data);
        return publishRecord(data);
      })
      .then((signed64) => {
        console.log(signed64);
        this.sendFloPost(signed64).then((res) => console.log('Sent to flo'));
      })
      .catch((err) => console.log('WalletData ' + err));
  };

  getYouTubeData = () => {
    const checkbox = this.state['checkbox'];

    fetch('/upload-youtube', {
      method: 'POST',
      body: JSON.stringify(checkbox),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ results: data, loader: false }, () =>
          this.walletData(this.state.results)
        );
      })
      .catch((err) => console.log(err));
  };

  checboxChecked = () => {
    //Dummy log, so checkbox stays checked for youtube. React is stupid sometimes
    console.log(this.state.checkbox);
  };

  checkBoxValue = (e) => {
    e.preventDefault();
    const checked = document.querySelectorAll('input[name="uploadChecked"]');
    let val = {};

    for (let check of checked) {
      // Checks if checkboxes are checked
      if (check.checked) {
        val[check.value] = check.value;
      }
    }

    // If no checkbox is checked it add component error
    if (Object.keys(val).length === 0) {
      return this.setState({ checkBoxErr: 'Must make checkbox selection' });
    }

    // Updates checkbox value and call the getYouTubeData as a callback
    this.setState({ checkbox: val, loader: true }, this.getYouTubeData);
  };

  render() {
    return (
      <div>
        <section className='upload-youtube'>
          {this.state.loader && <ImageLoader />}
          {this.state.results ? (
            <div className='youtube-callback-data'>
              {Object.keys(this.state.results).map((key, i) => {
                const youtube_data = this.state.results;
                let ipfsErr = this.isIPFSerror(youtube_data.ipfs);

                // Only if Youtube fails will post error
                if (ipfsErr && i === 0) {
                  return (
                    <div key={i} className='youtube-error'>
                      <h5 key={key}>{youtube_data.ipfs} </h5>
                    </div>
                  );
                }
                if (key === 'err') {
                  return (
                    <div key={i} className='youtube-error'>
                      <h5 key={i}>{youtube_data[key]}</h5>
                    </div>
                  );
                } else {
                  let snippet = youtube_data.snippet;
                  let status = youtube_data.status;
                  return (
                    <React.Fragment key={i}>
                      {key === 'snippet' && [
                        <div key={i + 1} className='youtube-snippet'>
                          <div className='data-header'>
                            <h3>Video</h3>
                            <i className='fas fa-video'></i>
                          </div>
                          <h4 className='publishedAt'>
                            Published At: <span>{snippet.publishedAt}</span>
                          </h4>
                          <h4 className='channel-title'>
                            Channel Title: <span>{snippet.channelTitle}</span>
                          </h4>
                          <h4 className='channelId'>
                            Channel Id: <span>{snippet.channelId}</span>
                          </h4>
                        </div>,
                        <div key={i + 2} className='devider-wrapper'>
                          <span className='youtube-data-devider'></span>
                        </div>
                      ]}
                      {key === 'status' && (
                        <div className='youtube-status'>
                          <div className='data-header'>
                            <h3>Video Status</h3>
                            <i className='fas fa-eye'></i>
                          </div>
                          <h4 className='upload-status'>
                            Upload Status: <span>{status.uploadStatus}</span>
                          </h4>
                          <h4 className='privacy'>
                            Privacy: <span>{status.privacyStatus}</span>
                          </h4>
                          <h4 className='embeddable'>
                            Embedable for other sites:{' '}
                            {status.embeddable ? (
                              <span>True</span>
                            ) : (
                              <span>false</span>
                            )}
                          </h4>
                          <h4 className='public-stats'>
                            Public stats viewable:{' '}
                            {status.publicStatsViewable ? (
                              <span>True</span>
                            ) : (
                              <span>false</span>
                            )}
                          </h4>
                        </div>
                      )}
                    </React.Fragment>
                  );
                }
              })}
            </div>
          ) : (
            <form
              action='/upload-youtube'
              method='POST'
              encType='multipart/form-data'
            >
              {/* Only shown screen size < 540px */}
              <div className='form-group _540px'>
                <h4 className='upload-type'>Upload Location</h4>
              </div>
              <div className='upload-container'>
                <div className='checkbox-container'>
                  {this.state.checkBoxErr && (
                    <h4 className='checkboxErr'>{this.state.checkBoxErr}</h4>
                  )}

                  <div className='form-group'>
                    <h4 className='upload-type'>Upload Location</h4>
                  </div>
                  <div className='checkbox-upload'>
                    <input
                      type='checkbox'
                      id='youtube'
                      name='uploadChecked'
                      value='youtube'
                      checked={this.props.checkBoxDefault}
                      onChange={this.checboxChecked}
                    />
                    <img
                      className='upload-icon'
                      src='../images/youtube-icon.png'
                      alt='youtube icon'
                    />
                    <label htmlFor='youtube'>Youtube</label>
                  </div>
                  <div className='checkbox-upload'>
                    <input
                      type='checkbox'
                      id='ipfs'
                      name='uploadChecked'
                      value='ipfs'
                    />
                    <img
                      className='upload-icon'
                      src='../images/Ipfs-icon.png'
                      alt='ipfs icon'
                    />
                    <label htmlFor='ipfs'>IPFS</label>
                  </div>
                </div>
                <button
                  onClick={this.checkBoxValue}
                  type='submit'
                  className='ui button youtube-btn'
                >
                  Upload
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    );
  }
}
const ImageLoader = () => (
  <div className='img-loader'>
    <p>UPLOADING </p>
    <img src='../images/loader-balls.gif' alt='gif loader' />
  </div>
);
YoutubeUpload.defaultProps = {
  checkBoxDefault: true
};

export { YoutubeUpload };
