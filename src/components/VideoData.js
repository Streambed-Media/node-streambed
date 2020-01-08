import React from 'react';
class VideoData extends React.Component {
    state = {
        data: ''
    }

    componentDidMount(){
        fetch('http://localhost:5000/analytics')
        .then((response) => {
                response.json().then((result)=> {
                    console.log(result.data)
                    console.log(Object.keys(result.data))
                    Object.keys(result.data).map((key, i) => {
                        console.log('index:',i)
                        if(i === 3) {
                            console.log(result.data[key].thumbnails.medium.url)
                        }
                        
                    })
                this.setState(() => {
                    return {
                        data: result.data
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
            <div>
                <section className="youtube-data">
                    <h1 className="component-title">Youtube Data</h1>
                    {Object.keys(this.state.data).map((key, i) => {
                            return (
                                <React.Fragment key={i}>
                                    {i === 3 && 
                                        <div className="profile-title-container">
                                            <div>
                                                <h4>Youtube Title: {this.state.data[key].title}</h4>
                                                <h4>Youtube Publish Date: {this.state.data[key].publishedAt}</h4>
                                            </div>
                                            <div className="profile-img-wrap">
                                                <img className="profileImg" src={this.state.data[key].thumbnails.medium.url} alt="profile image" />
                                                {/* <p>{this.state.data[key].thumbnails.medium.url}</p> */}
                                            </div>
                                        </div>
                                    }
                                </React.Fragment>
                            )
                        
                    })}
                </section>
            </div>
        )
    }

}

export default VideoData