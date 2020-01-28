const express = require('express');
const router = express.Router();
const client = require('../client.js');

const scopes = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube'
];

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
router.post('/logout', async (req, res) => {
  res.removeHeader('Authorization');
  res.clearCookie(req.session);
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect('/');
  });
});
/*******Logout route end*/

module.exports = router;
