import React from 'react';


class UploadYoutube extends React.Component {
    state = {
        results: null
    }

    getYouTubeData = (e) => {
        e.preventDefault()
        fetch('http://localhost:5000/upload-youtube', {
            method: 'POST',
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


    render(){
        return (
            <div>
                <section className="upload-youtube">
                    {console.log(this.state.results)}
                    
                    {this.state.results ? 
                        
                        Object.keys(this.state.results).map((key, i) => {
                            return (
                            <h3>Video Uploaded!</h3>
                            )
                            // console.log(youtube[key])
                            // return youtube[key]
                        })
                    :
                    <form action="/upload-youtube" method="POST" encType="multipart/form-data">
                        <div className="form-group">
                            <label htmlFor="myFile">Upload to Youtube :</label>
                        </div>
                        <button onClick={this.getYouTubeData} type="submit" className="ui button">Upload</button>
                    </form>}
                </section>
            </div>
        )
    }
}

export { UploadYoutube }