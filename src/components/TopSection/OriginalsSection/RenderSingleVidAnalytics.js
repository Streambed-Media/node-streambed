import React from 'react';
import Scoring from './Scoring';
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
    noData: null,
    allData: null,
    onDefault: true
  };

  /* allData Key
0: {name: "views", columnType: "METRIC", dataType: "INTEGER"}
1: {name: "comments", columnType: "METRIC", dataType: "INTEGER"}
2: {name: "likes", columnType: "METRIC", dataType: "INTEGER"}
3: {name: "dislikes", columnType: "METRIC", dataType: "INTEGER"}
4: {name: "estimatedMinutesWatched", columnType: "METRIC", dataType: "INTEGER"}
5: {name: "averageViewDuration", columnType: "METRIC", dataType: "INTEGER"}
 */

  componentDidMount() {
    google.charts.load('current', { packages: ['corechart'] });
  }
  componentDidUpdate(prevProps) {
    if (google.charts && this.state.onDefault) {
      google.charts.setOnLoadCallback(this.drawChartTotal);
    }
    if (google.charts && !this.state.onDefault) {
      google.charts.setOnLoadCallback(this.drawChartSingle);
    }

    if (!this.state.allData) {
      this.getTotalVidAnaylytics();
    }
    if (this.props.selectedVideoId !== prevProps.selectedVideoId) {
      this.getSingleVidAnalytics();
      this.getSearchTerms();
    }
  }

  getTotalVidAnaylytics() {
    runTheContent((accessToken) => {
      fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?endDate=${todaysDate}&ids=channel%3D%3DMINE&metrics=views%2Ccomments%2Clikes%2Cdislikes%2CestimatedMinutesWatched%2CaverageViewDuration&startDate=2005-02-14&key=${web.apiKey}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: 'Bearer ' + accessToken
          }
        }
      )
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            allData: response.rows[0]
          });
        });
      // .then(() => {
      //   google.charts.setOnLoadCallback(this.drawChartTotal);
      // });
    });
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
          (response) => {
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
                videoData: null,
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
              noData: null,
              onDefault: false
            });
          },

          function(err) {
            console.error('Execute error', err);
          }
        );
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

  drawChartTotal = () => {
    // Create the data table.
    if (!this.state.allData) {
      return;
    }

    const data = new google.visualization.DataTable();

    data.addColumn('string', 'String');
    data.addColumn('number', 'Total');

    data.addRows([
      ['Views', this.state.allData[0]],
      ['Comment', this.state.allData[1]],
      ['Likes', this.state.allData[2]],
      ['Dislikes', this.state.allData[3]],
      ['Est min', this.state.allData[4]]
    ]);

    const options = {
      title: 'Account analytics',
      backgroundColor: 'transparent',
      width: 'auto',
      legend: {
        position: 'none'
      }
    };

    // Instantiate and draw our chart, passing in some options.
    const chart = new google.visualization.ColumnChart(
      document.getElementById('chart_All')
    );
    chart.draw(data, options);
  };

  drawChartSingle = () => {
    // Create the data table.

    const data = new google.visualization.DataTable();

    data.addColumn('string', 'Date');
    data.addColumn('number', 'Views');

    this.state.videoData.map((record) =>
      data.addRows([[record[0], record[1]]])
    );

    const options = {
      title: `Views per day for ${this.props.selectedVideoTitle}`,
      backgroundColor: 'transparent',
      width: 'auto',
      legend: {
        position: 'none'
      }
    };

    // Instantiate and draw our chart, passing in some options.
    const chart = new google.visualization.ColumnChart(
      document.getElementById('chart_Single')
    );
    chart.draw(data, options);
  };

  renderAllData() {
    let { allData } = this.state;
    return (
      <div>
        <h2>Total</h2>
        <p>Views: {allData ? allData[0] : null} </p>
        <p>Comments: {allData ? allData[1] : null} </p>
        <p>Likes: {allData ? allData[2] : null} </p>
        <p>Dislikes: {allData ? allData[3] : null} </p>
        <p>Estimated min watched: {allData ? allData[4] : null} </p>
      </div>
    );
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
        <div>
          <div className='traffic'>
            <h2>Traffic</h2>
            <p>Views: {views} </p>
            <p>Comments: {comments}</p>
            <p>Likes: {likes}</p>
            <p>Dislikes: {dislikes} </p>
            <p>Estimated min watched: {estimatedMinutesWatched}</p>
            <p>Key search term: {this.state.keyWord}</p>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    let { noData, allData, onDefault, videoData } = this.state;

    return (
      <div className='basic-analytics-container'>
        <h2>Originals</h2>
        <div className='basic-analytics' style={{ position: 'relative' }}>
          {!onDefault && (
            <div
              style={{
                position: 'absolute',
                zIndex: 100,
                cursor: 'pointer'
              }}
            >
              <i
                onClick={() => {
                  this.setState({
                    onDefault: !this.setState.onDefault
                  });
                  this.setState({ noData: null });
                  this.setState({ singleVideoAnalytics: null });
                }}
                className='fas fa-caret-square-left fa-lg'
              ></i>
            </div>
          )}

          {noData ? (
            <div
              style={{
                textAlign: 'center',
                color: 'red',
                fontFamily: 'Lato,Helvetica Neue,Arial,Helvetica,sans-serif'
              }}
            >
              {noData}
            </div>
          ) : onDefault ? (
            <div id='chart_All'></div>
          ) : (
            <div id='chart_Single'></div>
          )}

          {onDefault ? this.renderAllData() : this.renderSingleVidAnalytics()}
          <Scoring />
        </div>
      </div>
    );
  }
}

export default RenderSingleVidAnalytics;
