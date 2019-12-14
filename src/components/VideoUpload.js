import React from 'react';
import { Results } from './Results.js'


class Upload extends React.Component {
    constructor(props){
        super(props);
        this.checkForBlankFields = this.checkForBlankFields.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.viewProgress = this.viewProgress.bind(this)
        this.state = {
            results: null,
            fieldCount: 0,
            errorText: '',
            isUploaded: false
        }
    }

    viewProgress(e) {
        let that = this;
  
        e.preventDefault()
        let formData = new FormData();
        let progressBar = document.querySelector('.progress-bar')
        let files = document.getElementsByClassName('myFiles')
 
        Array.prototype.forEach.call(files, function(index, i){
            if(i < 2) {
                formData.append('body',files[i].value);
                console.log(files[i].value)
            } else {
                formData.append('myFiles', files[i].files[0]);
                console.log(files[i].files[0])
            }
        })

        let xhr = new XMLHttpRequest();

        //Url upload
        xhr.open('post', '/uploaded', true);

        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                var percentage = (e.loaded / e.total) * 100;
                console.log(percentage + "%");

                progressBar.style.transform = `translate(${percentage}%, 0)`
                if(percentage === 100) {
                    that.setState(() => {
                        return {
                            isUploaded: true
                        }
                        
                    })
                }
            }
        };

        xhr.onerror = function(e) {
            console.log('Error');
            console.log(e);
        };
        xhr.onload = () => {
            // this.setState(() => {
            //     return {
            //         isUploaded: true
            //     }
                
            // })
            console.log(this.statusText);
        };

        xhr.send(formData);
    }

    componentDidMount () {
        fetch('http://localhost:5000/upload',{
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
               }    
        })
        .then((response) => {
                console.log(response.body);
            //     response.json().then((result)=> {
            //         console.log(result)
            //     // this.setState({
            //     //     results: result,
            //     //     videoName: result[0].videoFileName,
            //     //     imgName: result[0].imgFileName

            //     // })
            // })
        })
        .catch(
            error => console.log(error) // Handle the error response object
        )
       
    }


    handleChange(e) {
        const target = e.target.id

        switch (target) {
            case 'title' :
                this.setState((prevState) => prevState.fieldCount++)
                break;
            case 'description' :
                this.setState((prevState) => prevState.fieldCount++)
                break;
            case 'video' :   
                this.setState((prevState) => prevState.fieldCount++)
                break;
            case 'img' :
                this.setState((prevState) => prevState.fieldCount++)
                break;
        }
    }

    checkForBlankFields(e) {
        
        console.log(this.state.fieldCount)
        if( this.state.fieldCount !== 4 ) {
            e.preventDefault()
            // this.setState({errorText: 'Please fill out all fields before submiting'})
        }
        // this.viewProgress()
    }

    
    render(){
        return (
            <div>
                <section className="upload">
                    <form id="form" onSubmit={this.checkForBlankFields} style={{display: this.props}} action="/uploaded" method="POST" encType="multipart/form-data">
                        <div className="form-group">
                            <label htmlFor="title">Video Title</label>
                            <input type="text" className="form-control myFiles" id="title" name="title" aria-describedby="title" placeholder="Enter video title" onChange={(e)=>{this.handleChange(e)}}/>
                            <small id="title" className="form-text">Video title to be used for youtube</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="video">Video description</label>
                            <input type="text" className="form-control myFiles"  id="description" name="description" placeholder="Enter video description" onChange={(e)=>{this.handleChange(e)}}/>
                        </div>
                        <div className="form-group fileSelect">
                            <label htmlFor="myFile">Select video file: </label>
                            <input type="file" id="video" name="myFiles" className="myFiles" multiple onChange={(e)=>{this.handleChange(e)}}/>
                        </div>
                        <div className="form-group fileSelect">
                            <label htmlFor="myFile">Select thumbnail image: </label>
                            <input type="file" id="img" name="myFiles" className="myFiles" multiple onChange={(e)=>{this.handleChange(e)}}/>
                        </div>
                        <button onClick={this.viewProgress} type="submit" className="btn btn-primary">Upload</button>
                        {/* <button onClick={this.checkForBlankFields} type="submit" className="btn btn-primary">Upload</button> */}
                        <p className="errorField">{this.state.errorText}</p>
                    </form>
                    <div className="progress-container">
                        <span className="progress-bar"></span>
                    </div>
                   
                    {this.state.isUploaded && <Results />}
                </section>
            </div>
        )
    }
}

export { Upload }