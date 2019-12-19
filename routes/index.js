const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const youtubeUpload = require('../insert/uploads.js');
const analytics = require('../insert/analytics.js');
const jwt = require('jsonwebtoken');
const ipfs = require('../ipfs/addVideoIpfs');
const Thumbler = require('thumbler');
const ffmpeg = require('fluent-ffmpeg');
const getPercentage = require('../src/helpers/GetPercentage')

let videoInfo = {};

const scopes = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube'
];

// Set Storage of uploaded video or file on the server
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + path.extname(file.originalname));
  }
});

let upload = multer({
  storage: storage
});


router.get('/uploads/myFiles.mp4', (req, res)=>{
  const range = req.headers.range
  console.log('range',range)
  res.send(range)
})



router.post('/uploaded', upload.single('myFiles'), (req, res, next) => {
  console.log('req body: ', req.body.body);
  console.log('req files: ', req.file);
  const body = req.body.body;
  const file = req.file;
  videoInfo.title = body[0];
  videoInfo.desc = body[1];
  videoInfo.videoFilePath = './' + file.path;
  videoInfo.videoFileName = file.filename;
  videoInfo.imgFilePath = './public/uploads/thumb.jpg';
  videoInfo.imgFileName = 'thumb.jpg';

 
  getPercentage.fileDuration(videoInfo.videoFilePath, 25).then((seconds)=>{
    console.log('this',getPercentage.seconds)
  
    let time = ''

    let differenceInMinutes = seconds / 60
    
    if ( differenceInMinutes < 1 ) {
  
      time = getPercentage.seconds( differenceInMinutes )
  
    }else if ( differenceInMinutes >= 1 && differenceInMinutes < 60 ) {
  
      time = getPercentage.minutes( differenceInMinutes )
  
    } else if ( differenceInMinutes >= 60 ) {
  
      time = getPercentage.hours( differenceInMinutes )
  
    }
  
  console.log('time: ', time)
    //Grabs thumbnail from video and saves it
    Thumbler(
      {
        type: 'video',
        input: videoInfo.videoFilePath,
        output: './public/uploads/thumb.jpg',
        time: time,
        size: '300x200' // this optional if null will use the dimentions of the video
      },
      function(err, path) {
        if (err) return err;
        return true;
      }
    );
    console.log(videoInfo.videoFilePath, time)
    //Grabs thumbnail from video and saves it
    
  })
  
  //Runs async addFile function to get hash for ipfs
  // ipfs.addFile(videoInfo.videoFileName, videoInfo.videoFilePath).then((data) => {
  //   console.log(data)
  //   console.log('https://ipfs.io/ipfs/',data)
  // }).catch(console.err);
  

  console.log('All video info: ', videoInfo);
  // res.send({upload: 'uploading'})
  res.render('dashboard', {
    title: 'Streambed'
  });
});

router.get('/uploaded', (req, res) => {
  res.send([videoInfo]);
});

/* Sending data back to React componant for upload route */
router.get('/upload', (req, res) => {
  // let token = JSON.parse(accessToken)
  // res.send(accessToken)
  // console.log('the token: ', accessToken)
  res.render('dashboard', { token: accessToken });
  // res.redirect('/upload/' + '?access_token='+accessToken)
});

/* GET login page. */
router.get('/', function(req, res, next) {
  const fileName = process.argv[2];
  res.render('index', { title: 'Streambed' });
});

/* GET analytics page. */
router.get('/analytics', function(req, res, next) {
  analytics
    .runVideoAnalytics()
    .then((data) => {
      console.log('the result: ', data);
      res.render('analytics', {
        display: 'block',
        nav_items_show: 'block',
        channel_snippet_title: data.snippet.title,
        channel_id: data.id,
        channel_statistics_subscriberCount: data.statistics.subscriberCount,
        channel_statistics_viewCount: data.statistics.viewCount,
        channel_statistics_videoCount: data.statistics.videoCount
      });
    })
    .catch(console.err);
});


/* POST route for video file up to youtube*/
router.post('/upload-youtube', (req, res) => {
  console.log('file name: ', videoInfo.videoFilePath);
  youtubeUpload.runUpload(videoInfo);

  res.render('dashboard', {
    title: 'Streambed',
    nav_items_show: 'block',
    msg: 'Uploaded',
    videoSRC: videoInfo.videoFileName
  });
});

router.get('/upload-youtube', (req, res) => {
  res.send([videoInfo]);
});

/* Logout of dashboard and set accessToken to empty string */
router.post('/logout', (req, res) => {
  // res.render('dashboard', { title: 'Youtube', display: "block", nav_items_show: "block" })
  //!!!!!!!!!!!!!!!!!!!!!!!TESTING LOGOUT, ITS PROBABLY WRONG, DOESNT ZERO ANYTHING
  accessToken = '';
  res.redirect('/');
  //!!!!!!!!!!!!!!!!!!!!!!!
});

module.exports = router;





