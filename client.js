'use strict';

const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');
const fs = require('fs');
const path = require('path');
const User = require('./task-manager/src/models/user');

const keyPath = path.join(__dirname, 'oauthTwo.keys.json');

let keys = {
  redirect_uris: ['http://localhost:5000/oauth2callback']
};

if (fs.existsSync(keyPath)) {
  const keyFile = require(keyPath);
  keys = keyFile.installed || keyFile.web;
}

const invalidRedirectUri = `The provided keyfile does not define a valid
redirect URI. There must be at least one redirect URI defined, and this sample
assumes it redirects to 'http://localhost:5000/oauth2callback'.  Please edit
your keyfile, and add a 'redirect_uris' section.  For example:
"redirect_uris": [
  "http://localhost:5000/oauth2callback"
]`;

//*******************************************READ ME******************************************************/
/****** This Client.js is uesd to set up google Oauth, code below used package to create url***************/
/******Then a page is created with the URL which the user is directed to to auth***************************/
/******Tokens are set, then the refresh token is stored in the DB****************/
// https://github.com/googleapis/google-api-nodejs-client/blob/c00d1892fe70d7ebf934bcebe3e8a5036c62440c/README.md
/****************************************READ ME********************************************************* */

class Client {
  constructor(options) {
    this._options = options || { scopes: [] };

    // validate the redirectUri.  This is a frequent cause of confusion.
    if (!keys.redirect_uris || keys.redirect_uris.length === 0) {
      throw new Error(invalidRedirectUri);
    }
    const redirectUri = keys.redirect_uris[keys.redirect_uris.length - 1];
    const parts = new url.URL(redirectUri);
    if (
      redirectUri.length === 0 ||
      parts.port !== '5000' ||
      parts.hostname !== 'localhost' ||
      parts.pathname !== '/oauth2callback'
    ) {
      throw new Error(invalidRedirectUri);
    }

    // create an oAuth client to authorize the API call
    this.oAuth2Client = new google.auth.OAuth2(
      keys.client_id,
      keys.client_secret,
      redirectUri
    );
  }

  async authenticate(scopes, userId) {
    return new Promise((resolve, reject) => {
      // grab the url that will be used for authorization
      this.authorizeUrl = this.oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' ')
      });
      this.oAuth2Client.authorizeUrl = this.authorizeUrl;
      this.oAuth2Client.userId = userId;
      //   const server = http
      //     .createServer(async (req, res) => {
      //       try {
      //         if (req.url.indexOf('/oauth2callback') > -1) {
      //           const qs = new url.URL(req.url, 'http://localhost:5000')
      //             .searchParams;

      //           res.end(
      //             'Authentication successful! Please return to the console.'
      //           );
      //           server.destroy();
      //           const { tokens } = await this.oAuth2Client.getToken(
      //             qs.get('code')
      //           );

      //           //   this.oAuth2Client.credentials = tokens;
      //           //   resolve(this.oAuth2Client);
      //           let { refresh_token, access_token, expiry_date } = tokens;

      //           this.oAuth2Client.setCredentials(tokens);

      //           /** This saves the rT to the db, userId is not accessible from the server so I sent it from when you click the youtube check box**/
      //           /** UserId is used look up the logged in user and save the rT**/
      //           if (tokens.refresh_token) {
      //             User.findOneAndUpdate(
      //               { _id: userId },
      //               { $set: { rT: tokens.refresh_token } }
      //             ).then(() => console.log('Line 93 Clientjs', rT));
      //           }

      resolve(this.oAuth2Client);
      //         }
      //       } catch (e) {
      //         reject(e);
      //       }
      //     })
      //     .listen(5000, () => {
      //       // open the browser to the authorize url to start the workflow
      //       opn(this.authorizeUrl, { wait: false }).then((cp) => cp.unref());
      //     });

      //   destroyer(server);
    });
  }
  // * Pulls refresh token in remember route, passes to here and sets refresh token. Then refreshes the access token and passes it back
  refresh(rT) {
    console.log('Line 118 in Client.js rT saved');
    this.oAuth2Client.setCredentials({
      refresh_token: rT
    });
  }

  async getNewAcc() {
    const results = await this.oAuth2Client.refreshAccessToken();
    const { access_token } = results.credentials;
    return access_token;
  }
}

module.exports = new Client();
