import React from 'react';
import { UploadYoutube } from './YoutubeUpload'


class Results extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isUploaded: false,
            results: [],
        }
    }

    componentDidMount(){
        fetch('http://localhost:5000/uploaded')
        .then((response) => {
                response.json().then((result)=> {
                    console.log(result)
                this.setState(() => {
                    return {
                        isUploaded: true,
                        results: result,
                        videoName: result[0].videoFileName,
                        imgName: result[0].imgFileName
                    }
                })
            })
        })
        .catch(
            error => console.error // Handle the error response object
        )
      
    }

    render(){
        console.log(this.state.results, this.state)

        return (

            <div className="content-container">
                {this.state.results.map((results, i) => 
                {
                    return <p key={i}>{results.title} {results.desc}</p>
                })}
                <img key={this.state.imgName} width="200px" src={"uploads/"+this.state.imgName} alt="thumbnail" />
                <VideoElem videoName={"uploads/"+this.state.videoName}/>
                <UploadYoutube />
                {console.log(this.state)}
            </div>
        )
    }
}

const VideoElem = (props) => {
    return (
        <div>
            <video key={props.videoName} className="video-element" controls>
                <source src={props.videoName} type="video/mp4" />
            </video>
        </div>
    )
}


export { Results }