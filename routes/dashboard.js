const express = require('express');
const router = express.Router();
const client = require('../client.js');
const url = require('url');
const User = require('../task-manager/src/models/user');
const scopes = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube'
];

/* After OAuth routes to /dashboard to update token into header */
router.post('/', (req, res) => {
  client.authenticate(scopes, req.session.userId).then((data) => {
    console.log(data.authorizeUrl);
    let token = data.credentials.access_token;
    access_token = token;
    res.header('authorization', token);
    res.status(200).json({ url: data.authorizeUrl });
  });
});

router.get('/oauth2callback', async (req, res) => {
  console.log(client);
  console.log(req.session);
  const qs = new url.URL(req.url, 'http://localhost:5000').searchParams;
  const { tokens } = await client.oAuth2Client.getToken(qs.get('code'));

  //   this.oAuth2Client.credentials = tokens;
  //   resolve(this.oAuth2Client);

  client.oAuth2Client.setCredentials(tokens);

  /** This saves the rT to the db, userId is not accessible from the server so I sent it from when you click the youtube check box**/
  /** UserId is used look up the logged in user and save the rT**/
  console.log('YOYOYOYOYO', client.oAuth2Client.userId);

  if (tokens.refresh_token) {
    User.findOneAndUpdate(
      { _id: req.session.userId },
      { $set: { rT: tokens.refresh_token } }
    ).then(() => {
      console.log('Line 93 Clientjs');
      res.redirect('/');
    });
  }
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
