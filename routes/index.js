const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const client = require('../client.js');
const { google } = require('googleapis');
const youtubeUpload = require('../insert/uploads.js');
const analytics = require('../insert/analytics.js');
const jwt = require('jsonwebtoken')
const Thumbler = require('thumbler');

let videoInfo = {};
let accessToken = ''

const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
  ];


// Set Storage of uploaded video or file on the server
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + path.extname(file.originalname))
    }
})

let upload = multer({
    storage: storage
})

router.post('/uploaded',  upload.array('myFiles', 2), (req, res, next) => {
    console.log('req body: ',req.body.body)
    console.log('req files: ', req.files)
    const body = req.body.body
    const files = req.files
    videoInfo.title = body[0]
    videoInfo.desc = body[1]
    videoInfo.videoFilePath = './'+files[0].path
    videoInfo.videoFileName = files[0].filename
    videoInfo.imgFilePath = './'+files[1].path
    videoInfo.imgFileName = files[1].filename

    Thumbler({
        type: 'video', 
        input: videoInfo.videoFilePath,
        output: './output.jpeg', 
        time: '00:00:5',
        size: '300x200' // this optional if null will use the dimentions of the video
    }, function(err, path){
        if (err) return err;
        console.log(path)
        return true;
    });

    console.log('All video info: ', videoInfo)
    // res.send({upload: 'uploading'})
    res.render('dashboard', { title: 'Youtube',
        display: "none",
        upload_youtube_show: 'block'
    }) 
});

router.get('/uploaded', (req, res) => {
    res.send([videoInfo])
});


/* Sending data back to React componant for upload route */
router.get('/upload', (req, res) => {

    // let token = req.params.id;
    // let token = JSON.parse(accessToken)
    // res.send(accessToken)
    // console.log('the token: ', accessToken)
    res.render('dashboard',{token: accessToken})
    // res.redirect('/upload/' + '?access_token='+accessToken)
});

/* GET login page. */
router.get('/', function (req, res, next) {
    const fileName = process.argv[2];
    res.render('index', { title: 'Youtube'})
});

/* GET analytics page. */
router.get('/analytics', function (req, res, next) {
    analytics.runVideoAnalytics().then((data) => {
       console.log( 'the result: ', data)
        res.render('analytics', { 
            display: "block",
            nav_items_show: "block",
            channel_snippet_title: data.snippet.title,
            channel_id: data.id,
            channel_statistics_subscriberCount: data.statistics.subscriberCount,
            channel_statistics_viewCount: data.statistics.viewCount,
            channel_statistics_videoCount: data.statistics.videoCount
        })
    }).catch(console.err)
})

/* GET dashboard page. (main page) */
router.get('/dashboard', function (req, res, next) {
    res.render('dashboard', { title: 'Youtube', display: "block", nav_items_show: "block" })
});

/* After OAuth routes to the main page */
router.post('/dashboard', (req, res) => {

    // res.render('dashboard', { title: 'Youtube', display: "block", nav_items_show: "block" })
    client
    .authenticate(scopes)
    .then((data) => {
        console.log(data.credentials.access_token)
        accessToken = data.credentials.access_token
        const token = jwt.sign({token: data.credentials.access_token}, 'me')
        res.redirect('http://localhost:5000' + '?access_token=' + data.credentials.access_token)
    //    res.render('dashboard', { title: 'Youtube', display: "block", nav_items_show: "block" })

    }).catch(console.err);
})



/* POST route for video file up to youtube*/
router.post('/upload-youtube', (req, res) => {

    console.log('file name: ',videoInfo.videoFilePath)
    youtubeUpload.runUpload( videoInfo )

    res.render('dashboard', { title: 'Youtube', display: "block", nav_items_show: "block", msg: "Uploaded", display_video: "block", videoSRC: videoInfo.videoFileName})
})

router.get('/upload-youtube', (req, res) => {
    res.send([videoInfo])
})

module.exports = router;
