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

/*Not used currently, Route for /dashboard get request to grab tokens from RenderContent component */
router.get('/', function(req, res) {
  console.log('the access token', access_token);
  res.header('authorization', access_token);
  res.send({ data: 'some random data if needed to be sent' });
});

/* After OAuth routes to /dashboard to update token into header */
router.post('/', (req, res) => {
  console.log(req.session.userId);
  client.authenticate(scopes, req.session.userId).then((data) => {
    // const token = jwt.sign({token: data.credentials.access_token}, 'me')
    let token = data.credentials.access_token;
    // let token = '10821309850928375'
    access_token = token;
    res.header('authorization', token);
    res.status(200).render('dashboard');
  });
});

/*******Logout route */
router.post('/logout', (req, res) => {
  access_token = '';
  res.removeHeader('Authorization');
  res.clearCookie(req.session);
  req.session.destroy((err) => {
    if (err) console.log(err);
    return res.redirect('/');
  });
});
/*******Logout route end*/

module.exports = router;
