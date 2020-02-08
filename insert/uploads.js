'use strict';

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const client = require('../client');

// uploading a video to youtube
async function runUpload(videoInfo, userId) {
  console.log('This is in upload.js', userId);
  try {
    const filePath = videoInfo.videoFilePath;
    if (!filePath) throw new Error('Wrong file path.');

    const fileSize = fs.statSync(filePath).size;

    // initialize the Youtube API library
    const youtube = google.youtube({
      version: 'v3',
      auth: await client.get(userId)
    });
    const res = await youtube.videos.insert(
      {
        part: 'id,snippet,status',
        notifySubscribers: false,
        requestBody: {
          snippet: {
            title: videoInfo.title,
            description: videoInfo.desc
          },
          status: {
            privacyStatus: 'private'
          }
        },
        media: {
          body: fs.createReadStream(filePath)
        }
      },
      {
        // Use the `onUploadProgress` event from Axios to track the
        // number of bytes uploaded to this point.
        onUploadProgress: (evt) => {
          const progress = (evt.bytesRead / fileSize) * 100;
          if (Math.floor(progress) % 10 === 0) console.log(progress);
          // readline.clearLine(process.stdout, 0);
          // readline.cursorTo(process.stdout, 0, null);
          // process.stdout.write(`${Math.round(progress)}% complete`);
        }
      }
    );
    console.log('\n\n');
    console.log('from node ', res.data);

    return res.data;
  } catch (err) {
    console.log('\n\n');
    const error = new Error(err);
    console.log('uploads.js page: ', error.message);

    // Path wrong, Not O-authed, Too many uploads
    if (error) {
      return { err: error.message };
    } else return { err: err };
  }
}

module.exports = {
  runUpload
};
