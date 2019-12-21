import React from 'react';


class UploadYoutube extends React.Component {

    state = {
        results: null
    }

    getYouTubeData = (e) => {
        console.log(e)
        // e.preventDefault()

    }


    render(){
        return (
            <div>
                <section className="upload-youtube">
                    <form action="/upload-youtube" method="POST" encType="multipart/form-data">
                        <div className="form-group">
                            <label htmlFor="myFile">Upload to Youtube</label>
                        </div>
                        <button onClick={this.getYouTubeData} type="submit" className="ui button">Upload</button>
                    </form>
                </section>
            </div>
        )
    }
}

export { UploadYoutube }