const express = require('express');
const router = express.Router();
const fs = require('fs');
const client = require('../client.js');
const jwt = require('jsonwebtoken');

let access_token = '';

const scopes = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube'
];

/* Route for /dashboard get request to grab tokens from RenderContent component */
router.get('/', function(req, res) {
  console.log('the access token', access_token);
  res.header('authorization', access_token);
  res.send({ data: 'some random data if needed to be sent' });
});

/* After OAuth routes to /dashboard to update token into header */
router.post('/', (req, res) => {
  client
    .authenticate(scopes)
    .then((data) => {
        // const token = jwt.sign({token: data.credentials.access_token}, 'me')
        let token = data.credentials.access_token;
        access_token = token
        res.header('authorization' , token)
        res.status(200)
        .render('dashboard')
    })
});


module.exports = router;
