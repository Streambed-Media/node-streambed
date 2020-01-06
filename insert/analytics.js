const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const client = require('../client');

// initialize the Youtube API library
const youtube = google.youtube({
    version: 'v3',
    auth: client.oAuth2Client,
});

async function runVideoAnalytics() {
    const res = await getVideoAnalytics(null)
    return res

}

async function getVideoAnalytics(etag) {
    const headers = {}
    if(etag) {
        headers['If-None-Match'] = etag
    }

    const res = await youtube.channels.list({
        part: 'snippet,contentDetails,statistics, status, contentDetails',
        mine: true,
        maxResults: 10
    });
    
    console.log('Status code: ' + res.status);
    const channel = res.data.items[0]
    console.log(res.data)
    
    // console.log(res.data.items)
    return channel;
}

module.exports = {
    runVideoAnalytics
}