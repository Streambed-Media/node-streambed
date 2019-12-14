import React from 'react';
import Scoring from './Scoring';
import Graph from './Graph';

/*************************************Get todays date */
let dateObj = new Date();
let month = String(dateObj.getMonth() + 1).padStart(2, '0');
let day = String(dateObj.getDate()).padStart(2, '0');
let year = dateObj.getFullYear();
let output = year + '-' + month + '-' + day;
/**************************************************** */

/**************************************************************************************/
/************************* Component to get single videos analytics********************/
/**************************************************************************************/
/**************************************************************************************/
class RenderSingleVidAnalytics extends React.Component {
  state = {
    singleVideoAnalytics: {}
  };

  componentDidUpdate(prevProps) {
    if (this.props.selectedVideoId !== prevProps.selectedVideoId) {
      this.getSingleVidAnalytics();
      this.getSearchTerms();
    }
  }

  getSingleVidAnalytics() {
    return window.gapi.client.youtubeAnalytics.reports
      .query({
        dimensions: 'day,insightTrafficSourceType',
        endDate: output,
        filters: `video==${this.props.selectedVideoId}`,
        ids: 'channel==MINE',
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
              estimatedMinutesWatched: totalestimatedMinutesWatched + ' min'
            }
          });
        },

        function(err) {
          console.error('Execute error', err);
        }
      );
  }

  getSearchTerms() {
    return window.gapi.client.youtubeAnalytics.reports
      .query({
        dimensions: 'insightTrafficSourceDetail',
        endDate: output,
        filters: `video==${this.props.selectedVideoId};insightTrafficSourceType==YT_SEARCH`,
        ids: 'channel==MINE',
        maxResults: 20,
        metrics: 'views',
        sort: '-views',
        startDate: '2005-02-14' //This is youtube founded date
      })
      .then(
        (response) => {
          if (!response.result.rows[0]) {
            this.setState({
              keyWord: 'N/A'
            });
          } else {
            this.setState({
              keyWord: response.result.rows[0][0]
            });
          }
        },
        function(err) {
          console.error('Execute error', err);
        }
      );
  }

  renderSingleVidAnalytics() {
    let {
      //day,
      //insightTrafficSourceType,
      views,
      estimatedMinutesWatched
    } = this.state.singleVideoAnalytics;

    if (this.state.singleVideoAnalytics) {
      return (
        <div>
          <h2>Traffic</h2>
          <p>Views: {views} </p>
          <p>Estimated min watched: {estimatedMinutesWatched}</p>
          <p>Key search term: {this.state.keyWord}</p>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className='basic-analytics-container'>
        <h2>Originals</h2>
        <div className='basic-analytics'>
          <Graph />
          {this.renderSingleVidAnalytics()}
          <Scoring />
        </div>
        {/* <h2>Top search terms for a video</h2> */}
        {/* <div className='basic-analytics'>{this.renderTopSeachTerm()}</div> */}
      </div>
    );
  }
}

export default RenderSingleVidAnalytics;
