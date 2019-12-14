import React from 'react';
import Carousel from 'react-multi-carousel';
// import 'react-multi-carousel/lib/styles.css';
import RenderSingleVidAnalytics from './TopSection/OriginalsSection/RenderSingleVidAnalytics';
// import '../styles/AnalyticsandContent/renderContent.css';
import Filters from './TopSection/FilterComponents/Filters';
import ButterflyScore from './TopSection/ButterflyScore/ButterflyScore';
import TopInfluencers from './BottomSection/TopInfluencers';
import Derivative from './BottomSection/Derivative';
import { web } from '../../oauth2.keys.json';
/****************************************Component to render the videos from v3 */

//This is required by carousel npm package, set items to show on certain screen sizes
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4 // When you click arrow, it will scroll as many as this is set too
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1
  }
};

class RenderContent extends React.Component {
  constructor(props){
    super(props)
    this.state = { videoData: false, selectedVideoId: null };
  }
  

  componentDidMount() {

    let url = window.location.href
    const accessToken = url.replace(/^.+=/ig, "");  
    console.log(accessToken)

      fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true&maxResults=25&type=video&key={${web.apiKey}}`,{
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        }

    }).then(response => response.json()).then(data => {
        
        // this.setState( () => {
        //     return{
        //         items: data.items
        //     }
        // })
        console.log('this statee: ',this.state)
        console.log(data)
    })
  }

  /**function to fetch videos */
  getAllVideos() {
    return window.gapi.client.youtube.search.list({
      part: 'snippet',
      forMine: true,
      maxResults: 25,
      type: 'video'
    });
  }

  /**On click function to pull video id from video */
  getSingleVideoId(index) {
    this.setState({
      selectedVideoId: this.state.videoData[index].id.videoId
    });
  }

  getSingleVidAnalytics() {
    /*************************************Get todays date */
    let dateObj = new Date();
    let month = String(dateObj.getMonth() + 1).padStart(2, '0');
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let output = year + '-' + month + '-' + day;
    /**************************************************** */

    return window.gapi.client.youtubeAnalytics.reports
      .query({
        dimensions: 'day,insightTrafficSourceType',
        endDate: output,
        filters: `video==${this.props.selectedVideoId}`,
        ids: 'channel==Mine',
        metrics: 'views,estimatedMinutesWatched',
        sort: 'day,-views',
        startDate: '2005-02-14' //This is youtube founded date
      })
      .then(
        (response) => {
          let totalViews = response.result.rows
            .map((row) => row[2])
            .reduce((a, b) => a + b);

          let totalestimatedMinutesWatched = response.result.rows
            .map((row) => row[3])
            .reduce((a, b) => a + b);

          this.setState({
            singleVideoAnalytics: {
              day: response.result.rows.length,
              insightTrafficSourceType: null,
              views: totalViews,
              estimatedMinutesWatched: totalestimatedMinutesWatched
            }
          });
        },

        function(err) {
          console.error('Execute error', err);
        }
      );
  }

  carousel() {
    return (
      <Carousel
        arrows
        className='carousel-component'
        focusOnSelect={false}
        infinite={false}
        showDots={false}
        sliderClass=''
        swipeable
        responsive={responsive}
      >
        {this.state.videoData.map((content, i) => {
          return (
            <div key={content.id}>
              <img
                className='ui middle aligned image thumbnail'
                src={content.snippet.thumbnails.default.url}
                alt={content.id}
                key={content.id.videoId}
                onClick={() => this.getSingleVideoId(i)}
                style={{ cursor: 'pointer' }}
              ></img>
              <br />
              <a
                href={`https://www.youtube.com/watch?v=${content.id.videoId}`}
                rel='noopener noreferrer'
                target='_blank'
                key={`https://www.youtube.com/watch?v=${content.id.videoId}`}
              >
                <i className='youtube icon' />
              </a>
            </div>
          );
        })}
      </Carousel>
    );
  }

  /**************************************************************************************************************/
  //Conditional to show All Videos button, when clicked state is update to videoIds
  //Currently loops through videos and displays thumbnail and produces link to the video on youtube
  //Added Carousel with npm package
  //Also passing down selectedVideoId to RenderSingleAnalytics
  /**************************************************************************************************************/
  render() {
    return (
      <div className='renderContent-wrapper'>
        <ButterflyScore />
        <div className='carousel-box'>
          <h2>Content</h2>

          <div className='video-carousel'>
            {this.state.videoData ? (
              this.carousel()
            ) : (
              <div className='ui active centered inline loader' />
            )}
          </div>
        </div>
        <Filters />
        <RenderSingleVidAnalytics
          selectedVideoId={this.state.selectedVideoId}
        />
        <div className='der--influ-container'>
          <Derivative />
          <TopInfluencers />
        </div>
      </div>
    );
  }
}

export default RenderContent;
