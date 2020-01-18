const express = require('express');
const router = express.Router();
const fs = require('fs');
const client = require('../client.js');
const jwt = require('jsonwebtoken');
const User = require('../task-manager/src/models/user');

//let access_token = '';

const scopes = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube'
];

/*Route for /dashboard get request to grab tokens from RenderContent component */
// router.get('/', function(req, res) {
//   res.header('authorization', access_token);
//   res.send({ data: 'some random data if needed to be sent' });
// });

/* After OAuth routes to /dashboard to update token into header */
router.post('/', (req, res) => {
  client.authenticate(scopes, req.session.userId).then((data) => {
    let token = data.credentials.access_token;
    access_token = token;
    res.header('authorization', token);
    res.status(200).render('dashboard');
  });
});

/*******Logout route */
router.post('/logout', (req, res) => {
  //! Thinking of fetching rememberYoutube on frontend, then passing to logout on click, checking if false here, then clearing rT if false

  access_token = '';
  res.removeHeader('Authorization');
  res.clearCookie(req.session);
  req.session.destroy((err) => {
    if (err) console.log('line 41', err);
    return res.redirect('/');
  });
});
/*******Logout route end*/

module.exports = router;
