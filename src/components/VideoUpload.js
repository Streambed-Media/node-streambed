import React, { useState, useEffect } from 'react';
import { Results } from './Results.js';

class VideoUpload extends React.Component {

    state = {
        results: null,
        fieldCount: 0,
        errorText: '',
        isUploaded: false,
        percentage: '',
        height: ''
    }

    // Either submits form or clears form fields
    formSubmit = (todo) => {
        let formData = new FormData();
        let files = document.getElementsByClassName('myFiles')
        Array.prototype.forEach.call(files, function(index, i){

            if(i < 2) {
                todo === 'clear' ? files[i].value = '' : formData.append( 'body',files[i].value ) 
   
            } else if (i === 2) {
                todo === 'clear' ? files[i].value = '' : formData.append( 'myFiles', files[i].files[0] )
          
            }
        })
        return formData
    }

    viewProgress = (e, clearFields) => {
        let that = this;
        
        e.preventDefault()
        let form = document.getElementById('form')
        let progressBar = document.querySelector('.progress-bar')
        let percent = document.getElementsByClassName('percent')[0]
        let formData = this.formSubmit()
        let xhr = new XMLHttpRequest();

        form.style.height = '0px';

        //Url upload
        xhr.open('post', '/uploaded', true);

        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                const translate = (e.loaded / e.total) * 200;
                console.log(translate)
                const percentage = (e.loaded / e.total) * 100;
                percent.textContent = percentage +' %'
                progressBar.style.transform = `translate(${translate}px, 0)`
            }
        };

        xhr.onerror = function(e) {
            console.log('Error: ', e);
        };
        xhr.onload = () => {
            
            that.setState(() => {
                return {
                    isUploaded: true
                }
            })
        };

        xhr.send(formData);

        //Clears form fields after submit
        this.clearFields()
    }

    handleChange = (e) => {
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
        }
    }

    changeSelection = () => {
        document.getElementsByClassName('ui search dropdown')[0].value = ''
    }
    
    clearFields = () => {
        this.formSubmit('clear')
        this.setState({isUploaded: false, percentage: '', fieldCount: 0})
        this.changeSelection()
    }
    
    checkForBlankFields = (e) => {
        if( this.state.fieldCount < 3 ) {
            e.preventDefault()
            return this.setState({errorText: 'Please fill out all fields before submiting'})
        }
        this.viewProgress(e)
    }

    componentDidMount() {
        this.setState({height: this.props.height})
    }

    
    render(){
        console.log(this.state)
        return (
            <div>
                <button onClick={this.changeSelect}>SElect</button>
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
                <h1 className="component-title">Video Upload</h1>
                <form className="ui form" id="form" action="/uploaded" method="POST" 
                encType="multipart/form-data">
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
                    </div>
                    <button onClick={props.checkForBlankFields} type="submit" className="ui button">Upload</button>
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
export { VideoUpload }