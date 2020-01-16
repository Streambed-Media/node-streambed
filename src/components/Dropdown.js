import React, { useState, useEffect } from 'react';
import { VideoUpload } from './VideoUpload';
import { Results } from './Results';
import VideoData from './VideoData';
import GetVideos from './GetVideos';


const CreateDropdown = (props) => {
    const [value, setValue] = useState({optionVal: '', onLoad: true});

    const updateFormHeight = () =>{
        let form = document.getElementById('form')
        if (form === null) return;
        form.style.height = '298px' 
    }
    // Props for Results page after uploaded to youtube
  
    
    const getDropDownVal = (e) => {
        let target = document.getElementsByClassName('ui search dropdown')[0];
        let optionVal = target.value;
        let selectedText = target.options[target.selectedIndex].text;

        // If Upload button was hit to upload video file to youtube
        if(props.getUrl === '/upload-youtube' && value.onLoad) {

            setValue({optionVal: 'results', onLoad: false})
          
        }else {
            setValue({optionVal: optionVal})

            if (!optionVal || optionVal === 'upload') updateFormHeight()
        }
        return {optionVal, selectedText }
    }
    
    useEffect(() => {
        getDropDownVal()
    },[])
   
    return (  
        <div className="publisher">
            <div className="ui form wrapper">
                <div className="field">
                    <label>Video Options</label>
                    <select className="ui search dropdown" onChange={getDropDownVal}>
                    <option defaultValue value="">Choose...</option>
                    <option value="upload">Upload Video</option>
                    <option value="data">Video Data</option>
                    <option value="videos">Get Videos</option>
                    </select>
                </div>
            </div>
            {console.log(value.optionVal)}
            {value.optionVal === 'results' && <Results /> }
            {value.optionVal === 'data' && <VideoData /> }
            {value.optionVal === 'videos' && <GetVideos /> }
            {value.optionVal === 'upload' || !value.optionVal ? <VideoUpload /> : null}
        </div>
  );
};

export default CreateDropdown;
