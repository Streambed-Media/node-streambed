'use strict';

/**
 * Usage: node upload.js PATH_TO_VIDEO_FILE
 */

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const client = require('../client');

// initialize the Youtube API library
const youtube = google.youtube({
    version: 'v3',
    auth: client.oAuth2Client,
});

// very basic example of uploading a video to youtube
async function runUpload(videoInfo) {
    const filePath = videoInfo.videoFilePath

    const fileSize = fs.statSync( filePath ).size;
    const res = await youtube.videos.insert(
        {
            part: 'id,snippet,status',
            notifySubscribers: false,
            requestBody: {
                snippet: {
                    title: videoInfo.title,
                    description: videoInfo.desc ,
                },
                status: {
                    privacyStatus: 'public',
                },
            },
            media: {
                body: fs.createReadStream( filePath ),
            },
        },
        {
            // Use the `onUploadProgress` event from Axios to track the
            // number of bytes uploaded to this point.
            onUploadProgress: evt => {
                const progress = (evt.bytesRead / fileSize) * 100;
                readline.clearLine(process.stdout, 0);
                readline.cursorTo(process.stdout, 0, null);
                process.stdout.write(`${Math.round(progress)}% complete`);
            },
        }
    );
    console.log('\n\n');
    console.log(res.data);
    return res.data;
}


module.exports = {
    runUpload,
    client: client.oAuth2Client,
};
