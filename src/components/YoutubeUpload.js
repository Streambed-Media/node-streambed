import React from 'react';


class YoutubeUpload extends React.Component {
    state = {
        results: null,
        checkbox: {},
  
    }


    getYouTubeData = (e) => {
        const checkbox = this.state['checkbox']

        console.log(checkbox)
        // e.preventDefault()
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

    checkBoxValue = (e) => {
        e.preventDefault()

        const checked = document.querySelectorAll('input[name="uploadChecked"]')
        let val = {}
        for (let check of checked) {
            console.log(check.checked)
            if ( check.checked ) {
                val[check.value] = check.value
                console.log(check.value)
            } else {
                
            }
        }
        
        console.log(val)
        this.setState(()=>{
            return {
                checkbox: val
            }
        },this.getYouTubeData)
    }


    render(){
        console.log(this.state.checkbox)
        return (
            <div>
                <section className="upload-youtube">
                    {console.log(this.state.results)}
                    
                    {this.state.results ? 
                        
                        Object.keys(this.state.results).map((key, i) => {
                            return (
                                <h3 key={i}>Video Uploaded!</h3>
                            )
                            // console.log(youtube[key])
                            // return youtube[key]
                        })
                    :
                    
                    <form action="/upload-youtube" method="POST" encType="multipart/form-data">
                        
                        <div className="upload-container">
                        
                        <div className="checkbox-container">
                            {this.state.checkBoxErr && <div>{this.state.checkBoxErr}</div>}
                            <div className="form-group">
                                <label className="upload-type" htmlFor="myFile">Upload location</label>
                            </div>
                            <div className="checkbox-upload">
                                
                                <input type="checkbox" id="youtube" name="uploadChecked" value="youtube" defaultChecked={true}/>
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

export { YoutubeUpload }