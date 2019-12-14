import React from 'react';

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;

/*************************************Component that handles analytic data from youtube analytics */
//! Currently not being used, leaving it out till we know where it should go

class RenderAnalytics extends React.Component {
  state = {
    startDate: null,
    endDate: today
  };

  handleSubmit = (e) => {
    e.preventDefault();
  };

  handleStartDateChange = (e) => {
    this.setState({
      startDate: e.target.value
    });
  };

  handleEndDateChange = (e) => {
    this.setState({
      endDate: e.target.value
    });
  };

  handleExecute(e) {
    e.preventDefault();

    return window.gapi.client.youtubeAnalytics.reports
      .query({
        endDate: `${this.state.endDate}`,
        ids: 'channel==MINE',
        metrics:
          'views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,likes,shares',
        startDate: `${this.state.startDate}`
      })
      .then((response) => {
        response.result.columnHeaders.forEach((header) =>
          this.setState({ [header.name]: null })
        );

        let totalViews = response.result.rows[0][0];
        let totalestimatedMinutesWatched = response.result.rows[0][1];
        let totalaverageViewDuration = response.result.rows[0][2];
        let totalaverageViewPercentage = response.result.rows[0][3];
        let totalsubscribersGained = response.result.rows[0][4];
        let totallikes = response.result.rows[0][5];
        let totalshares = response.result.rows[0][6];

        this.setState({
          views: totalViews,
          estimatedMinutesWatched: totalestimatedMinutesWatched + ' min',
          averageViewDuration: totalaverageViewDuration + ' seconds',
          averageViewPercentage: totalaverageViewPercentage + '%',
          subscribersGained: totalsubscribersGained,
          likes: totallikes,
          shares: totalshares
        });
      })
      .catch((err) => console.log(err));
  }

  renderExecuteButton() {
    let {
      views,
      estimatedMinutesWatched,
      averageViewDuration,
      averageViewPercentage,
      subscribersGained,
      likes,
      shares
    } = this.state;

    return (
      <>
        <button
          className='ui button primary executeButton '
          style={{ marginLeft: '15px' }}
        >
          Execute
        </button>
        {views != null ? (
          <div style={{ margin: '10px' }}>
            <p>Views: {views} </p>
            <p>Total estimated mintues watched: {estimatedMinutesWatched}</p>
            <p>Avg. view duration: {averageViewDuration}</p>
            <p>Avg. view percentage: {averageViewPercentage}</p>
            <p>Subscribers gained: {subscribersGained}</p>
            <p>Likes: {likes}</p>
            <p>Shares: {shares}</p>
          </div>
        ) : null}
      </>
    );
  }

  render() {
    return (
      <>
        <div className='analytics--container'>
          <div className='total--view--data'>
            <h2>Total view counts & estimated watch time</h2>
            <div className='the--data'>
              <br />
              <form onSubmit={(e) => this.handleExecute(e)}>
                Enter a start date:
                <input
                  onChange={this.handleStartDateChange}
                  type='date'
                  name='startDate'
                  min='2005-02-14'
                  max={today}
                  defaultValue={this.state.startDate}
                  required
                />
                <br />
                Enter a end date:
                <input
                  onChange={this.handleEndDateChange}
                  type='date'
                  name='endDate'
                  min='2005-02-14'
                  max={today}
                  defaultValue={this.state.endDate}
                />
                <br />
                {this.renderExecuteButton()}
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default RenderAnalytics;
