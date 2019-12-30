import React, { useState, useEffect } from 'react';
import { Results } from './Results.js'
import 'font-awesome/css/font-awesome.min.css';


class Upload extends React.Component {
       state = {
            results: null,
            fieldCount: 0,
            errorText: '',
            isUploaded: false,
            percentage: '',
            height: ''
        }

    viewProgress = (e) => {
        let that = this;
  
        e.preventDefault()
        let formData = new FormData();
        let form = document.getElementById('form')
        let progressBar = document.querySelector('.progress-bar')
        let percent = document.getElementsByClassName('percent')[0]
        let files = document.getElementsByClassName('myFiles')
     
        form.style.height = '0px' 
        Array.prototype.forEach.call(files, function(index, i){

            if(i < 2) {
                formData.append('body',files[i].value);
   
            } else if (i === 2) {
                formData.append('myFiles', files[i].files[0]);
          
            }
        })

        let xhr = new XMLHttpRequest();

        //Url upload
        xhr.open('post', '/uploaded', true);

        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                const translate = (e.loaded / e.total) * 200;
                console.log(translate)
                const percentage = (e.loaded / e.total) * 100;
                percent.textContent += percentage +' %'
                progressBar.style.transform = `translate(${translate}px, 0)`
            }
        };

        xhr.onerror = function(e) {
            console.log('Error');
            console.log(e);
        };
        xhr.onload = () => {
            
            that.setState(() => {
                return {
                    isUploaded: true
                }
            })
        };

        xhr.send(formData);
    }

    handleChange = (e) => {
        const target = e.target.id
        console.log(target)
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
        }
    }

    checkForBlankFields(e) {
        
        console.log(this.state.fieldCount)
        if( this.state.fieldCount !== 3 ) {
            e.preventDefault()
            // this.setState({errorText: 'Please fill out all fields before submiting'})
        }
        // this.viewProgress()
    }
    componentDidMount() {
        this.setState({height: this.props.height})
    }
    
    render(){
        return (
            <div>
                <Form 
                    checkForBlankFields={this.checkForBlankFields}
                    handleChange={this.handleChange}
                    errorText={this.state.errorText}
                    viewProgress={this.viewProgress}
                    percentage={this.state.percentage}
                />
                {this.state.isUploaded && <Results isUploaded={this.state.isUploaded}/>}
            </div>
        )
    }
}

const Form = (props) => {
    return (
        <div>
            <section className="upload">
            <form className="ui form" id="form" onSubmit={props.checkForBlankFields}
            action="/uploaded" method="POST" encType="multipart/form-data">
                <div className="field">
                    <label htmlFor="title">Video Title</label>
                    <input type="text" className="myFiles" id="title" name="title" 
                    aria-describedby="title" placeholder="Enter video title" onChange={(e)=>{props.handleChange(e)}}/>
                </div>
                <div className="field">
                <label htmlFor="video">Video description</label>
                    <input type="text" className="myFiles"  id="description" 
                    name="description" placeholder="Enter video description" onChange={(e)=>{props.handleChange(e)}}/>
                </div>
                <div className="field">
                    <input type="file" id="video" name="myFiles" className="myFiles" multiple onChange={(e)=>{props.handleChange(e)}}/>
                    <label htmlFor="video" className="hiddenLabel"><i className="fas fa-upload"></i>Select Video: </label>
                    {/* <input type="file" id="img" name="myFiles" className="myFiles fileSelect" multiple onChange={(e)=>{this.handleChange(e)}}/> */}
                </div>
                <button onClick={props.viewProgress} type="submit" className="ui button">Upload</button>
                <p className="errorField">{props.errorText}</p>
                </form>
                <span className="percent">Progress: </span>
                <div className="progress-container">
                    <span className="progress-bar"></span>
                </div>
            </section>
        </div>
    )
}
export { Upload }