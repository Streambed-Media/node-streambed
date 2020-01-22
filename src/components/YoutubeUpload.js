import React, { PropTypes } from 'react';


class YoutubeUpload extends React.Component {
    state = {
        results: null,
        checkbox: {},
        checkBoxErr: false,
    }

    

    getYouTubeData = () => {
        const checkbox = this.state['checkbox']

        fetch('http://localhost:5000/upload-youtube', {
            method: 'POST',
            body: JSON.stringify(checkbox),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then((data) => {
            this.setState({results: data})
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