import React, { PropTypes } from 'react';
import { Modules } from 'js-oip';
import wallet from '../helpers/Wallet';
import { enc, AES } from 'crypto-js';

const youtube = {
	kind: "youtubevideo", 
	etag: "p4VTdlkQv3HQeTEaXgvLePAydmU/M6CbZTC9wbcQsb3LckLFw2gu1z0",
 	id: "6MABNa_ZgOc", 
	snippet: {
		publishedAt: "2020-01-03T21:31:49.000Z",
		channelId: "UChFpwHejHDGUKxjKYC98uWw", 
		title: "cartoon", 
		description: "yawning",
		thumbnails: {
			deault: {
				url: "https://i.ytimg.com/vi/6MABNa_ZgOc/default.jpg",
				width: 120,
				height: 90
			},
			channelTitle: "Brad Vanderbush"
		},
	},		
	status: {
		uploadStatus: "uploaded",
		privacyStatus: "public",
		license: "youtube",
		embeddable: true,
		publicStatsViewable: true
	}
}
let basic = {
    descriptor: 'ClwKB3AucHJvdG8SEm9pcFByb3RvLnRlbXBsYXRlcyI1CgFQEg0KBXRpdGxlGAEgASgJEhMKC2Rlc2NyaXB0aW9uGAIgASgJEgwKBHllYXIYAyABKBFiBnByb3RvMw==',
    name: 'tmpl_66089C48',
    payload: {
      title: '',
      description: '',
      year: 2020
    }
  }
  
  let iterativeAssociation = {
    descriptor: 'CqoCCgdwLnByb3RvEhJvaXBQcm90by50ZW1wbGF0ZXMiggIKAVASEgoKY29udGVudFVybBgBIAEoCRIUCgxpZE9uUGxhdGZvcm0YAiABKAkSKAoPY29udGVudFBsYXRmb3JtGAMgASgOMg9Db250ZW50UGxhdGZvcm0iqAEKD0NvbnRlbnRQbGF0Zm9ybRIdChlDb250ZW50UGxhdGZvcm1fVU5ERUZJTkVEEAASGwoXQ29udGVudFBsYXRmb3JtX1lPVVRVQkUQARIeChpDb250ZW50UGxhdGZvcm1fU09VTkRDTE9VRBACEhwKGENvbnRlbnRQbGF0Zm9ybV9GQUNFQk9PSxADEhsKF0NvbnRlbnRQbGF0Zm9ybV9UV0lUVEVSEARiBnByb3RvMw==',
    name: 'tmpl_C27930AA',
    payload: {
      contentUrl: '',
      idOnPlatform: '',
      contentPlatform: 1 // ContentPlatform_YOUTUBE
    }
  }
  
  let basicVideoTmpl = {
    descriptor: 'CuABCgdwLnByb3RvEhJvaXBQcm90by50ZW1wbGF0ZXMiuAEKAVASEwoLcHVibGlzaERhdGUYASABKAQSGAoQYWRkcmVzc0RpcmVjdG9yeRgDIAEoCRIQCghmaWxlbmFtZRgEIAEoCRITCgtkaXNwbGF5TmFtZRgFIAEoCRIZChF0aHVtYm5haWxGaWxlbmFtZRgGIAEoCSJCCgdOZXR3b3JrEg0KCVVOREVGSU5FRBAAEhAKDE5ldHdvcmtfSVBGUxABEhYKEk5ldHdvcmtfQklUVE9SUkVOVBACYgZwcm90bzM=',
    name: 'tmpl_5D503849',
    payload: {
      publishDate: Date.now(),
      addressDirectory: 'QmXpsLSLAVeReeKJumUujpXCNyAhmYC42ixqmmHx9W6YwN',
      filename: 'video.mp4',
      displayName: '',
      thumbnailFilename: 'thumb.png',
      network: 1, // Network_IPFS
    }
  }


class YoutubeUpload extends React.Component {
    state = {
        results: null,
        checkbox: {},
        checkBoxErr: false,
    }

    upDatePayloads = () => {
        const youTubeData = this.state.results
        console.log( basic.payload.title, youTubeData.snippet.title)
        basic.payload.title = youTubeData.snippet.title
        basic.payload.description = youTubeData.snippet.description
        iterativeAssociation.payload.contentUrl = 'https://www.youtube.com/watch?v='+youTubeData.id;
        iterativeAssociation.payload.idOnPlatform = youTubeData.id
        basicVideoTmpl.payload.displayName = youTubeData.snippet.title+'.mp4'
        let registration = [basic, iterativeAssociation, basicVideoTmpl];
        return registration
    }

    sendFloPost = async ( floData ) => {
        console.log(floData)
        const response = await fetch('http://localhost:5000/sendflo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                signed64: floData
            })
        })
        const json = await response.json();
        return json
    }
    
    walletData = () => {
        const { createRegistration, publishRecord} = wallet
        let registration = this.upDatePayloads()
        
        createRegistration( registration )
            .then((data) => {
                console.log(data)
                return publishRecord( data )
            })
            .then((signed64)  => {
                console.log(signed64)
                this.sendFloPost( signed64 ).then((res)=> console.log(res))
                // sendToBlockChain(signed64, walletdata)
            })
        .catch(err => console.log('WalletData ' + err));
    }

    getYouTubeData = () => {
        
        const checkbox = this.state['checkbox']
        return this.setState({results: youtube},() => this.walletData()) // CHANGE THIS BACK !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        fetch('http://localhost:5000/upload-youtube', {
            method: 'POST',
            body: JSON.stringify(checkbox),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then((data) => {
           
            this.setState({results: data},() => this.walletData())
        })
        .catch((err) => console.log(err));
    }

    checboxChecked = () => {
        //Dummy log, so checkbox stays checked for youtube. React is stupid sometimes
        console.log(this.state.checkbox)
    }

    checkBoxValue = (e) => {
        e.preventDefault()
        const checked = document.querySelectorAll('input[name="uploadChecked"]')
        let val = {}
  
        for (let check of checked) {
   
            // Checks if checkboxes are checked
            if ( check.checked ) {
                val[check.value] = check.value
            }
        }

        // If no checkbox is checked it add component error
        if ( Object.keys(val).length === 0 ) {
           return this.setState({checkBoxErr: 'Must make checkbox selection'})
        } 

        // Updates checkbox value and call the getYouTubeData as a callback
        this.setState({checkbox: val}, this.getYouTubeData) 
    }


    render(){
        return (
            <div>
                <section className="upload-youtube">
                    {console.log(this.state.results)}
                    
                    {this.state.results ? 
                        <div className="youtube-callback-data">
                       {
                        Object.keys(this.state.results).map((key, i) => {
                            const youtube_data = this.state.results
                            console.log(key, i)
                            
                            if ( key === 'err' ) {
                                return (
                                    <div key={i} className="youtube-error">
                                        <h5 key={i}>{ youtube_data[key] }</h5>
                                    </div>
                                )
                            } else {
                                let snippet = youtube_data.snippet;
                                let status = youtube_data.status;
                                return (
                                    <React.Fragment key={i}>
                                        {key === 'snippet' && [
                                            <div key={i+1} className="youtube-snippet">
                                                <div className="data-header">
                                                <h3>Video</h3>
                                                <i className="fas fa-video"></i>
                                                </div>  
                                                <h4 className="publishedAt">Published At: <span>{ snippet.publishedAt }</span></h4>
                                                <h4 className="channel-title">Channel Title: <span>{ snippet.channelTitle }</span></h4>
                                                <h4 className="channelId">Channel Id: <span>{ snippet.channelId }</span></h4>
                                            </div>,
                                            <div key={i+2} className="devider-wrapper">
                                                <span className="youtube-data-devider"></span>
                                            </div>
                                        ]}
                                        {key === 'status' &&
                                            <div className="youtube-status">
                                                <div className="data-header">
                                                    <h3>Video Status</h3>
                                                    <i className="fas fa-eye"></i>
                                                </div>  
                                                <h4 className="upload-status">Upload Status: <span>{ status.uploadStatus }</span></h4>
                                                <h4 className="privacy">Privacy: <span>{ status.privacyStatus }</span></h4>
                                                <h4 className="embeddable">Embedable for other sites: { status.embeddable ? <span>True</span>: <span>false</span>}</h4>
                                                <h4 className="public-stats">Public stats viewable: { status.publicStatsViewable ? <span>True</span>: <span>false</span>}</h4>
                                            </div>
                                        }
                                    </React.Fragment>
                                )
                            }
                        })
                    }
                    </div> 
                    :
                    <form action="/upload-youtube" method="POST" encType="multipart/form-data">
                        {/* Only shown screen size < 540px */}
                        <div className="form-group _540px">
                            <h4 className="upload-type">Upload Location</h4>
                        </div>
                        <div className="upload-container">
                            <div className="checkbox-container">
                                {this.state.checkBoxErr && <h4 className="checkboxErr">{this.state.checkBoxErr}</h4>}
                                
                                <div className="form-group">
                                    <h4 className="upload-type">Upload Location</h4>
                                </div>
                                <div className="checkbox-upload">
                                    
                                    <input type="checkbox" id="youtube" name="uploadChecked" value="youtube" 
                                    checked={this.props.checkBoxDefault} onChange={this.checboxChecked}/>
                                    <img className="upload-icon" src="../images/youtube-icon.png" alt="youtube icon"/>
                                    <label htmlFor="youtube">Youtube</label>
                                </div>

                                <div className="checkbox-upload">
                                    <input type="checkbox" id="ipfs" name="uploadChecked" value="ipfs"/>
                                    <img className="upload-icon" src="../images/ipfs-icon.png" alt="ipfs icon"/>
                                    <label htmlFor="ipfs">IPFS</label>
                                </div>
                            </div>
                            <button onClick={this.checkBoxValue} type="submit" className="ui button youtube-btn">Upload</button>
                        </div>
                    </form>}
                </section>
            </div>
        )
    }
}
YoutubeUpload.defaultProps = {
    checkBoxDefault: true
}


export { YoutubeUpload }