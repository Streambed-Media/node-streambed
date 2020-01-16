import React, { PropTypes } from 'react';


class YoutubeUpload extends React.Component {
    state = {
        results: null,
        checkbox: {},
        checkBoxErr: false,
        checkBoxDefault: true
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
              console.log(data)
            this.setState(() => {
                return {
                    results: data
                }
            })
          }).catch((err) => {
              console.log(err)
          });
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
                            let j = i
                            if ( key === 'err' ) {
                                return (
                                    <div key={i} className="youtube-error">
                                        <h4 key={i}>{ youtube_data[key] }</h4>
                                    </div>
                                )
                            } else {
                                let snippet = youtube_data.snippet;
                                let status = youtube_data.status;
                                return (
                                    <React.Fragment key={wrapper}>
                                        {key === 'snippet' &&
                                            <div key={i} className="youtube-snippet">  
                                                <p key={i} className="publishedAt">Published At: { snippet.publishedAt }</p>
                                                <p key={i} className="channel-title">Channel Title: {snippet.channelTitle}</p>
                                                <p key={i} className="channelId">Channel Id: {snippet.channelId }</p>
                                            </div>
                                        }
                                        {key === 'status' &&
                                            <div key={j++} className="youtube-status">
                                                <p key={j++} className="upload-status">Upload Status: { status.uploadStatus}</p>
                                                <p key={j++} className="privacy">Privacy: { status.privacyStatus}</p>
                                                <p key={j++} className="embeddable">Embedable for other sites: { status.embeddable ? <span>True</span>: <span>false</span>}</p>
                                                <p key={j++} className="public-stats">Public stats viewable: { status.publicStatsViewable ? <span>True</span>: <span>false</span>}</p>
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
                                {this.state.checkBoxErr && <p className="checkboxErr">{this.state.checkBoxErr}</p>}
                                
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