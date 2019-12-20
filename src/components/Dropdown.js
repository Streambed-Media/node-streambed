import React, { useState, useEffect } from 'react';
import { Upload } from './VideoUpload';

const CreateDropdown = () => {
  const [value, setValue] = useState({ optionVal: '' });

  const updateFormHeight = () => {
    let form = document.getElementById('form');
    if (form === null) return;
    form.style.height = '270px';
  };

  const getDropDownVal = (e) => {
    let target = document.getElementsByClassName('ui search dropdown')[0];
    let optionVal = target.value;
    let selectedText = target.options[target.selectedIndex].text;
    setValue({ optionVal: optionVal });

    if (!optionVal || optionVal === 'upload') updateFormHeight();

    return { optionVal, selectedText };
  };

  useEffect(() => {
    let selected = getDropDownVal();
  }, []);

  return (
    <div>
      <div className='ui form wrapper'>
        <div className='field'>
          <label>Video Options</label>
          <select className='ui search dropdown' onChange={getDropDownVal}>
            <option defaultValue value=''>
              Choose...
            </option>
            <option value='upload'>Upload Video</option>
            <option value='data'>Video Data</option>
            <option value='videos'>Get Videos</option>
          </select>
        </div>
      </div>

      {!value.optionVal || value.optionVal === 'upload' ? <Upload /> : null}
    </div>
  );
};

export default CreateDropdown;
