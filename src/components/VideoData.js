import React from 'react';
class VideoData extends React.Component {
    state = {
        videos: ''
    }

    componentDidMount(){
        fetch('http://localhost:5000/uploaded')
        .then((response) => {
                response.json().then((result)=> {
                    console.log(result)
                this.setState(() => {
                    return {
            
                        videos: result[0].videoFileName,
         
                    }
                })
            })
        })
        .catch(
            error => console.error // Handle the error response object
        )
      
    }

    render () {
        return (
            
        
            <div className="container-upload">
                <div>{this.state.videos}</div>
                <section className="youtube-data">
                    <div>Youtube data</div>
                </section>
            </div>
        )
    }

}

export default VideoData