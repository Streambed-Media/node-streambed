import React from 'react';
import Scoring from './Scoring';
import Graph from './Graph';
import { web } from '../../../../oauthTwo.keys.json';
import runTheContent from '../../../helpers/GetToken';
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
  /**Functions to get views and watch time for specific video**/
  getSingleVidAnalytics() {
    runTheContent(( accessToken ) => {
      console.log('tommys request',accessToken, output, this.props.selectedVideoId)
      fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day%2CinsightTrafficSourceType&endDate=${output}&filters=video==${this.props.selectedVideoId}&ids=channel%3D%3DMINE&metrics=views%2CestimatedMinutesWatched&sort=day%2C-views&startDate=2005-02-14&key=${web.apiKey}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: 'Bearer ' + accessToken
          }
        }
      )
        .then((response) => response.json())
        .then(
          (response) => {
            console.log('Get single vid', response);
            let totalViews = response.rows
              .map((row) => row[2])
              .reduce((a, b) => a + b);
  
            let totalestimatedMinutesWatched = response.rows
              .map((row) => row[3])
              .reduce((a, b) => a + b);
  
            this.setState({
              singleVideoAnalytics: {
                day: response.rows.length,
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
    })
  }

  /**function to get best keyword for your specific videos**/
  getSearchTerms() {
    let url = window.location.href;
    const accessToken = url.replace(/^.+=/gi, '');

    fetch(
      `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=insightTrafficSourceDetail&endDate=${output}&filters=video%3D%3D${this.props.selectedVideoId}%3BinsightTrafficSourceType%3D%3DYT_SEARCH&ids=channel%3D%3DMINE&maxResults=10&metrics=views&sort=-views&startDate=2005-07-01&key=${web.apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + accessToken
        }
      }
    )
      .then((response) => response.json())
      .then(
        (response) => {
          if (!response.rows[0]) {
            this.setState({
              keyWord: 'N/A'
            });
          } else {
            this.setState({
              keyWord: response.rows[0][0]
            });
            console.log('WORKING');
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
