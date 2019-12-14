import React from 'react';


class UploadYoutube extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            results: null
        }
    }

    render(){
        return (
            <div>
                <section className="upload-youtube">
                    <form action="/upload-youtube" method="POST" encType="multipart/form-data">
                        <div className="form-group">
                            <label htmlFor="myFile">Upload to Youtube</label>
                        </div>
                        <button type="submit" className="btn btn-primary">Upload</button>
                    </form>
                </section>
            </div>
        )
    }
}

export { UploadYoutube }