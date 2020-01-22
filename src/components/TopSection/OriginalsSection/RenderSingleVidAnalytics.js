import React from 'react';
import Scoring from './Scoring';
// import Graph from './Graph';
import { web } from '../../../../oauthTwo.keys.json';
import runTheContent from '../../../helpers/GetToken';
/*************************************Get todays date */
let dateObj = new Date();
let month = String(dateObj.getMonth() + 1).padStart(2, '0');
let day = String(dateObj.getDate()).padStart(2, '0');
let year = dateObj.getFullYear();
let todaysDate = year + '-' + month + '-' + day;

/**************************************************** */

/**************************************************************************************/
/************************* Component to get single videos analytics********************/
/**************************************************************************************/
class RenderSingleVidAnalytics extends React.Component {
  state = {
    singleVideoAnalytics: {},
    videoData: null,
    noData: null
  };

  componentDidMount() {
    google.charts.load('current', { packages: ['corechart'] });
  }
  componentDidUpdate(prevProps) {
    if (this.props.selectedVideoId !== prevProps.selectedVideoId) {
      this.getSingleVidAnalytics();
      this.getSearchTerms();
    }
  }

  /**Functions to get views and watch time for specific video, wrapped in Brads helper function to get accessToken**/
  getSingleVidAnalytics() {
    runTheContent((accessToken) => {
      fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&endDate=${todaysDate}&filters=video%3D%3D${this.props.selectedVideoId}&ids=channel%3D%3DMINE&metrics=views%2Ccomments%2Clikes%2Cdislikes%2CestimatedMinutesWatched%2CaverageViewDuration&startDate=2005-02-14&key=${web.apiKey}`,

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

          response => {
            if (!response.rows[0]) {
              return this.setState({
                singleVideoAnalytics: {
                  day: null,
                  insightTrafficSourceType: null,
                  views: null,
                  comments: null,
                  likes: null,
                  dislikes: null,
                  estimatedMinutesWatched: null
                },
                videoData: response.rows,
                noData: 'No data yet, come back later'
              });
            }


            let totalViews = response.rows
              .map((row) => row[1])
              .reduce((a, b) => a + b);

            let totalestimatedMinutesWatched = response.rows
              .map((row) => row[5])
              .reduce((a, b) => a + b);

            let totalComments = response.rows
              .map((row) => row[2])
              .reduce((a, b) => a + b);

            let totalLikes = response.rows
              .map((row) => row[3])
              .reduce((a, b) => a + b);

            let totalDislikes = response.rows
              .map((row) => row[4])
              .reduce((a, b) => a + b);

            this.setState({
              singleVideoAnalytics: {
                day: response.rows.length,
                insightTrafficSourceType: null,
                views: totalViews,
                comments: totalComments,
                likes: totalLikes,
                dislikes: totalDislikes,
                estimatedMinutesWatched: totalestimatedMinutesWatched + ' min'
              },
              videoData: response.rows,
              noData: null
            });
          },

          function(err) {
            console.error('Execute error', err);
          }
        )
        .then(() => {
          google.charts.setOnLoadCallback(this.drawChart);
        });
    });
  }

  /**function to get best keyword for your specific videos**/
  getSearchTerms() {
    runTheContent((accessToken) => {
      fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=insightTrafficSourceDetail&endDate=${todaysDate}&filters=video%3D%3D${this.props.selectedVideoId}%3BinsightTrafficSourceType%3D%3DYT_SEARCH&ids=channel%3D%3DMINE&maxResults=10&metrics=views&sort=-views&startDate=2005-07-01&key=${web.apiKey}`,
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
            }
          },
          function(err) {
            console.error('Execute error', err);
          }
        );
    });
  }

  renderSingleVidAnalytics() {
    let {
      views,
      comments,
      likes,
      dislikes,
      estimatedMinutesWatched
    } = this.state.singleVideoAnalytics;

    if (this.state.singleVideoAnalytics) {
      return (
        <div className='traffic'>
          <h2>Traffic</h2>
          <p>Views: {views} </p>
          <p>Comment: {comments}</p>
          <p>Likes: {likes}</p>
          <p>Dislikes: {dislikes} </p>
          <p>Estimated min watched: {estimatedMinutesWatched}</p>
          <p>Key search term: {this.state.keyWord}</p>
        </div>
      );
    } else {
      return null;
    }
  }

  drawChart = () => {
    // Create the data table.
    const data = new google.visualization.DataTable();

    data.addColumn('string', 'Date');
    data.addColumn('number', 'Views');

    this.state.videoData.map((record) =>
      data.addRows([[record[0], record[1]]])
    );

    const options = {
      title: 'Views per day',
      backgroundColor: 'transparent',
      chartArea: { left: 0, top: 0, width: '100%', height: '100%' },
      animation: {
        duration: 1000,
        easing: 'out',
        startup: true
      },
      bars: 'vertical'
    };

    // Instantiate and draw our chart, passing in some options.
    const chart = new google.visualization.ColumnChart(
      document.getElementById('chart_div')
    );
    chart.draw(data, options);
  };

  render() {
    return (
      <div className='basic-analytics-container'>
        <h2>Originals</h2>
        {this.state.noData ? (
          <div
            style={{
              textAlign: 'center',
              color: 'red',
              fontFamily: 'san-serif'
            }}>
            {this.state.noData}
          </div>
        ) : null}
        <div className='basic-analytics'>
          {/* <Graph videoData={this.props.videoData} /> */}
          {this.state.videoData ? (
            <div id='chart_div'></div>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              Click on a video to render some cool data
            </div>
          )}
          {this.renderSingleVidAnalytics()}
          <Scoring />
        </div>
      </div>
    );
  }
}

export default RenderSingleVidAnalytics;
