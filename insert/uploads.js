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
    try {

    
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
                    console.log(progress)
                    readline.clearLine(process.stdout, 0);
                    readline.cursorTo(process.stdout, 0, null);
                    process.stdout.write(`${Math.round(progress)}% complete`);
                },
            }
        );
        console.log('\n\n');
        console.log('from node ', res.data);

        return res.data;
}catch(err) {
    let errors = Object.keys(err)
    let errObj = {}

    errors.filter((key, i) => {
        
        if (key === 'errors') {
            errObj = err[key]
            console.log('Quota Exceeced for Youtube uploads: ', err[key])
        } 
        
    })

    return errObj[0]
}
    
    
}


module.exports = {
    runUpload,
    client: client.oAuth2Client,
};
